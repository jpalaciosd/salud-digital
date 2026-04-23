import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getAll, query } from "@/lib/db";

// GET — List audit logs (admin/auditor only)
export async function GET(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  if (!["admin", "super_admin", "auditor"].includes(user.rol)) {
    return NextResponse.json({ error: "Acceso denegado. Solo admin/auditor." }, { status: 403 });
  }

  const recurso = req.nextUrl.searchParams.get("recurso_tipo");
  const userId = req.nextUrl.searchParams.get("user_id");
  const limit = parseInt(req.nextUrl.searchParams.get("limit") || "50");

  try {
    let logs = await getAll<Record<string, unknown>>("audit_logs");

    if (recurso) logs = logs.filter((l) => l.recurso_tipo === recurso);
    if (userId) logs = logs.filter((l) => l.user_id === userId);

    // Sort by date desc
    logs.sort((a, b) => new Date(b.created_at as string).getTime() - new Date(a.created_at as string).getTime());
    logs = logs.slice(0, limit);

    // Stats
    const total = logs.length;
    const byType: Record<string, number> = {};
    const byAction: Record<string, number> = {};
    for (const l of logs) {
      const rt = (l.recurso_tipo as string) || "unknown";
      const ac = (l.accion as string) || "unknown";
      byType[rt] = (byType[rt] || 0) + 1;
      byAction[ac] = (byAction[ac] || 0) + 1;
    }

    return NextResponse.json({ logs, total, byType, byAction });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
