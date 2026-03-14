import { NextRequest, NextResponse } from "next/server";
import { create, query, getAll } from "@/lib/db";
import { verifyToken } from "@/lib/auth";
import type { Cita } from "@/lib/types";

// GET /api/citas?pacienteId=xxx or ?medicoId=xxx
export async function GET(req: NextRequest) {
  const token = req.cookies.get("auth-token")?.value;
  if (!token) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const user = await verifyToken(token);
  if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const pacienteId = searchParams.get("pacienteId");
  const medicoId = searchParams.get("medicoId");

  let citas: Cita[];
  if (pacienteId) {
    citas = await query<Cita>("citas", (c) => c.pacienteId === pacienteId);
  } else if (medicoId) {
    citas = await query<Cita>("citas", (c) => c.medicoId === medicoId);
  } else if (user.rol === "paciente") {
    citas = await query<Cita>("citas", (c) => c.pacienteId === user.userId);
  } else {
    citas = await getAll<Cita>("citas");
  }

  citas.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
  return NextResponse.json({ citas });
}

// POST /api/citas
export async function POST(req: NextRequest) {
  const token = req.cookies.get("auth-token")?.value;
  if (!token) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const user = await verifyToken(token);
  if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const body = await req.json();
  const { medicoNombre, especialidad, fecha, hora, tipo, motivo } = body;

  if (!especialidad || !fecha || !hora || !tipo || !motivo) {
    return NextResponse.json({ error: "Campos requeridos: especialidad, fecha, hora, tipo, motivo" }, { status: 400 });
  }

  const medicoNombreFinal = medicoNombre || "Por asignar";
  const cita: Cita = {
    id: crypto.randomUUID(),
    pacienteId: body.pacienteId || user.userId,
    pacienteNombre: body.pacienteNombre || `${user.nombre} ${user.apellido}`,
    medicoId: body.medicoId,
    medicoNombre: medicoNombreFinal,
    especialidad,
    fecha,
    hora,
    tipo,
    estado: "pendiente",
    motivo,
    notas: body.notas,
    createdAt: new Date().toISOString(),
  };

  await create("citas", cita);
  return NextResponse.json({ cita }, { status: 201 });
}
