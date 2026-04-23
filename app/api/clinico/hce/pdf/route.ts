import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getById } from "@/lib/db";
import { jsPDF } from "jspdf";

export async function GET(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  if (!["medico", "profesional", "admin", "super_admin", "auditor"].includes(user.rol)) {
    return NextResponse.json({ error: "Acceso denegado" }, { status: 403 });
  }

  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id requerido" }, { status: 400 });

  try {
    const hce = await getById<Record<string, unknown>>("hce_registros", id);
    if (!hce) return NextResponse.json({ error: "Registro no encontrado" }, { status: 404 });

    const doc = new jsPDF({ unit: "mm", format: "letter" });
    const W = doc.internal.pageSize.getWidth();
    let y = 15;

    // Header
    doc.setFillColor(15, 40, 71);
    doc.rect(0, 0, W, 35, "F");
    doc.setTextColor(197, 160, 68);
    doc.setFontSize(18);
    doc.text("ISSI", 15, 15);
    doc.setFontSize(8);
    doc.setTextColor(200, 200, 200);
    doc.text("Instituto Superior de Salud Integral", 15, 21);
    doc.text("Historia Clínica Electrónica · Resolución 1995/1999", 15, 26);
    doc.setTextColor(197, 160, 68);
    doc.setFontSize(14);
    doc.text("HISTORIA CLÍNICA", W - 15, 15, { align: "right" });
    doc.setFontSize(8);
    doc.setTextColor(200, 200, 200);
    doc.text(`No. ${id.slice(0, 8).toUpperCase()}`, W - 15, 21, { align: "right" });
    doc.text(`Fecha: ${new Date(hce.created_at as string).toLocaleDateString("es-CO")}`, W - 15, 26, { align: "right" });

    y = 42;
    doc.setDrawColor(197, 160, 68);
    doc.setLineWidth(0.5);
    doc.line(15, y, W - 15, y);
    y += 8;

    const addSection = (title: string, content: string | null | undefined) => {
      if (!content) return;
      if (y > 250) { doc.addPage(); y = 20; }
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.setTextColor(15, 40, 71);
      doc.text(title, 15, y);
      y += 5;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(40, 40, 40);
      const lines = doc.splitTextToSize(content, W - 30);
      doc.text(lines, 15, y);
      y += lines.length * 3.5 + 4;
    };

    // Motivo
    addSection("MOTIVO DE CONSULTA", hce.motivo_consulta as string);
    addSection("ENFERMEDAD ACTUAL", hce.enfermedad_actual as string);

    // Antecedentes
    const ant = hce.antecedentes_consulta as Record<string, string[]> | null;
    if (ant) {
      const antText = Object.entries(ant)
        .filter(([, v]) => v && v.length > 0)
        .map(([k, v]) => `${k}: ${v.join(", ")}`)
        .join("\n");
      addSection("ANTECEDENTES", antText);
    }

    // Revisión por sistemas
    const rev = hce.revision_sistemas as Record<string, { presente: boolean; observaciones: string }> | null;
    if (rev) {
      const positivos = Object.entries(rev)
        .filter(([, v]) => v.presente)
        .map(([k, v]) => `${k}: ${v.observaciones || "positivo"}`)
        .join("\n");
      if (positivos) addSection("REVISIÓN POR SISTEMAS (POSITIVOS)", positivos);
    }

    // Examen físico
    const ex = hce.examen_fisico as Record<string, unknown> | null;
    if (ex) {
      const exText = `Estado general: ${ex.estado_general}\nConciencia: ${ex.conciencia}\nColoración: ${ex.coloracion}${ex.dificultad_respiratoria ? "\n⚠ Dificultad respiratoria" : ""}${ex.observaciones ? `\nObservaciones: ${ex.observaciones}` : ""}`;
      addSection("EXAMEN FÍSICO", exText);
    }

    // Signos vitales
    const sv = hce.signos_vitales as Record<string, unknown> | null;
    if (sv) {
      const parts: string[] = [];
      if (sv.ta_sistolica) parts.push(`TA: ${sv.ta_sistolica}/${sv.ta_diastolica} mmHg`);
      if (sv.frecuencia_cardiaca) parts.push(`FC: ${sv.frecuencia_cardiaca} lpm`);
      if (sv.frecuencia_respiratoria) parts.push(`FR: ${sv.frecuencia_respiratoria} rpm`);
      if (sv.temperatura) parts.push(`Temp: ${sv.temperatura}°C`);
      if (sv.saturacion_o2) parts.push(`SpO2: ${sv.saturacion_o2}%`);
      if (sv.peso) parts.push(`Peso: ${sv.peso} kg`);
      if (sv.talla) parts.push(`Talla: ${sv.talla} cm`);
      if (sv.autoreportados) parts.push("(Autoreportados por paciente)");
      addSection("SIGNOS VITALES", parts.join(" · "));
    }

    // Limitaciones
    addSection("LIMITACIONES DE TELECONSULTA", hce.limitaciones_teleconsulta as string);

    // Diagnósticos
    const diags = (hce.diagnosticos as Array<{ cie10: string; descripcion: string; tipo: string }>) || [];
    if (diags.length > 0) {
      if (y > 240) { doc.addPage(); y = 20; }
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.setTextColor(15, 40, 71);
      doc.text("DIAGNÓSTICOS (CIE-10)", 15, y);
      y += 6;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      for (const d of diags) {
        doc.setTextColor(197, 160, 68);
        doc.text(d.cie10, 15, y);
        doc.setTextColor(40, 40, 40);
        doc.text(`${d.descripcion} (${d.tipo})`, 35, y);
        y += 5;
      }
      y += 3;
    }

    // Plan
    const plan = hce.plan_manejo as Record<string, string> | null;
    if (plan) {
      if (plan.farmacologico) addSection("PLAN FARMACOLÓGICO", plan.farmacologico);
      if (plan.no_farmacologico) addSection("PLAN NO FARMACOLÓGICO", plan.no_farmacologico);
      if (plan.educacion) addSection("EDUCACIÓN AL PACIENTE", plan.educacion);
      if (plan.signos_alarma) addSection("SIGNOS DE ALARMA", plan.signos_alarma);
    }

    // Seguimiento
    const seg = hce.seguimiento as Record<string, unknown> | null;
    if (seg) {
      const segText = [
        seg.control_en_dias ? `Control en ${seg.control_en_dias} días` : null,
        seg.remision ? `Remisión: ${seg.remision}` : null,
      ].filter(Boolean).join("\n");
      if (segText) addSection("SEGUIMIENTO", segText);
    }

    // Signature
    y = Math.max(y + 10, 220);
    if (y > 250) { doc.addPage(); y = 20; }
    doc.setDrawColor(60, 60, 60);
    doc.line(15, y, 90, y);
    y += 5;
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(40, 40, 40);
    doc.text(`${hce.medico_nombre || ""}`, 15, y);
    y += 4;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.text("Profesional de la Salud · ISSI", 15, y);

    // Footer
    const footerY = doc.internal.pageSize.getHeight() - 10;
    doc.setFontSize(6);
    doc.setTextColor(150, 150, 150);
    doc.text("Documento generado electrónicamente por ISSI · Resolución 1995/1999 · Resolución 2654/2019", W / 2, footerY, { align: "center" });

    const buffer = Buffer.from(doc.output("arraybuffer"));
    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="hce-${id.slice(0, 8)}.pdf"`,
      },
    });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
