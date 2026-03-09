import { NextRequest, NextResponse } from "next/server";
import { create, query, getAll } from "@/lib/db";
import { verifyToken } from "@/lib/auth";
import type { Formula } from "@/lib/types";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("auth-token")?.value;
  if (!token) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const user = await verifyToken(token);
  if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const pacienteId = searchParams.get("pacienteId");

  let formulas: Formula[];
  if (pacienteId) {
    formulas = await query<Formula>("formulas", (f) => f.pacienteId === pacienteId);
  } else if (user.rol === "paciente") {
    formulas = await query<Formula>("formulas", (f) => f.pacienteId === user.userId);
  } else if (user.rol === "medico") {
    formulas = await query<Formula>("formulas", (f) => f.medicoId === user.userId);
  } else {
    formulas = await getAll<Formula>("formulas");
  }

  formulas.sort((a, b) => new Date(b.fechaEmision).getTime() - new Date(a.fechaEmision).getTime());
  return NextResponse.json({ formulas });
}

// POST — only doctors can create
export async function POST(req: NextRequest) {
  const token = req.cookies.get("auth-token")?.value;
  if (!token) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const user = await verifyToken(token);
  if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  if (user.rol !== "medico" && user.rol !== "admin") {
    return NextResponse.json({ error: "Solo médicos pueden crear fórmulas" }, { status: 403 });
  }

  const body = await req.json();
  const { pacienteId, pacienteNombre, medicamentos, diagnostico, duracionDias } = body;

  if (!pacienteId || !pacienteNombre || !medicamentos?.length || !diagnostico) {
    return NextResponse.json({ error: "Campos requeridos faltantes" }, { status: 400 });
  }

  const now = new Date();
  const vencimiento = new Date(now);
  vencimiento.setDate(vencimiento.getDate() + (duracionDias || 30));

  const formula: Formula = {
    id: crypto.randomUUID(),
    pacienteId,
    pacienteNombre,
    medicoId: user.userId,
    medicoNombre: `${user.nombre} ${user.apellido}`,
    medicamentos,
    diagnostico,
    observaciones: body.observaciones,
    estado: "activa",
    fechaEmision: now.toISOString(),
    fechaVencimiento: vencimiento.toISOString(),
    createdAt: now.toISOString(),
  };

  await create("formulas", formula);
  return NextResponse.json({ formula }, { status: 201 });
}
