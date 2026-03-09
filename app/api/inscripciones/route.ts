import { NextRequest, NextResponse } from "next/server";
import { create, query, update, getById } from "@/lib/db";
import { verifyToken } from "@/lib/auth";

interface Inscripcion {
  id: string;
  cursoId: string;
  cursoTitulo: string;
  userId: string;
  userNombre: string;
  completedItems: string[];  // "modulo_idx:item_idx" keys
  evaluacionNota: number | null;
  evaluacionAprobada: boolean;
  estado: "activo" | "completado" | "pausado";
  fechaInscripcion: string;
  ultimaActividad: string;
  certificadoFecha: string | null;
}

export async function GET(req: NextRequest) {
  const token = req.cookies.get("auth-token")?.value;
  if (!token) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const user = await verifyToken(token);
  if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId") || user.userId;

  const inscripciones = await query<Inscripcion>("inscripciones", (i) => i.userId === userId);
  inscripciones.sort((a, b) => new Date(b.ultimaActividad).getTime() - new Date(a.ultimaActividad).getTime());
  return NextResponse.json({ inscripciones });
}

// POST — enroll
export async function POST(req: NextRequest) {
  const token = req.cookies.get("auth-token")?.value;
  if (!token) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const user = await verifyToken(token);
  if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const body = await req.json();
  const { cursoId, cursoTitulo } = body;

  if (!cursoId || !cursoTitulo) {
    return NextResponse.json({ error: "cursoId y cursoTitulo requeridos" }, { status: 400 });
  }

  const existing = await query<Inscripcion>("inscripciones", (i) => i.userId === user.userId && i.cursoId === cursoId);
  if (existing.length > 0) {
    return NextResponse.json({ error: "Ya estás inscrito en este curso" }, { status: 409 });
  }

  const inscripcion: Inscripcion = {
    id: crypto.randomUUID(),
    cursoId,
    cursoTitulo,
    userId: user.userId,
    userNombre: `${user.nombre} ${user.apellido}`,
    completedItems: [],
    evaluacionNota: null,
    evaluacionAprobada: false,
    estado: "activo",
    fechaInscripcion: new Date().toISOString(),
    ultimaActividad: new Date().toISOString(),
    certificadoFecha: null,
  };

  await create("inscripciones", inscripcion);
  return NextResponse.json({ inscripcion }, { status: 201 });
}

// PATCH — update progress (toggle item, submit evaluation)
export async function PATCH(req: NextRequest) {
  const token = req.cookies.get("auth-token")?.value;
  if (!token) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const user = await verifyToken(token);
  if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const body = await req.json();
  const { inscripcionId, action, itemKey, evaluacionNota, totalItems } = body;

  if (!inscripcionId) return NextResponse.json({ error: "inscripcionId requerido" }, { status: 400 });

  const updated = await update<Inscripcion>("inscripciones", inscripcionId, (ins) => {
    if (action === "toggle_item") {
      // Disabled: progress is only updated via WhatsApp (Aura guide)
      return ins;
    }

    if (action === "submit_evaluation" && evaluacionNota !== undefined && totalItems !== undefined) {
      const allItemsCompleted = ins.completedItems.length >= totalItems;
      const passed = evaluacionNota >= 70;
      const aprobado = allItemsCompleted && passed;
      return {
        ...ins,
        evaluacionNota,
        evaluacionAprobada: passed,
        estado: aprobado ? "completado" as const : ins.estado,
        certificadoFecha: aprobado ? new Date().toISOString() : ins.certificadoFecha,
        ultimaActividad: new Date().toISOString(),
      };
    }

    return ins;
  });

  if (!updated) return NextResponse.json({ error: "Inscripción no encontrada" }, { status: 404 });
  return NextResponse.json({ inscripcion: updated });
}
