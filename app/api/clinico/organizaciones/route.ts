import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { create, getAll, getById, query } from "@/lib/db";

// POST — Register new organization (tenant)
export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

  try {
    const body = await req.json();
    const orgId = crypto.randomUUID();
    const now = new Date().toISOString();

    const org = {
      id: orgId,
      nombre: body.nombre,
      nit: body.nit || "",
      tipo: body.tipo || "ips",
      logo_url: body.logo_url || "",
      plan: "basico",
      max_usuarios: 10,
      max_consultas_mes: 100,
      activa: true,
      config: {},
      created_at: now,
    };

    await create("organizaciones", org);

    // Auto-assign creator as admin_org
    await create("org_miembros", {
      id: crypto.randomUUID(),
      org_id: orgId,
      user_id: user.userId,
      user_email: user.email,
      user_nombre: `${user.nombre} ${user.apellido}`,
      rol_org: "admin_org",
      activo: true,
      created_at: now,
    });

    // Audit
    await create("audit_logs", {
      id: crypto.randomUUID(),
      org_id: orgId,
      user_id: user.userId,
      rol: user.rol,
      accion: "CREATE",
      recurso_tipo: "organizacion",
      recurso_id: orgId,
      datos_despues: org,
      created_at: now,
    });

    return NextResponse.json({ ok: true, organizacion: org });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

// GET — List organizations (admin sees all, others see their own)
export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

  try {
    if (user.rol === "admin") {
      const orgs = await getAll("organizaciones");
      return NextResponse.json({ organizaciones: orgs });
    }

    // Find user's org memberships
    const miembros = await query<Record<string, unknown>>("org_miembros", (m) => m.user_id === user.userId);
    const orgIds = miembros.map((m) => m.org_id as string);
    const orgs: Record<string, unknown>[] = [];
    for (const oid of orgIds) {
      const org = await getById(oid, "organizaciones");
      if (org) orgs.push(org as Record<string, unknown>);
    }
    return NextResponse.json({ organizaciones: orgs });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
