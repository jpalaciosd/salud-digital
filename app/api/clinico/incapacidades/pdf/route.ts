import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getById } from "@/lib/db";
import { jsPDF } from "jspdf";

export async function GET(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  if (!["medico", "profesional", "admin"].includes(user.rol)) {
    return NextResponse.json({ error: "Acceso denegado" }, { status: 403 });
  }

  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id requerido" }, { status: 400 });

  try {
    const inc = await getById<Record<string, unknown>>("incapacidades", id);
    if (!inc) return NextResponse.json({ error: "No encontrada" }, { status: 404 });

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
    doc.setTextColor(197, 160, 68);
    doc.setFontSize(14);
    doc.text("CERTIFICADO DE INCAPACIDAD", W - 15, 15, { align: "right" });
    doc.setFontSize(8);
    doc.setTextColor(200, 200, 200);
    doc.text(`No. ${id.slice(0, 8).toUpperCase()}`, W - 15, 21, { align: "right" });
    doc.text(`Emisión: ${new Date(inc.created_at as string).toLocaleDateString("es-CO")}`, W - 15, 26, { align: "right" });

    y = 45;
    doc.setDrawColor(197, 160, 68);
    doc.line(15, y - 3, W - 15, y - 3);

    // Patient
    doc.setTextColor(60, 60, 60);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("DATOS DEL PACIENTE", 15, y);
    y += 7;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text(`Nombre: ${inc.paciente_nombre}`, 15, y); y += 5;
    doc.text(`Documento: ${inc.paciente_documento}`, 15, y); y += 10;

    // Incapacidad
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text("DATOS DE LA INCAPACIDAD", 15, y); y += 7;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);

    const tipoLabels: Record<string, string> = {
      enfermedad_general: "Enfermedad General",
      accidente_trabajo: "Accidente de Trabajo",
      maternidad: "Licencia de Maternidad",
      paternidad: "Licencia de Paternidad",
    };

    doc.text(`Tipo: ${tipoLabels[inc.tipo as string] || inc.tipo}`, 15, y); y += 5;
    doc.text(`Diagnóstico: ${inc.diagnostico}`, 15, y); y += 5;
    if (inc.diagnostico_cie10) { doc.text(`CIE-10: ${inc.diagnostico_cie10}`, 15, y); y += 5; }
    y += 3;

    // Highlight box
    doc.setFillColor(255, 248, 220);
    doc.setDrawColor(197, 160, 68);
    doc.roundedRect(15, y, W - 30, 25, 3, 3, "FD");
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(15, 40, 71);
    doc.text(`DÍAS DE INCAPACIDAD: ${inc.dias}`, W / 2, y + 8, { align: "center" });
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text(`Desde: ${inc.fecha_inicio}    Hasta: ${inc.fecha_fin}`, W / 2, y + 16, { align: "center" });
    y += 35;

    // Recomendaciones
    if (inc.recomendaciones) {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.setTextColor(60, 60, 60);
      doc.text("RECOMENDACIONES:", 15, y); y += 5;
      doc.setFont("helvetica", "normal");
      const lines = doc.splitTextToSize(inc.recomendaciones as string, W - 30);
      doc.text(lines, 15, y);
      y += lines.length * 4 + 5;
    }

    // Signature
    y = Math.max(y + 15, 200);
    doc.setDrawColor(60, 60, 60);
    doc.line(15, y, 90, y); y += 5;
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.text(`${inc.medico_nombre}`, 15, y); y += 4;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.text("Profesional de la Salud · ISSI", 15, y);

    const footerY = doc.internal.pageSize.getHeight() - 10;
    doc.setFontSize(6);
    doc.setTextColor(150, 150, 150);
    doc.text("Documento generado electrónicamente por ISSI · Válido según normativa colombiana vigente", W / 2, footerY, { align: "center" });

    const buffer = Buffer.from(doc.output("arraybuffer"));
    return new NextResponse(buffer, {
      headers: { "Content-Type": "application/pdf", "Content-Disposition": `inline; filename="incapacidad-${id.slice(0, 8)}.pdf"` },
    });
  } catch (e: unknown) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Error" }, { status: 500 });
  }
}
