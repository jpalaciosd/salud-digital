import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { create, query, update } from "@/lib/db";
import type { Pago } from "@/lib/types";

interface InscripcionRecord {
  id: string;
  cursoId: string;
  cursoTitulo: string;
  userId: string;
  userNombre: string;
  completedItems: string[];
  evaluacionNota: number | null;
  evaluacionAprobada: boolean;
  estado: "activo" | "completado" | "pausado";
  fechaInscripcion: string;
  ultimaActividad: string;
  certificadoFecha: string | null;
}

export async function POST(req: NextRequest) {
  const token = req.cookies.get("auth-token")?.value;
  if (!token) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const user = await verifyToken(token);
  if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const codigoCanje = typeof body.codigoCanje === "string" ? body.codigoCanje.trim().toUpperCase() : "";
  if (!codigoCanje) {
    return NextResponse.json({ error: "codigoCanje requerido" }, { status: 400 });
  }

  const matches = await query<Pago>("pagos", (p) => p.codigoCanje === codigoCanje);
  const pago = matches[0];
  if (!pago) {
    return NextResponse.json({ error: "Código no válido" }, { status: 404 });
  }

  if (pago.userId !== user.userId) {
    return NextResponse.json({ error: "Este código no pertenece a tu cuenta" }, { status: 403 });
  }
  if (pago.estado === "canjeado") {
    return NextResponse.json({ error: "Este código ya fue utilizado" }, { status: 409 });
  }
  if (!["aprobado_auto", "aprobado_manual"].includes(pago.estado)) {
    return NextResponse.json({ error: "Este pago aún no está aprobado" }, { status: 409 });
  }

  const existing = await query<InscripcionRecord>(
    "inscripciones",
    (i) => i.userId === user.userId && i.cursoId === pago.cursoId
  );
  if (existing.length > 0) {
    await update<Pago>("pagos", pago.id, (p) => ({
      ...p,
      estado: "canjeado",
      updatedAt: new Date().toISOString(),
    }));
    return NextResponse.json({ inscripcion: existing[0], alreadyEnrolled: true });
  }

  const now = new Date().toISOString();
  const inscripcion: InscripcionRecord = {
    id: crypto.randomUUID(),
    cursoId: pago.cursoId,
    cursoTitulo: pago.cursoTitulo,
    userId: user.userId,
    userNombre: `${user.nombre} ${user.apellido}`,
    completedItems: [],
    evaluacionNota: null,
    evaluacionAprobada: false,
    estado: "activo",
    fechaInscripcion: now,
    ultimaActividad: now,
    certificadoFecha: null,
  };

  await create("inscripciones", inscripcion);

  await update<Pago>("pagos", pago.id, (p) => ({
    ...p,
    estado: "canjeado",
    updatedAt: now,
  }));

  return NextResponse.json({ inscripcion }, { status: 201 });
}
