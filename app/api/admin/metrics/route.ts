import { NextRequest, NextResponse } from "next/server";
import { verifyToken, getAllUsers } from "@/lib/auth";
import { getAll } from "@/lib/db";

const ADMIN_EMAILS = ["juandiegopalaciosdelgado@gmail.com"];

export async function GET(req: NextRequest) {
  const token = req.cookies.get("auth-token")?.value;
  if (!token) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  
  const payload = await verifyToken(token);
  if (!payload) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  
  // Check admin
  if (payload.rol !== "admin" && !ADMIN_EMAILS.includes(payload.email)) {
    return NextResponse.json({ error: "Solo administradores" }, { status: 403 });
  }

  try {
    const [users, inscripciones, agendas, cursos] = await Promise.all([
      getAllUsers(),
      getAll<Record<string, unknown>>("inscripciones"),
      getAll<Record<string, unknown>>("agendas"),
      getAll<Record<string, unknown>>("cursos"),
    ]);

    return NextResponse.json({
      users: users.map(u => ({
        id: u.id,
        email: u.email,
        nombre: u.nombre,
        apellido: u.apellido,
        rol: u.rol,
        telefono: u.telefono,
        createdAt: u.createdAt,
      })),
      inscripciones,
      agendas,
      cursos,
    });
  } catch (err) {
    console.error("Admin metrics error:", err);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
