import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser, getAllUsers } from "@/lib/auth";
import { put } from "@vercel/blob";

export async function POST(req: NextRequest) {
  const me = await getCurrentUser();
  if (!me || me.rol !== "admin") {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { email, updates } = await req.json();
  if (!email || !updates) {
    return NextResponse.json({ error: "email y updates requeridos" }, { status: 400 });
  }

  const users = await getAllUsers();
  const user = users.find((u) => u.email === email);
  if (!user) {
    return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
  }

  const patched = { ...user, ...updates };
  await put(`users/${email}.json`, JSON.stringify(patched), {
    access: "public",
    addRandomSuffix: false,
    allowOverwrite: true,
  });

  return NextResponse.json({ ok: true, user: patched });
}
