import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { create, getById, update } from "@/lib/db";

// POST — Create/update clinical profile (patient or doctor)
export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

  try {
    const body = await req.json();
    const tipo = body.tipo; // "paciente" | "medico"
    const now = new Date().toISOString();

    if (tipo === "paciente") {
      const perfil = {
        id: user.userId,
        user_id: user.userId,
        user_email: user.email,
        documento_tipo: body.documento_tipo,
        documento_numero: body.documento_numero,
        fecha_nacimiento: body.fecha_nacimiento,
        sexo: body.sexo,
        eps: body.eps,
        direccion: body.direccion,
        ubicacion_actual: body.ubicacion_actual || "",
        telefono: body.telefono,
        contacto_emergencia: body.contacto_emergencia || null,
        antecedentes: body.antecedentes || {
          patologicos: [], quirurgicos: [], farmacologicos: [],
          alergicos: [], familiares: [],
        },
        habitos: body.habitos || {},
        created_at: now,
        updated_at: now,
      };

      // Try update first, create if not exists
      const existing = await getById("perfiles_paciente", user.userId);
      if (existing) {
        await update("perfiles_paciente", user.userId, () => ({ ...perfil, updated_at: now }));
      } else {
        await create("perfiles_paciente", perfil);
      }

      return NextResponse.json({ ok: true, perfil });
    }

    if (tipo === "medico") {
      const perfil = {
        id: user.userId,
        user_id: user.userId,
        user_email: user.email,
        rethus: body.rethus,
        especialidad: body.especialidad,
        institucion: body.institucion || "",
        firma_url: body.firma_url || "",
        disponibilidad: body.disponibilidad || [],
        created_at: now,
        updated_at: now,
      };

      const existing = await getById("perfiles_medico", user.userId);
      if (existing) {
        await update("perfiles_medico", user.userId, () => ({ ...perfil, updated_at: now }));
      } else {
        await create("perfiles_medico", perfil);
      }

      return NextResponse.json({ ok: true, perfil });
    }

    return NextResponse.json({ error: "Tipo de perfil no válido" }, { status: 400 });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

// GET — Get my clinical profile
export async function GET(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

  const tipo = req.nextUrl.searchParams.get("tipo") || "paciente";

  try {
    const collection = tipo === "medico" ? "perfiles_medico" : "perfiles_paciente";
    const perfil = await getById(collection, user.userId);
    return NextResponse.json({ perfil: perfil || null });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
