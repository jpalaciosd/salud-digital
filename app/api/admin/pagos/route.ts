import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { getAll } from "@/lib/db";
import type { Pago, EstadoPago } from "@/lib/types";

const ESTADOS_VALIDOS: EstadoPago[] = [
  "pendiente_ia",
  "aprobado_auto",
  "revision_manual",
  "aprobado_manual",
  "rechazado",
  "canjeado",
];

export async function GET(req: NextRequest) {
  const token = req.cookies.get("auth-token")?.value;
  if (!token) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const user = await verifyToken(token);
  if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  if (user.rol !== "admin") return NextResponse.json({ error: "Solo administradores" }, { status: 403 });

  const { searchParams } = new URL(req.url);
  const estadoParam = searchParams.get("estado");

  const all = await getAll<Pago>("pagos");
  const filtered = estadoParam && ESTADOS_VALIDOS.includes(estadoParam as EstadoPago)
    ? all.filter((p) => p.estado === estadoParam)
    : all;

  filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return NextResponse.json({ pagos: filtered });
}
