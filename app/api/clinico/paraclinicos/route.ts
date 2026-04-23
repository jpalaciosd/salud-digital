import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { create, query } from "@/lib/db";

const EXAMENES_COMUNES = [
  { code: "HC", name: "Hemograma Completo", categoria: "Hematología" },
  { code: "GLU", name: "Glucosa en Ayunas", categoria: "Química" },
  { code: "CREA", name: "Creatinina", categoria: "Química" },
  { code: "BUN", name: "Nitrógeno Ureico (BUN)", categoria: "Química" },
  { code: "TGO", name: "Transaminasa GOT/AST", categoria: "Hepática" },
  { code: "TGP", name: "Transaminasa GPT/ALT", categoria: "Hepática" },
  { code: "COL", name: "Colesterol Total", categoria: "Lípidos" },
  { code: "TRI", name: "Triglicéridos", categoria: "Lípidos" },
  { code: "HDL", name: "Colesterol HDL", categoria: "Lípidos" },
  { code: "LDL", name: "Colesterol LDL", categoria: "Lípidos" },
  { code: "TSH", name: "TSH (Tiroides)", categoria: "Endocrinología" },
  { code: "T4L", name: "T4 Libre", categoria: "Endocrinología" },
  { code: "HBA1C", name: "Hemoglobina Glicosilada", categoria: "Diabetes" },
  { code: "URO", name: "Uroanálisis (Parcial de Orina)", categoria: "Urología" },
  { code: "CITO", name: "Citología Cervicovaginal", categoria: "Ginecología" },
  { code: "PSA", name: "Antígeno Prostático (PSA)", categoria: "Urología" },
  { code: "PCR", name: "Proteína C Reactiva", categoria: "Inflamación" },
  { code: "VSG", name: "Velocidad de Sedimentación (VSG)", categoria: "Inflamación" },
  { code: "ELEC", name: "Electrolitos (Na, K, Cl)", categoria: "Química" },
  { code: "RX-TX", name: "Radiografía de Tórax", categoria: "Imagenología" },
  { code: "ECO-ABD", name: "Ecografía Abdominal", categoria: "Imagenología" },
  { code: "ECG", name: "Electrocardiograma", categoria: "Cardiología" },
  { code: "COPRO", name: "Coprológico", categoria: "Parasitología" },
  { code: "HIV", name: "ELISA VIH", categoria: "Serología" },
  { code: "VDRL", name: "VDRL (Sífilis)", categoria: "Serología" },
  { code: "HBsAg", name: "Antígeno Superficie Hepatitis B", categoria: "Serología" },
];

// GET — Search exams or list orders
export async function GET(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

  const q = req.nextUrl.searchParams.get("q");
  if (q) {
    const term = q.toLowerCase();
    const results = EXAMENES_COMUNES.filter(
      (e) => e.name.toLowerCase().includes(term) || e.code.toLowerCase().includes(term) || e.categoria.toLowerCase().includes(term)
    ).slice(0, 10);
    return NextResponse.json({ examenes: results });
  }

  // List orders
  try {
    const ordenes = await query<Record<string, unknown>>("paraclinicos", (o) => {
      if (["admin", "auditor"].includes(user.rol)) return true;
      if (["medico", "profesional"].includes(user.rol)) return o.medico_id === user.userId;
      return o.paciente_id === user.userId;
    });
    ordenes.sort((a, b) => new Date(b.created_at as string).getTime() - new Date(a.created_at as string).getTime());
    return NextResponse.json({ ordenes });
  } catch (e: unknown) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Error" }, { status: 500 });
  }
}

// POST — Create lab order
export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  if (!["medico", "profesional", "admin"].includes(user.rol)) {
    return NextResponse.json({ error: "Solo médicos pueden ordenar paraclínicos" }, { status: 403 });
  }

  try {
    const body = await req.json();
    if (!body.examenes || body.examenes.length === 0) {
      return NextResponse.json({ error: "Debe incluir al menos un examen" }, { status: 400 });
    }

    const id = crypto.randomUUID();
    const now = new Date().toISOString();

    const orden = {
      id,
      org_id: body.org_id || null,
      consulta_id: body.consulta_id || null,
      paciente_nombre: body.paciente_nombre || "",
      paciente_documento: body.paciente_documento || "",
      paciente_id: body.paciente_id || null,
      diagnostico: body.diagnostico || "",
      examenes: body.examenes, // [{code, name, categoria, indicaciones?}]
      prioridad: body.prioridad || "normal", // normal | urgente
      indicaciones_generales: body.indicaciones || "",
      medico_id: user.userId,
      medico_nombre: `${user.nombre} ${user.apellido}`,
      estado: "emitida", // emitida | en_proceso | completada
      created_at: now,
    };

    await create("paraclinicos", orden);

    await create("audit_logs", {
      id: crypto.randomUUID(),
      user_id: user.userId, rol: user.rol,
      accion: "CREATE", recurso_tipo: "paraclinico", recurso_id: id,
      datos_despues: { examenes_count: body.examenes.length, prioridad: orden.prioridad },
      created_at: now,
    });

    return NextResponse.json({ ok: true, id, orden });
  } catch (e: unknown) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Error" }, { status: 500 });
  }
}
