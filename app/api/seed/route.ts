import { NextResponse } from "next/server";
import { create, getAll } from "@/lib/db";
import { CURSOS_CATALOGO } from "@/lib/cursos-data";

interface CursoDB {
  id: string;
  titulo: string;
  descripcion: string;
  instructor: string;
  categoria: string;
  duracionHoras: number;
  imagen: string;
  precio: number;
  totalItems: number;
  totalModulos: number;
  createdAt: string;
}

export async function POST() {
  // Clear and reseed
  for (const curso of CURSOS_CATALOGO) {
    const totalItems = curso.modulos.reduce((sum, m) => sum + m.items.length, 0);
    await create<CursoDB>("cursos", {
      id: curso.id,
      titulo: curso.titulo,
      descripcion: curso.descripcion,
      instructor: curso.instructor,
      categoria: curso.categoria,
      duracionHoras: curso.duracionHoras,
      imagen: curso.imagen,
      precio: curso.precio,
      totalItems,
      totalModulos: curso.modulos.length,
      createdAt: new Date().toISOString(),
    });
  }

  return NextResponse.json({ message: "Seed completado", count: CURSOS_CATALOGO.length });
}
