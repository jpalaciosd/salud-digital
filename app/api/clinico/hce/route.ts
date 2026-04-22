import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { create, getAll, getById, query } from "@/lib/db";

// POST — Create HCE record
export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

  if (!["medico", "profesional", "admin"].includes(user.rol)) {
    return NextResponse.json({ error: "Solo médicos pueden crear registros clínicos" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const id = crypto.randomUUID();
    const now = new Date().toISOString();

    // Validate required fields
    if (!body.motivo_consulta) return NextResponse.json({ error: "Motivo de consulta es obligatorio" }, { status: 400 });
    if (!body.diagnosticos || body.diagnosticos.length === 0) return NextResponse.json({ error: "Al menos un diagnóstico CIE-10 es obligatorio" }, { status: 400 });

    const hce = {
      id,
      org_id: body.org_id || null,
      consulta_id: body.consulta_id || null,
      version: 1,
      motivo_consulta: body.motivo_consulta,
      enfermedad_actual: body.enfermedad_actual || "",
      antecedentes_consulta: body.antecedentes_consulta || null,
      revision_sistemas: body.revision_sistemas || null,
      examen_fisico: body.examen_fisico || null,
      signos_vitales: body.signos_vitales || null,
      limitaciones_teleconsulta: body.limitaciones_teleconsulta || "Examen físico limitado por modalidad virtual",
      diagnosticos: body.diagnosticos, // [{cie10, descripcion, tipo}]
      plan_manejo: body.plan_manejo || null,
      seguimiento: body.seguimiento || null,
      alertas_riesgos: body.alertas_riesgos || null,
      paciente_id: body.paciente_id,
      medico_nombre: `${user.nombre} ${user.apellido}`,
      medico_email: user.email,
      created_by: user.userId,
      created_at: now,
    };

    await create("hce_registros", hce);

    // Audit log
    await create("audit_logs", {
      id: crypto.randomUUID(),
      org_id: body.org_id || null,
      user_id: user.userId,
      rol: user.rol,
      accion: "CREATE",
      recurso_tipo: "hce_registro",
      recurso_id: id,
      datos_despues: { motivo: hce.motivo_consulta, diagnosticos: hce.diagnosticos },
      created_at: now,
    });

    return NextResponse.json({ ok: true, id, hce });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

// GET — List HCE records
export async function GET(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

  const pacienteId = req.nextUrl.searchParams.get("paciente_id");

  try {
    const registros = await getAll<Record<string, unknown>>("hce_registros");

    // Admin/auditor sees all
    if (["admin", "auditor"].includes(user.rol)) {
      const filtered = pacienteId ? registros.filter((r) => r.paciente_id === pacienteId) : registros;
      return NextResponse.json({ registros: filtered });
    }

    // Doctor sees their own records
    if (["medico", "profesional"].includes(user.rol)) {
      const propios = registros.filter((r) => r.created_by === user.userId);
      return NextResponse.json({ registros: propios });
    }

    // Patient sees their own HCE (read-only, partial)
    const propios = registros.filter((r) => r.paciente_id === user.userId);
    const parciales = propios.map((r) => ({
      id: r.id,
      motivo_consulta: r.motivo_consulta,
      diagnosticos: r.diagnosticos,
      plan_manejo: r.plan_manejo,
      medico_nombre: r.medico_nombre,
      created_at: r.created_at,
    }));
    return NextResponse.json({ registros: parciales });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
