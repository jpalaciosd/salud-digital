import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { create, query } from "@/lib/db";

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  if (!["medico", "profesional", "admin"].includes(user.rol)) {
    return NextResponse.json({ error: "Solo médicos pueden emitir incapacidades" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const id = crypto.randomUUID();
    const now = new Date().toISOString();

    if (!body.diagnostico || !body.dias) {
      return NextResponse.json({ error: "Diagnóstico y días son obligatorios" }, { status: 400 });
    }

    const fechaInicio = body.fecha_inicio || new Date().toISOString().split("T")[0];
    const fechaFin = new Date(new Date(fechaInicio).getTime() + body.dias * 86400000).toISOString().split("T")[0];

    const incapacidad = {
      id,
      org_id: body.org_id || null,
      consulta_id: body.consulta_id || null,
      paciente_nombre: body.paciente_nombre || "",
      paciente_documento: body.paciente_documento || "",
      diagnostico_cie10: body.diagnostico_cie10 || "",
      diagnostico: body.diagnostico || "",
      dias: body.dias,
      fecha_inicio: fechaInicio,
      fecha_fin: fechaFin,
      tipo: body.tipo || "enfermedad_general", // enfermedad_general | accidente_trabajo | maternidad | paternidad
      recomendaciones: body.recomendaciones || "",
      medico_id: user.userId,
      medico_nombre: `${user.nombre} ${user.apellido}`,
      medico_email: user.email,
      created_at: now,
    };

    await create("incapacidades", incapacidad);

    await create("audit_logs", {
      id: crypto.randomUUID(),
      user_id: user.userId, rol: user.rol,
      accion: "CREATE", recurso_tipo: "incapacidad", recurso_id: id,
      datos_despues: { dias: body.dias, tipo: incapacidad.tipo },
      created_at: now,
    });

    return NextResponse.json({ ok: true, id, incapacidad });
  } catch (e: unknown) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Error" }, { status: 500 });
  }
}

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

  try {
    const incapacidades = await query<Record<string, unknown>>("incapacidades", (i) => {
      if (["admin", "auditor"].includes(user.rol)) return true;
      if (["medico", "profesional"].includes(user.rol)) return i.medico_id === user.userId;
      return false;
    });
    incapacidades.sort((a, b) => new Date(b.created_at as string).getTime() - new Date(a.created_at as string).getTime());
    return NextResponse.json({ incapacidades });
  } catch (e: unknown) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Error" }, { status: 500 });
  }
}
