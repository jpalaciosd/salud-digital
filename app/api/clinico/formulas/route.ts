import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { create, query } from "@/lib/db";

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  if (!["medico", "profesional", "admin"].includes(user.rol)) {
    return NextResponse.json({ error: "Solo médicos pueden formular" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const id = crypto.randomUUID();
    const now = new Date().toISOString();

    if (!body.medicamentos || body.medicamentos.length === 0) {
      return NextResponse.json({ error: "Debe incluir al menos un medicamento" }, { status: 400 });
    }

    const formula = {
      id,
      org_id: body.org_id || null,
      consulta_id: body.consulta_id || null,
      medico_id: user.userId,
      medico_nombre: `${user.nombre} ${user.apellido}`,
      medico_email: user.email,
      paciente_nombre: body.paciente_nombre || "",
      paciente_documento: body.paciente_documento || "",
      medicamentos: body.medicamentos,
      diagnostico: body.diagnostico || "",
      observaciones: body.observaciones || "",
      created_at: now,
    };

    await create("formulas_medicas", formula);

    await create("audit_logs", {
      id: crypto.randomUUID(),
      user_id: user.userId,
      rol: user.rol,
      accion: "CREATE",
      recurso_tipo: "formula_medica",
      recurso_id: id,
      datos_despues: { medicamentos_count: body.medicamentos.length },
      created_at: now,
    });

    return NextResponse.json({ ok: true, id, formula });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

  try {
    const formulas = await query<Record<string, unknown>>("formulas_medicas", (f) => {
      if (["admin", "auditor"].includes(user.rol)) return true;
      if (["medico", "profesional"].includes(user.rol)) return f.medico_id === user.userId;
      return false;
    });
    return NextResponse.json({ formulas });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
