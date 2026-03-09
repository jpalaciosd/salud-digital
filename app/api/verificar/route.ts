import { NextRequest, NextResponse } from "next/server";
import { getAllUsers } from "@/lib/auth";
import { query } from "@/lib/db";

const API_SECRET = process.env.PROGRESO_API_SECRET || "salud-digital-progreso-2026";

interface Inscripcion {
  id: string;
  cursoId: string;
  cursoTitulo: string;
  userId: string;
  estado: string;
}

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("x-api-key") || "";
    if (authHeader !== API_SECRET) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const telefono = req.nextUrl.searchParams.get("telefono");
    if (!telefono) {
      return NextResponse.json({ error: "telefono requerido" }, { status: 400 });
    }

    const normalizedPhone = telefono.replace(/\D/g, "").slice(-10);

    const users = await getAllUsers();
    const user = users.find((u) => {
      const userPhone = (u.telefono || "").replace(/\D/g, "").slice(-10);
      return userPhone === normalizedPhone && normalizedPhone.length >= 7;
    });

    if (!user) {
      return NextResponse.json({ registrado: false });
    }

    // Get inscripciones
    const inscripciones = await query<Inscripcion>("inscripciones", (i) => i.userId === user.id);

    return NextResponse.json({
      registrado: true,
      usuario: {
        id: user.id,
        nombre: user.nombre,
        apellido: user.apellido,
        email: user.email,
        rol: user.rol,
      },
      inscripciones: inscripciones.map((i) => ({
        cursoId: i.cursoId,
        cursoTitulo: i.cursoTitulo,
        estado: i.estado,
      })),
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: "Error interno", detail: message }, { status: 500 });
  }
}
