import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { create, getById, update } from "@/lib/db";
import { generarCodigoCanje } from "@/lib/codigo-canje";
import type { Pago, PagoRefIndex } from "@/lib/types";

function refToId(ref: string): string {
  return ref.replace(/[^a-zA-Z0-9]/g, "_").slice(0, 80);
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const token = req.cookies.get("auth-token")?.value;
  if (!token) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const user = await verifyToken(token);
  if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  if (user.rol !== "admin") return NextResponse.json({ error: "Solo administradores" }, { status: 403 });

  const body = await req.json().catch(() => ({}));
  const decision = body.decision as "aprobar" | "rechazar" | undefined;
  const motivo = typeof body.motivo === "string" ? body.motivo : undefined;

  if (decision !== "aprobar" && decision !== "rechazar") {
    return NextResponse.json({ error: "decision debe ser 'aprobar' o 'rechazar'" }, { status: 400 });
  }

  const pago = await getById<Pago>("pagos", id);
  if (!pago) return NextResponse.json({ error: "Pago no encontrado" }, { status: 404 });
  if (pago.estado !== "revision_manual") {
    return NextResponse.json({ error: "Este pago no está en revisión manual" }, { status: 409 });
  }

  const now = new Date().toISOString();

  if (decision === "aprobar") {
    const codigoCanje = generarCodigoCanje();
    const updated = await update<Pago>("pagos", id, (p) => ({
      ...p,
      estado: "aprobado_manual",
      codigoCanje,
      adminRevisor: user.userId,
      motivoRechazo: undefined,
      updatedAt: now,
    }));

    if (pago.iaData?.referencia) {
      const refId = refToId(pago.iaData.referencia);
      const exists = await getById<PagoRefIndex>("pagos-ref", refId);
      if (!exists) {
        await create<PagoRefIndex>("pagos-ref", {
          id: refId,
          pagoId: pago.id,
          createdAt: now,
        });
      }
    }

    return NextResponse.json({ pago: updated });
  }

  const updated = await update<Pago>("pagos", id, (p) => ({
    ...p,
    estado: "rechazado",
    adminRevisor: user.userId,
    motivoRechazo: motivo || p.motivoRechazo || "Rechazado por administrador",
    updatedAt: now,
  }));

  return NextResponse.json({ pago: updated });
}
