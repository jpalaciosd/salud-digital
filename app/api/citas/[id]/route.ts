import { NextRequest, NextResponse } from "next/server";
import { getById, update, remove } from "@/lib/db";
import { verifyToken } from "@/lib/auth";
import type { Cita } from "@/lib/types";
import { put } from "@vercel/blob";

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const token = req.cookies.get("auth-token")?.value;
    if (!token) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    const user = await verifyToken(token);
    if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

    const { id } = await context.params;
    const body = await req.json();

    // Direct approach: fetch existing, merge, put back
    const existing = await getById<Cita>("citas", id);
    if (!existing) return NextResponse.json({ error: "Cita no encontrada" }, { status: 404 });

    const updated = { ...existing, ...body, id: existing.id };

    await put(`citas/${id}.json`, JSON.stringify(updated), {
      access: "public",
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType: "application/json",
    });

    return NextResponse.json({ cita: updated });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: "Error interno", detail: message }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const token = req.cookies.get("auth-token")?.value;
    if (!token) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

    const { id } = await context.params;
    await remove("citas", id);
    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: "Error interno", detail: message }, { status: 500 });
  }
}
