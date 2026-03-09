import { NextRequest, NextResponse } from "next/server";
import { create, query, getAll } from "@/lib/db";
import { verifyToken } from "@/lib/auth";
import type { HistoriaClinica } from "@/lib/types";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("auth-token")?.value;
  if (!token) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const user = await verifyToken(token);
  if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const pacienteId = searchParams.get("pacienteId");

  let registros: HistoriaClinica[];
  if (pacienteId) {
    registros = await query<HistoriaClinica>("historia", (h) => h.pacienteId === pacienteId);
  } else if (user.rol === "paciente") {
    registros = await query<HistoriaClinica>("historia", (h) => h.pacienteId === user.userId);
  } else {
    registros = await getAll<HistoriaClinica>("historia");
  }

  registros.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
  return NextResponse.json({ registros });
}

// POST — only doctors
export async function POST(req: NextRequest) {
  const token = req.cookies.get("auth-token")?.value;
  if (!token) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const user = await verifyToken(token);
  if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  if (user.rol !== "medico" && user.rol !== "admin") {
    return NextResponse.json({ error: "Solo médicos pueden registrar historia" }, { status: 403 });
  }

  const body = await req.json();
  const { pacienteId, pacienteNombre, tipo, diagnostico, notas, signos } = body;

  if (!pacienteId || !pacienteNombre || !tipo || !diagnostico) {
    return NextResponse.json({ error: "Campos requeridos faltantes" }, { status: 400 });
  }

  const registro: HistoriaClinica = {
    id: crypto.randomUUID(),
    pacienteId,
    pacienteNombre,
    medicoId: user.userId,
    medicoNombre: `${user.nombre} ${user.apellido}`,
    tipo,
    diagnostico,
    notas: notas || "",
    signos,
    fecha: body.fecha || new Date().toISOString(),
    createdAt: new Date().toISOString(),
  };

  await create("historia", registro);
  return NextResponse.json({ registro }, { status: 201 });
}
