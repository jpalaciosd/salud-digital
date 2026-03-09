import { NextRequest, NextResponse } from "next/server";
import { create, getAll } from "@/lib/db";
import { verifyToken } from "@/lib/auth";
import type { Curso } from "@/lib/types";

export async function GET() {
  const cursos = await getAll<Curso>("cursos");
  cursos.sort((a, b) => a.titulo.localeCompare(b.titulo));
  return NextResponse.json({ cursos });
}

// POST — admin creates courses
export async function POST(req: NextRequest) {
  const token = req.cookies.get("auth-token")?.value;
  if (!token) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const user = await verifyToken(token);
  if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const body = await req.json();
  const curso: Curso = {
    id: crypto.randomUUID(),
    titulo: body.titulo,
    descripcion: body.descripcion || "",
    instructor: body.instructor || "",
    categoria: body.categoria || "general",
    modulos: body.modulos || 1,
    duracionHoras: body.duracionHoras || 10,
    imagen: body.imagen || "",
    createdAt: new Date().toISOString(),
  };

  await create("cursos", curso);
  return NextResponse.json({ curso }, { status: 201 });
}
