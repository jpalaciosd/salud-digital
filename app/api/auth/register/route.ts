import { NextRequest, NextResponse } from "next/server";
import { registerUser } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password, nombre, apellido, documento, tipoDocumento, rol, telefono, avatarUrl, descripcionProfesional } = body;

    if (!email || !password || !nombre || !apellido || !documento || !tipoDocumento) {
      return NextResponse.json(
        { error: "Todos los campos obligatorios deben completarse" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "La contraseña debe tener al menos 6 caracteres" },
        { status: 400 }
      );
    }

    const telefonoNormalizado = String(telefono || "").replace(/\D/g, "").slice(-10);
    if (!/^3\d{9}$/.test(telefonoNormalizado)) {
      return NextResponse.json(
        {
          error:
            "El celular WhatsApp es obligatorio (10 dígitos, debe empezar por 3, ej. 3001234567).",
        },
        { status: 400 }
      );
    }

    const result = await registerUser({
      email,
      password,
      nombre,
      apellido,
      documento,
      tipoDocumento,
      rol: rol || "paciente",
      telefono: telefonoNormalizado,
      avatarUrl: avatarUrl || undefined,
      descripcionProfesional: descripcionProfesional || undefined,
    });

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 409 });
    }

    return NextResponse.json({ user: result.user }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
