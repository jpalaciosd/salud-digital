import { NextRequest, NextResponse } from "next/server";
import { update, getById } from "@/lib/db";
import { verifyToken } from "@/lib/auth";
import type { Agenda } from "../route";

// PATCH — accept, complete, cancel, or rate an agenda
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const token = req.cookies.get("auth-token")?.value;
  if (!token) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const user = await verifyToken(token);
  if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const u = user as Record<string, string>;
  const body = await req.json();
  const { accion, calificacion } = body; // accion: "aceptar" | "completar" | "cancelar" | "calificar"

  const existing = await getById<Agenda>("agendas", id);
  if (!existing) return NextResponse.json({ error: "Agenda no encontrada" }, { status: 404 });

  const updated = await update<Agenda>("agendas", id, (a) => {
    if (accion === "aceptar" && a.estado === "pendiente" && u.rol === "profesional") {
      a.estado = "aceptada";
      a.profesionalId = u.id;
      a.profesionalNombre = `${u.nombre} ${u.apellido}`;
      a.profesionalEspecialidad = u.descripcionProfesional || "General";
    } else if (accion === "completar" && a.estado === "aceptada" && a.profesionalId === u.id) {
      a.estado = "completada";
    } else if (accion === "cancelar" && (a.estudianteId === u.id || a.profesionalId === u.id)) {
      a.estado = "cancelada";
    } else if (accion === "calificar" && a.estado === "completada" && a.estudianteId === u.id && calificacion) {
      a.calificacion = Math.min(5, Math.max(1, Number(calificacion)));
    }
    a.updatedAt = new Date().toISOString();
    return a;
  });

  return NextResponse.json({ agenda: updated });
}
