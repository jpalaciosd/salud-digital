import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { verifyToken } from "@/lib/auth";
import { create, getById, query } from "@/lib/db";
import { extraerComprobanteNequi } from "@/lib/openai-vision";
import { generarCodigoCanje, tituarContenido } from "@/lib/codigo-canje";
import { CURSOS_CATALOGO } from "@/lib/cursos-data";
import type { Pago, PagoRefIndex, IaData } from "@/lib/types";

const MAX_SIZE = 2 * 1024 * 1024;
const TOLERANCIA_COP = 100;
const CONFIANZA_AUTO = 0.85;

function refToId(ref: string): string {
  return ref.replace(/[^a-zA-Z0-9]/g, "_").slice(0, 80);
}

function horasDesde(iso: string): number | null {
  const t = Date.parse(iso);
  if (isNaN(t)) return null;
  return (Date.now() - t) / (1000 * 60 * 60);
}

export async function POST(req: NextRequest) {
  const token = req.cookies.get("auth-token")?.value;
  if (!token) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const user = await verifyToken(token);
  if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const form = await req.formData();
  const file = form.get("file");
  const cursoId = form.get("cursoId");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Archivo requerido" }, { status: 400 });
  }
  if (typeof cursoId !== "string" || !cursoId) {
    return NextResponse.json({ error: "cursoId requerido" }, { status: 400 });
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: "Imagen demasiado grande (máx 2 MB)" }, { status: 400 });
  }
  if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
    return NextResponse.json({ error: "Formato no soportado (JPG, PNG o WebP)" }, { status: 400 });
  }

  const curso = CURSOS_CATALOGO.find((c) => c.id === cursoId);
  if (!curso) return NextResponse.json({ error: "Curso no encontrado" }, { status: 404 });

  const yaInscrito = await query<{ userId: string; cursoId: string }>(
    "inscripciones",
    (i) => i.userId === user.userId && i.cursoId === cursoId
  );
  if (yaInscrito.length > 0) {
    return NextResponse.json({ error: "Ya estás inscrito en este curso" }, { status: 409 });
  }

  const pagosExistentes = await query<Pago>(
    "pagos",
    (p) =>
      p.userId === user.userId &&
      p.cursoId === cursoId &&
      ["pendiente_ia", "aprobado_auto", "revision_manual", "aprobado_manual"].includes(p.estado)
  );
  if (pagosExistentes.length > 0) {
    const pendiente = pagosExistentes[0];
    return NextResponse.json(
      {
        error: "Ya tienes un pago en proceso para este curso",
        pagoId: pendiente.id,
        estado: pendiente.estado,
        codigoCanje: pendiente.codigoCanje,
      },
      { status: 409 }
    );
  }

  const pagoId = crypto.randomUUID();
  const ext = file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg";
  const buffer = Buffer.from(await file.arrayBuffer());

  const blob = await put(`comprobantes/${pagoId}.${ext}`, buffer, {
    access: "public",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: file.type,
  });

  let iaData: IaData;
  try {
    iaData = await extraerComprobanteNequi(blob.url);
  } catch (err) {
    console.error("[pagos/subir] error IA", err);
    iaData = { confianza: 0, motivosDuda: ["Error al procesar con IA"] };
  }

  const montoOk =
    typeof iaData.monto === "number" &&
    Math.abs(iaData.monto - curso.precio) <= TOLERANCIA_COP;
  const last4Ok =
    iaData.last4 === (process.env.NEQUI_NUMERO_LAST4 || "").replace(/\D/g, "").slice(-4);
  const titularOk =
    !!iaData.titular && tituarContenido(iaData.titular, process.env.NEQUI_TITULAR || "");
  const horas = iaData.fecha ? horasDesde(iaData.fecha) : null;
  const ventanaHoras = Number(process.env.PAGOS_VENTANA_VALIDEZ_HORAS || 24);
  const fechaOk = horas !== null && horas >= -1 && horas <= ventanaHoras;

  let referenciaDuplicada = false;
  if (iaData.referencia) {
    const existing = await getById<PagoRefIndex>("pagos-ref", refToId(iaData.referencia));
    referenciaDuplicada = !!existing;
  }

  const motivos: string[] = [];
  if (!montoOk) motivos.push("monto no coincide con el precio");
  if (!last4Ok) motivos.push("últimos 4 dígitos del Nequi no coinciden");
  if (!titularOk) motivos.push("nombre del titular no coincide");
  if (!fechaOk) motivos.push("fecha fuera de ventana permitida");
  if (referenciaDuplicada) motivos.push("este comprobante ya fue usado");

  const todoOk = montoOk && last4Ok && titularOk && fechaOk && !referenciaDuplicada;

  let estado: Pago["estado"];
  let motivoRechazo: string | undefined;
  let codigoCanje: string | null = null;

  if (referenciaDuplicada) {
    estado = "rechazado";
    motivoRechazo = "Este comprobante ya fue utilizado";
  } else if (todoOk && iaData.confianza >= CONFIANZA_AUTO) {
    estado = "aprobado_auto";
    codigoCanje = generarCodigoCanje();
  } else if (!montoOk && typeof iaData.monto === "number" && Math.abs(iaData.monto - curso.precio) > curso.precio * 0.2) {
    estado = "rechazado";
    motivoRechazo = `El monto del comprobante ($${iaData.monto}) no corresponde al precio del curso ($${curso.precio})`;
  } else {
    estado = "revision_manual";
    motivoRechazo = motivos.join("; ");
  }

  const now = new Date().toISOString();
  const pago: Pago = {
    id: pagoId,
    userId: user.userId,
    userNombre: `${user.nombre} ${user.apellido}`,
    userEmail: user.email,
    cursoId,
    cursoTitulo: curso.titulo,
    montoEsperado: curso.precio,
    imagenUrl: blob.url,
    iaData,
    estado,
    codigoCanje,
    motivoRechazo: estado === "rechazado" || estado === "revision_manual" ? motivoRechazo : undefined,
    createdAt: now,
    updatedAt: now,
  };

  await create("pagos", pago);

  if (iaData.referencia && estado === "aprobado_auto") {
    const refId = refToId(iaData.referencia);
    await create<PagoRefIndex>("pagos-ref", {
      id: refId,
      pagoId,
      createdAt: now,
    });
  }

  return NextResponse.json(
    {
      pagoId,
      estado,
      codigoCanje,
      motivoRechazo: pago.motivoRechazo,
      iaData: { confianza: iaData.confianza, monto: iaData.monto },
    },
    { status: 201 }
  );
}
