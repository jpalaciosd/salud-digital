import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { create, query } from "@/lib/db";

const TEXTO_CONSENTIMIENTO_TELEMEDICINA = `CONSENTIMIENTO INFORMADO PARA TELEMEDICINA — ISSI

Yo, como paciente o representante legal, declaro que:

1. ACEPTO recibir atención en salud a través de medios tecnológicos (teleconsulta), entendiendo que esta modalidad tiene limitaciones en el examen físico.

2. COMPRENDO que la teleconsulta NO reemplaza la atención presencial cuando esta sea necesaria, y que el profesional de salud podrá remitirme a atención presencial si lo considera pertinente.

3. AUTORIZO el tratamiento de mis datos personales y datos sensibles de salud conforme a la Ley 1581 de 2012 (Protección de Datos Personales) y la Resolución 2654 de 2019 (Telesalud).

4. COMPRENDO las limitaciones del examen físico en modalidad virtual y acepto que el profesional documentará dichas limitaciones en la historia clínica.

5. He sido informado(a) sobre los signos de alarma por los cuales debo acudir a urgencias de manera presencial.

Este consentimiento queda registrado electrónicamente con fecha, hora e identificación del dispositivo.

Base normativa: Resolución 2654 de 2019, Resolución 1995 de 1999, Ley 1581 de 2012.`;

// POST — Register consent
export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

  try {
    const body = await req.json();
    const id = crypto.randomUUID();
    const now = new Date().toISOString();

    const consentimiento = {
      id,
      org_id: body.org_id || null,
      paciente_id: user.userId,
      consulta_id: body.consulta_id || null,
      tipo: body.tipo || "telemedicina",
      aceptado: body.aceptado === true,
      texto_mostrado: TEXTO_CONSENTIMIENTO_TELEMEDICINA,
      ip_address: req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown",
      user_agent: req.headers.get("user-agent") || "unknown",
      created_at: now,
    };

    if (!consentimiento.aceptado) {
      return NextResponse.json({ error: "Debe aceptar el consentimiento para continuar" }, { status: 400 });
    }

    await create("consentimientos", consentimiento);

    // Audit
    await create("audit_logs", {
      id: crypto.randomUUID(),
      org_id: body.org_id || null,
      user_id: user.userId,
      rol: user.rol,
      accion: "CREATE",
      recurso_tipo: "consentimiento",
      recurso_id: id,
      datos_despues: { tipo: consentimiento.tipo, aceptado: true },
      ip_address: consentimiento.ip_address,
      created_at: now,
    });

    return NextResponse.json({ ok: true, consentimiento_id: id });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

// GET — Check if user has valid consent
export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

  try {
    const consentimientos = await query<Record<string, unknown>>(
      "consentimientos",
      (c) => c.paciente_id === user.userId && c.aceptado === true
    );

    const tieneTelemedicina = consentimientos.some((c) => c.tipo === "telemedicina");
    const tieneDatos = consentimientos.some((c) => c.tipo === "datos_personales");

    return NextResponse.json({
      tiene_consentimiento: tieneTelemedicina,
      telemedicina: tieneTelemedicina,
      datos_personales: tieneDatos,
      total: consentimientos.length,
    });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
