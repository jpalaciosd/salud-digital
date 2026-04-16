import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { create, getAll, getById } from "@/lib/db";
import type { CodigoPromo } from "@/lib/types";

function sanitizarCodigo(s: unknown): string | null {
  if (typeof s !== "string") return null;
  const c = s.trim().toUpperCase().replace(/[^A-Z0-9_-]/g, "");
  return c.length >= 3 && c.length <= 24 ? c : null;
}

export async function GET(req: NextRequest) {
  const token = req.cookies.get("auth-token")?.value;
  if (!token) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const user = await verifyToken(token);
  if (!user || user.rol !== "admin") {
    return NextResponse.json({ error: "Solo administradores" }, { status: 403 });
  }

  const promos = await getAll<CodigoPromo>("promos");
  promos.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  return NextResponse.json({ promos });
}

export async function POST(req: NextRequest) {
  const token = req.cookies.get("auth-token")?.value;
  if (!token) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const user = await verifyToken(token);
  if (!user || user.rol !== "admin") {
    return NextResponse.json({ error: "Solo administradores" }, { status: 403 });
  }

  const body = await req.json().catch(() => ({}));
  const codigo = sanitizarCodigo(body.codigo);
  if (!codigo) {
    return NextResponse.json(
      { error: "Código inválido. Usa 3-24 caracteres alfanuméricos, guiones o guiones bajos." },
      { status: 400 }
    );
  }

  const porcentaje = Number(body.porcentaje);
  if (!Number.isFinite(porcentaje) || porcentaje < 1 || porcentaje > 99) {
    return NextResponse.json({ error: "Porcentaje debe estar entre 1 y 99" }, { status: 400 });
  }

  const descripcion = typeof body.descripcion === "string" ? body.descripcion.trim().slice(0, 200) : "";

  const validoDesde = typeof body.validoDesde === "string" && body.validoDesde
    ? body.validoDesde
    : new Date().toISOString();

  const validoHasta = typeof body.validoHasta === "string" && body.validoHasta ? body.validoHasta : null;
  if (validoHasta && Date.parse(validoHasta) <= Date.parse(validoDesde)) {
    return NextResponse.json({ error: "validoHasta debe ser posterior a validoDesde" }, { status: 400 });
  }

  const usosMaximos = body.usosMaximos === null || body.usosMaximos === undefined || body.usosMaximos === ""
    ? null
    : Number(body.usosMaximos);
  if (usosMaximos !== null && (!Number.isFinite(usosMaximos) || usosMaximos < 1)) {
    return NextResponse.json({ error: "usosMaximos debe ser un entero positivo o nulo" }, { status: 400 });
  }

  const unoPorUsuario = body.unoPorUsuario !== false;

  const existing = await getById<CodigoPromo>("promos", codigo);
  if (existing) {
    return NextResponse.json({ error: "Ya existe un código con ese nombre" }, { status: 409 });
  }

  const now = new Date().toISOString();
  const promo: CodigoPromo = {
    id: codigo,
    descripcion,
    porcentaje: Math.round(porcentaje),
    validoDesde,
    validoHasta,
    usosMaximos,
    usosActuales: 0,
    unoPorUsuario,
    activo: true,
    createdBy: user.email,
    createdAt: now,
    updatedAt: now,
  };

  await create("promos", promo);
  return NextResponse.json({ promo }, { status: 201 });
}
