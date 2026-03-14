import { NextResponse } from "next/server";
import { getAllUsers } from "@/lib/auth";

// GET /api/medicos — public list of doctors (for appointment booking)
export async function GET() {
  const allUsers = await getAllUsers();
  const medicos = allUsers
    .filter((u) => u.rol === "medico")
    .map((u) => ({
      id: u.id,
      nombre: u.nombre,
      apellido: u.apellido,
      documento: u.documento,
      avatarUrl: u.avatarUrl,
      descripcionProfesional: u.descripcionProfesional,
    }));
  return NextResponse.json({ medicos });
}
