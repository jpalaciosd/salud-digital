import { NextRequest, NextResponse } from "next/server";
import { loginUser, updateUserProfile } from "@/lib/auth";
import { isAdminEmail } from "@/lib/admin-emails";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email y contraseña son requeridos" },
        { status: 400 }
      );
    }

    const result = await loginUser(email, password);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 401 });
    }

    // Auto-promote a admin si el email está en la lista oficial.
    if (result.user && isAdminEmail(result.user.email) && result.user.rol !== "admin") {
      await updateUserProfile(result.user.email, { rol: "admin" });
      result.user.rol = "admin";
    }

    const response = NextResponse.json({ user: result.user });
    response.cookies.set("auth-token", result.token!, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return response;
  } catch (err) {
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
