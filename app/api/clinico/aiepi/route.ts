import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { create, getAll, getById } from "@/lib/db";

// POST — Create AIEPI evaluation
export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

  // Only medical professionals can create evaluations
  if (!["medico", "profesional", "enfermero", "admin"].includes(user.rol)) {
    return NextResponse.json({ error: "Solo profesionales de salud pueden crear evaluaciones AIEPI" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const id = crypto.randomUUID();
    const now = new Date().toISOString();

    const evaluacion = {
      id,
      profesional_id: user.userId,
      profesional_nombre: `${user.nombre} ${user.apellido}`,
      profesional_email: user.email,
      ...body,
      version: 1,
      created_at: now,
      updated_at: now,
    };

    await create("aiepi_evaluaciones", evaluacion);

    // Create audit log
    await create("audit_logs", {
      id: crypto.randomUUID(),
      user_id: user.userId,
      rol: user.rol,
      accion: "CREATE",
      recurso_tipo: "aiepi_evaluacion",
      recurso_id: id,
      datos_despues: evaluacion,
      created_at: now,
    });

    return NextResponse.json({ ok: true, id, evaluacion });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Error desconocido";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

// GET — List AIEPI evaluations (for auditor/admin)
export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

  try {
    const evaluaciones = await getAll<Record<string, unknown>>("aiepi_evaluaciones");

    // Filter by role
    if (["admin", "auditor"].includes(user.rol)) {
      // Admin/auditor sees all
      return NextResponse.json({ evaluaciones });
    }

    // Professionals see only their own
    const propias = evaluaciones.filter((e) => e.profesional_id === user.userId);
    return NextResponse.json({ evaluaciones: propias });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Error desconocido";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
