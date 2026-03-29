import { NextRequest, NextResponse } from "next/server";
import { create, getAll } from "@/lib/db";
import { verifyToken } from "@/lib/auth";

export interface Agenda {
  id: string;
  estudianteId: string;
  estudianteNombre: string;
  estudianteEmail: string;
  cursoId: string;
  cursoNombre: string;
  tema: string;
  modalidad: "virtual" | "presencial";
  fechaPropuesta: string;
  horaPropuesta: string;
  notas: string;
  estado: "pendiente" | "aceptada" | "completada" | "cancelada";
  profesionalId: string | null;
  profesionalNombre: string | null;
  profesionalEspecialidad: string | null;
  calificacion: number | null;
  createdAt: string;
  updatedAt: string;
}

// GET — list agendas (filtered by role)
export async function GET(req: NextRequest) {
  const token = req.cookies.get("auth-token")?.value;
  if (!token) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const user = await verifyToken(token);
  if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const all = await getAll<Agenda>("agendas");
  const rol = (user as Record<string, string>).rol || "estudiante";
  const userId = (user as Record<string, string>).id;

  if (rol === "profesional") {
    // Professionals see: pending (pool) + their own accepted/completed
    const filtered = all.filter(a =>
      a.estado === "pendiente" || a.profesionalId === userId
    );
    filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return NextResponse.json({ agendas: filtered });
  } else {
    // Students see only their own
    const filtered = all.filter(a => a.estudianteId === userId);
    filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return NextResponse.json({ agendas: filtered });
  }
}

// POST — student creates a tutoring request
export async function POST(req: NextRequest) {
  const token = req.cookies.get("auth-token")?.value;
  if (!token) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const user = await verifyToken(token);
  if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const body = await req.json();
  const { cursoId, cursoNombre, tema, modalidad, fechaPropuesta, horaPropuesta, notas } = body;

  if (!cursoId || !tema || !modalidad || !fechaPropuesta || !horaPropuesta) {
    return NextResponse.json({ error: "Campos requeridos: cursoId, tema, modalidad, fecha, hora" }, { status: 400 });
  }

  const u = user as Record<string, string>;
  const agenda: Agenda = {
    id: crypto.randomUUID(),
    estudianteId: u.id,
    estudianteNombre: `${u.nombre} ${u.apellido}`,
    estudianteEmail: u.email,
    cursoId,
    cursoNombre: cursoNombre || cursoId,
    tema,
    modalidad,
    fechaPropuesta,
    horaPropuesta,
    notas: notas || "",
    estado: "pendiente",
    profesionalId: null,
    profesionalNombre: null,
    profesionalEspecialidad: null,
    calificacion: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  await create("agendas", agenda);
  return NextResponse.json({ agenda }, { status: 201 });
}
