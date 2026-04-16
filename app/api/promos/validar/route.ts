import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { CURSOS_CATALOGO } from "@/lib/cursos-data";
import { validarCodigoParaPago } from "@/lib/promos";

export async function POST(req: NextRequest) {
  const token = req.cookies.get("auth-token")?.value;
  if (!token) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const user = await verifyToken(token);
  if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const codigo = typeof body.codigo === "string" ? body.codigo : "";
  const cursoId = typeof body.cursoId === "string" ? body.cursoId : "";
  if (!codigo || !cursoId) {
    return NextResponse.json({ error: "codigo y cursoId requeridos" }, { status: 400 });
  }

  const curso = CURSOS_CATALOGO.find((c) => c.id === cursoId);
  if (!curso) return NextResponse.json({ error: "Curso no encontrado" }, { status: 404 });

  const r = await validarCodigoParaPago(codigo, user.userId, curso.precio);
  if (!r.valido) {
    return NextResponse.json({ valido: false, motivo: r.motivo }, { status: 200 });
  }

  return NextResponse.json({
    valido: true,
    descripcion: r.promo!.descripcion,
    porcentaje: r.promo!.porcentaje,
    descuentoCop: r.descuentoCop,
    precioOriginal: curso.precio,
    precioFinal: r.precioFinal,
  });
}
