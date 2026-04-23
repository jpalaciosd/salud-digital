import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { create, getAll, query, update } from "@/lib/db";

// POST — Create clinical consultation
export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

  try {
    const body = await req.json();
    const id = crypto.randomUUID();
    const now = new Date().toISOString();

    const consulta = {
      id,
      org_id: body.org_id || null,
      tipo: body.tipo || "teleconsulta_sincronica", // teleconsulta_sincronica | teleconsulta_asincronica | presencial
      estado: "programada", // programada | en_curso | completada | cancelada | no_asistio
      paciente_id: body.paciente_id || (user.rol === "paciente" || user.rol === "estudiante" ? user.userId : null),
      paciente_nombre: body.paciente_nombre || "",
      medico_id: body.medico_id || (["medico", "profesional"].includes(user.rol) ? user.userId : null),
      medico_nombre: body.medico_nombre || "",
      especialidad: body.especialidad || "medicina_general",
      motivo: body.motivo || "",
      fecha_programada: body.fecha_programada || null,
      hora_inicio: body.hora_inicio || null,
      hora_fin: null,
      notas_previas: body.notas || "",
      hce_id: null,
      formula_id: null,
      consentimiento_id: body.consentimiento_id || null,
      created_by: user.userId,
      created_at: now,
      updated_at: now,
    };

    await create("consultas", consulta);

    await create("audit_logs", {
      id: crypto.randomUUID(),
      org_id: body.org_id || null,
      user_id: user.userId,
      rol: user.rol,
      accion: "CREATE",
      recurso_tipo: "consulta",
      recurso_id: id,
      datos_despues: { tipo: consulta.tipo, estado: consulta.estado, especialidad: consulta.especialidad },
      created_at: now,
    });

    return NextResponse.json({ ok: true, id, consulta });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

// GET — List consultations
export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

  try {
    let consultas = await getAll<Record<string, unknown>>("consultas");

    if (["admin", "super_admin", "auditor"].includes(user.rol)) {
      // See all
    } else if (["medico", "profesional"].includes(user.rol)) {
      consultas = consultas.filter((c) => c.medico_id === user.userId);
    } else {
      consultas = consultas.filter((c) => c.paciente_id === user.userId);
    }

    consultas.sort((a, b) => new Date(b.created_at as string).getTime() - new Date(a.created_at as string).getTime());

    return NextResponse.json({ consultas });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

// PATCH — Update consultation status
export async function PATCH(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

  try {
    const body = await req.json();
    if (!body.id || !body.estado) return NextResponse.json({ error: "id y estado requeridos" }, { status: 400 });

    const validTransitions: Record<string, string[]> = {
      programada: ["en_curso", "cancelada", "no_asistio"],
      en_curso: ["completada", "cancelada"],
    };

    const updated = await update("consultas", body.id, (prev: Record<string, unknown>) => {
      const allowed = validTransitions[prev.estado as string] || [];
      if (!allowed.includes(body.estado)) throw new Error(`Transición inválida: ${prev.estado} → ${body.estado}`);
      return {
        ...prev,
        estado: body.estado,
        hora_fin: body.estado === "completada" ? new Date().toISOString() : prev.hora_fin,
        hce_id: body.hce_id || prev.hce_id,
        formula_id: body.formula_id || prev.formula_id,
        updated_at: new Date().toISOString(),
      };
    });

    await create("audit_logs", {
      id: crypto.randomUUID(),
      user_id: user.userId,
      rol: user.rol,
      accion: "UPDATE",
      recurso_tipo: "consulta",
      recurso_id: body.id,
      datos_despues: { estado: body.estado },
      created_at: new Date().toISOString(),
    });

    return NextResponse.json({ ok: true, consulta: updated });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
