import { NextRequest, NextResponse } from "next/server";
import { verifyToken, getAllUsers } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("auth-token")?.value;
  if (!token) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const user = await verifyToken(token);
  if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  if (user.rol !== "medico" && user.rol !== "admin") {
    return NextResponse.json({ error: "Solo médicos pueden ver pacientes" }, { status: 403 });
  }

  const allUsers = await getAllUsers();
  const pacientes = allUsers.filter((u) => u.rol === "paciente");
  return NextResponse.json({ pacientes });
}
