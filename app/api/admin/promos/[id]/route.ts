import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { update, remove, getById } from "@/lib/db";
import type { CodigoPromo } from "@/lib/types";

async function requireAdmin(req: NextRequest) {
  const token = req.cookies.get("auth-token")?.value;
  if (!token) return null;
  const user = await verifyToken(token);
  if (!user || user.rol !== "admin") return null;
  return user;
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const codigoId = id.toUpperCase();
  const user = await requireAdmin(req);
  if (!user) return NextResponse.json({ error: "Solo administradores" }, { status: 403 });

  const body = await req.json().catch(() => ({}));
  const promo = await getById<CodigoPromo>("promos", codigoId);
  if (!promo) return NextResponse.json({ error: "Código no encontrado" }, { status: 404 });

  const updated = await update<CodigoPromo>("promos", codigoId, (p) => {
    const next: CodigoPromo = { ...p, updatedAt: new Date().toISOString() };
    if (typeof body.activo === "boolean") next.activo = body.activo;
    if (typeof body.descripcion === "string") next.descripcion = body.descripcion.trim().slice(0, 200);
    if (body.validoHasta === null) next.validoHasta = null;
    else if (typeof body.validoHasta === "string" && body.validoHasta) next.validoHasta = body.validoHasta;
    if (body.usosMaximos === null) next.usosMaximos = null;
    else if (typeof body.usosMaximos === "number" && body.usosMaximos >= 1) {
      next.usosMaximos = Math.round(body.usosMaximos);
    }
    return next;
  });

  return NextResponse.json({ promo: updated });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await requireAdmin(req);
  if (!user) return NextResponse.json({ error: "Solo administradores" }, { status: 403 });

  const ok = await remove("promos", id.toUpperCase());
  if (!ok) return NextResponse.json({ error: "No se pudo eliminar" }, { status: 500 });
  return NextResponse.json({ ok: true });
}
