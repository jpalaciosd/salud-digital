import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getById } from "@/lib/db";
import { jsPDF } from "jspdf";

export async function GET(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  if (!["medico", "profesional", "admin", "super_admin"].includes(user.rol)) {
    return NextResponse.json({ error: "Acceso denegado" }, { status: 403 });
  }

  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id requerido" }, { status: 400 });

  try {
    const formula = await getById<Record<string, unknown>>("formulas_medicas", id);
    if (!formula) return NextResponse.json({ error: "Fórmula no encontrada" }, { status: 404 });

    const doc = new jsPDF({ unit: "mm", format: "letter" });
    const W = doc.internal.pageSize.getWidth();
    let y = 15;

    // Header
    doc.setFillColor(15, 40, 71); // #0f2847
    doc.rect(0, 0, W, 35, "F");
    doc.setTextColor(197, 160, 68); // #c5a044
    doc.setFontSize(18);
    doc.text("ISSI", 15, 15);
    doc.setFontSize(8);
    doc.setTextColor(200, 200, 200);
    doc.text("Instituto Superior de Salud Integral", 15, 21);
    doc.text("Ecosistema de Telemedicina · Resolución 2654/2019", 15, 26);
    doc.setTextColor(197, 160, 68);
    doc.setFontSize(14);
    doc.text("FÓRMULA MÉDICA", W - 15, 15, { align: "right" });
    doc.setFontSize(8);
    doc.setTextColor(200, 200, 200);
    doc.text(`No. ${id.slice(0, 8).toUpperCase()}`, W - 15, 21, { align: "right" });
    doc.text(`Fecha: ${new Date(formula.created_at as string).toLocaleDateString("es-CO")}`, W - 15, 26, { align: "right" });

    y = 42;

    // Divider
    doc.setDrawColor(197, 160, 68);
    doc.setLineWidth(0.5);
    doc.line(15, y, W - 15, y);
    y += 8;

    // Patient info
    doc.setTextColor(60, 60, 60);
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.text("DATOS DEL PACIENTE", 15, y);
    y += 6;
    doc.setFont("helvetica", "normal");
    doc.text(`Nombre: ${formula.paciente_nombre || "—"}`, 15, y);
    doc.text(`Documento: ${formula.paciente_documento || "—"}`, W / 2, y);
    y += 5;
    doc.text(`Diagnóstico: ${formula.diagnostico || "—"}`, 15, y);
    y += 8;

    // Divider
    doc.setDrawColor(220, 220, 220);
    doc.line(15, y, W - 15, y);
    y += 8;

    // Medications header
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.text("MEDICAMENTOS", 15, y);
    y += 7;

    // Table header
    doc.setFillColor(245, 245, 245);
    doc.rect(15, y - 4, W - 30, 7, "F");
    doc.setFontSize(7);
    doc.setTextColor(80, 80, 80);
    const cols = [15, 70, 100, 130, 160];
    doc.text("MEDICAMENTO", cols[0] + 2, y);
    doc.text("DOSIS", cols[1] + 2, y);
    doc.text("FRECUENCIA", cols[2] + 2, y);
    doc.text("VÍA", cols[3] + 2, y);
    doc.text("DURACIÓN", cols[4] + 2, y);
    y += 6;

    // Meds rows
    const meds = (formula.medicamentos as Array<Record<string, string>>) || [];
    doc.setFont("helvetica", "normal");
    doc.setTextColor(40, 40, 40);
    for (const med of meds) {
      if (y > 240) { doc.addPage(); y = 20; }
      doc.setFontSize(8);
      doc.text(`${med.nombre || ""}`, cols[0] + 2, y);
      doc.text(`${med.dosis || ""}`, cols[1] + 2, y);
      doc.text(`${med.frecuencia || ""}`, cols[2] + 2, y);
      doc.text(`${med.via || ""}`, cols[3] + 2, y);
      doc.text(`${med.duracion || ""}`, cols[4] + 2, y);
      y += 6;
      doc.setDrawColor(240, 240, 240);
      doc.line(15, y - 2, W - 15, y - 2);
    }

    y += 8;

    // Observations
    if (formula.observaciones) {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.text("OBSERVACIONES:", 15, y);
      y += 5;
      doc.setFont("helvetica", "normal");
      const obsLines = doc.splitTextToSize(formula.observaciones as string, W - 30);
      doc.text(obsLines, 15, y);
      y += obsLines.length * 4 + 5;
    }

    // Signature area
    y = Math.max(y + 10, 220);
    doc.setDrawColor(60, 60, 60);
    doc.line(15, y, 90, y);
    y += 5;
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.text(`${formula.medico_nombre || ""}`, 15, y);
    y += 4;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.text(`${formula.medico_email || ""}`, 15, y);
    y += 4;
    doc.text("Profesional de la Salud · ISSI", 15, y);

    // Footer
    const footerY = doc.internal.pageSize.getHeight() - 10;
    doc.setFontSize(6);
    doc.setTextColor(150, 150, 150);
    doc.text("Documento generado electrónicamente por ISSI · Válido sin firma física según normativa colombiana vigente", W / 2, footerY, { align: "center" });
    doc.text("Decreto 2200/2005 · Resolución 2654/2019 · Ley 527/1999 (Comercio Electrónico)", W / 2, footerY + 3, { align: "center" });

    const buffer = Buffer.from(doc.output("arraybuffer"));

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="formula-${id.slice(0, 8)}.pdf"`,
      },
    });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
