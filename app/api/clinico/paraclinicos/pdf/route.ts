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
    const orden = await getById<Record<string, unknown>>("paraclinicos", id);
    if (!orden) return NextResponse.json({ error: "No encontrada" }, { status: 404 });

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
    doc.text("ORDEN DE PARACLÍNICOS", W - 15, 15, { align: "right" });
    doc.setFontSize(8);
    doc.setTextColor(200, 200, 200);
    doc.text(`No. ${id.slice(0, 8).toUpperCase()}`, W - 15, 21, { align: "right" });
    doc.text(`Fecha: ${new Date(orden.created_at as string).toLocaleDateString("es-CO")}`, W - 15, 26, { align: "right" });

    y = 42;
    doc.setDrawColor(197, 160, 68);
    doc.setLineWidth(0.5);
    doc.line(15, y, W - 15, y);
    y += 8;

    // Patient
    doc.setTextColor(60, 60, 60);
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.text("DATOS DEL PACIENTE", 15, y); y += 6;
    doc.setFont("helvetica", "normal");
    doc.text(`Nombre: ${orden.paciente_nombre}`, 15, y);
    doc.text(`Documento: ${orden.paciente_documento}`, W / 2, y); y += 5;
    doc.text(`Diagnóstico: ${orden.diagnostico || "—"}`, 15, y); y += 5;

    // Priority badge
    if (orden.prioridad === "urgente") {
      doc.setFillColor(220, 50, 50);
      doc.roundedRect(W - 55, y - 13, 40, 7, 2, 2, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(7);
      doc.setFont("helvetica", "bold");
      doc.text("⚠ URGENTE", W - 35, y - 8, { align: "center" });
    }

    y += 5;
    doc.setDrawColor(220, 220, 220);
    doc.line(15, y, W - 15, y);
    y += 8;

    // Exams table
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(15, 40, 71);
    doc.text("EXÁMENES SOLICITADOS", 15, y); y += 7;

    // Table header
    doc.setFillColor(245, 245, 245);
    doc.rect(15, y - 4, W - 30, 7, "F");
    doc.setFontSize(7);
    doc.setTextColor(80, 80, 80);
    doc.text("No.", 17, y);
    doc.text("CÓDIGO", 27, y);
    doc.text("EXAMEN", 52, y);
    doc.text("CATEGORÍA", 145, y);
    y += 6;

    const examenes = (orden.examenes as Array<{ code: string; name: string; categoria: string }>) || [];
    doc.setFont("helvetica", "normal");
    doc.setTextColor(40, 40, 40);
    doc.setFontSize(8);

    for (let i = 0; i < examenes.length; i++) {
      if (y > 240) { doc.addPage(); y = 20; }
      const e = examenes[i];
      // Alternating row bg
      if (i % 2 === 0) {
        doc.setFillColor(250, 250, 250);
        doc.rect(15, y - 3.5, W - 30, 6, "F");
      }
      doc.setTextColor(40, 40, 40);
      doc.text(`${i + 1}`, 17, y);
      doc.setTextColor(197, 160, 68);
      doc.setFont("helvetica", "bold");
      doc.text(e.code, 27, y);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(40, 40, 40);
      doc.text(e.name, 52, y);
      doc.setTextColor(120, 120, 120);
      doc.setFontSize(7);
      doc.text(e.categoria, 145, y);
      doc.setFontSize(8);
      y += 6;
    }

    y += 5;

    // Total
    doc.setFillColor(255, 248, 220);
    doc.setDrawColor(197, 160, 68);
    doc.roundedRect(15, y, W - 30, 8, 2, 2, "FD");
    doc.setTextColor(15, 40, 71);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.text(`Total de exámenes: ${examenes.length}`, W / 2, y + 5.5, { align: "center" });
    y += 15;

    // Indicaciones
    if (orden.indicaciones_generales) {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.setTextColor(15, 40, 71);
      doc.text("INDICACIONES:", 15, y); y += 5;
      doc.setFont("helvetica", "normal");
      doc.setTextColor(60, 60, 60);
      const lines = doc.splitTextToSize(orden.indicaciones_generales as string, W - 30);
      doc.text(lines, 15, y);
      y += lines.length * 4 + 5;
    }

    // Signature
    y = Math.max(y + 10, 210);
    if (y > 250) { doc.addPage(); y = 20; }
    doc.setDrawColor(60, 60, 60);
    doc.line(15, y, 90, y); y += 5;
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(40, 40, 40);
    doc.text(`${orden.medico_nombre}`, 15, y); y += 4;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.text("Profesional de la Salud · ISSI", 15, y);

    const footerY = doc.internal.pageSize.getHeight() - 10;
    doc.setFontSize(6);
    doc.setTextColor(150, 150, 150);
    doc.text("Documento generado electrónicamente por ISSI · Válido según normativa colombiana vigente", W / 2, footerY, { align: "center" });

    const buffer = Buffer.from(doc.output("arraybuffer"));
    return new NextResponse(buffer, {
      headers: { "Content-Type": "application/pdf", "Content-Disposition": `inline; filename="paraclinicos-${id.slice(0, 8)}.pdf"` },
    });
  } catch (e: unknown) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Error" }, { status: 500 });
  }
}
