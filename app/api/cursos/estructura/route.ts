import { NextResponse } from "next/server";
import { CURSOS_CATALOGO } from "@/lib/cursos-data";

// Public endpoint — returns full course structure for the Lambda bot
// Format matches what prompts.py expects: { cursos: { [id]: { nombre, modulos: [{ id, titulo, temas }] } } }
export const revalidate = 0; // no cache

export async function GET() {
  const cursos: Record<string, {
    nombre: string;
    modulos: { id: number; titulo: string; temas: string[] }[];
  }> = {};

  for (const curso of CURSOS_CATALOGO) {
    cursos[curso.id] = {
      nombre: curso.titulo,
      modulos: curso.modulos.map((mod, idx) => ({
        id: idx + 1,
        titulo: mod.titulo,
        temas: mod.items,
      })),
    };
  }

  return NextResponse.json({ cursos, count: CURSOS_CATALOGO.length, ts: new Date().toISOString() });
}
