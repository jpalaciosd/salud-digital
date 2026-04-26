import { NextRequest, NextResponse } from "next/server";
import { getAllUsers } from "@/lib/auth";
import { query } from "@/lib/db";
import type { HistoriaClinica, Formula, Cita } from "@/lib/types";

const API_SECRET = process.env.DR_NOVA_API_SECRET;

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("x-api-key") || "";
  if (!API_SECRET || authHeader !== API_SECRET) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const telefono = searchParams.get("telefono");
  const email = searchParams.get("email");
  if (!telefono && !email) {
    return NextResponse.json(
      { error: "telefono o email es requerido" },
      { status: 400 }
    );
  }

  const users = await getAllUsers();
  let user = null;

  // Try phone first
  if (telefono) {
    const normalizedPhone = telefono.replace(/\D/g, "").slice(-10);
    user = users.find((u) => {
      const userPhone = (u.telefono || "").replace(/\D/g, "").slice(-10);
      return userPhone.length >= 7 && userPhone === normalizedPhone;
    });
  }

  // Fallback to email
  if (!user && email) {
    const normalizedEmail = email.trim().toLowerCase();
    user = users.find((u) => u.email.toLowerCase() === normalizedEmail);
  }

  if (!user) {
    return NextResponse.json(
      { encontrado: false, error: "Usuario no encontrado" },
      { status: 404 }
    );
  }

  const hoy = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

  const [historia, formulas, citas] = await Promise.all([
    query<HistoriaClinica>("historia", (h) => h.pacienteId === user.id),
    query<Formula>("formulas", (f) => f.pacienteId === user.id && f.estado === "activa"),
    query<Cita>("citas", (c) => {
      if (c.pacienteId !== user.id) return false;
      if (c.estado !== "pendiente" && c.estado !== "confirmada") return false;
      return c.fecha >= hoy;
    }),
  ]);

  historia.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
  formulas.sort((a, b) => new Date(b.fechaEmision).getTime() - new Date(a.fechaEmision).getTime());
  citas.sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());

  return NextResponse.json({
    encontrado: true,
    userId: user.id,
    nombreCompleto: `${user.nombre} ${user.apellido}`,
    historia: historia.slice(0, 20),
    formulasActivas: formulas,
    proximasCitas: citas.slice(0, 10),
  });
}
