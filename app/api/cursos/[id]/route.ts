import { NextRequest, NextResponse } from "next/server";
import { CURSOS_CATALOGO } from "@/lib/cursos-data";

// GET /api/cursos/:id — full course content (modules, items, evaluation)
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const curso = CURSOS_CATALOGO.find(c => c.id === id);
  if (!curso) return NextResponse.json({ error: "Curso no encontrado" }, { status: 404 });
  return NextResponse.json({ curso });
}
