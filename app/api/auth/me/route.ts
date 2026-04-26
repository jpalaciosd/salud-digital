import { NextRequest, NextResponse } from "next/server";
import {
  verifyToken,
  updateUserProfile,
  getUserPublicByEmail,
  type UserProfileUpdate,
} from "@/lib/auth";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("auth-token")?.value;
  if (!token) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  const payload = await verifyToken(token);
  if (!payload) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  const full = await getUserPublicByEmail(payload.email);
  if (!full) {
    return NextResponse.json({ user: payload });
  }

  return NextResponse.json({
    user: { userId: full.id, ...full },
  });
}

const EDITABLE_FIELDS = [
  "nombre",
  "apellido",
  "documento",
  "tipoDocumento",
  "telefono",
  "avatarUrl",
  "descripcionProfesional",
  "especialidad",
] as const;

function normalizePhoneCO(input: string): string {
  return String(input || "").replace(/\D/g, "").slice(-10);
}

export async function PATCH(req: NextRequest) {
  const token = req.cookies.get("auth-token")?.value;
  if (!token) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }
  const payload = await verifyToken(token);
  if (!payload?.email) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Body inválido" }, { status: 400 });
  }

  const patch: UserProfileUpdate = {};
  for (const key of EDITABLE_FIELDS) {
    if (key in body) {
      const value = body[key];
      if (typeof value !== "string") continue;
      (patch as Record<string, string>)[key] = value;
    }
  }

  if (typeof patch.telefono === "string") {
    const normalized = normalizePhoneCO(patch.telefono);
    if (!/^3\d{9}$/.test(normalized)) {
      return NextResponse.json(
        {
          error:
            "Teléfono inválido. Debe ser un celular colombiano de 10 dígitos (ej. 3001234567).",
        },
        { status: 400 }
      );
    }
    patch.telefono = normalized;
  }

  const result = await updateUserProfile(payload.email, patch);
  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 404 });
  }

  return NextResponse.json({ user: result.user });
}
