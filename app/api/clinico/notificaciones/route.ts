import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { create, query, update } from "@/lib/db";

// GET — Get user's notifications
export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

  try {
    const notifs = await query<Record<string, unknown>>(
      "notificaciones",
      (n) => n.user_id === user.userId
    );
    notifs.sort((a, b) => new Date(b.created_at as string).getTime() - new Date(a.created_at as string).getTime());

    const unread = notifs.filter((n) => !n.leida).length;
    return NextResponse.json({ notificaciones: notifs.slice(0, 50), unread });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

// POST — Create notification (internal use / admin)
export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

  try {
    const body = await req.json();
    const id = crypto.randomUUID();
    const now = new Date().toISOString();

    const notif = {
      id,
      user_id: body.user_id || user.userId,
      tipo: body.tipo || "info", // info | consulta | alerta | recordatorio
      titulo: body.titulo || "",
      mensaje: body.mensaje || "",
      link: body.link || null,
      leida: false,
      created_at: now,
    };

    await create("notificaciones", notif);
    return NextResponse.json({ ok: true, id });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

// PATCH — Mark as read
export async function PATCH(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

  try {
    const body = await req.json();
    if (body.mark_all_read) {
      const notifs = await query<Record<string, unknown>>(
        "notificaciones",
        (n) => n.user_id === user.userId && !n.leida
      );
      for (const n of notifs) {
        await update("notificaciones", n.id as string, (prev: Record<string, unknown>) => ({ ...prev, leida: true }));
      }
      return NextResponse.json({ ok: true, marked: notifs.length });
    }

    if (body.id) {
      await update("notificaciones", body.id, (prev: Record<string, unknown>) => ({ ...prev, leida: true }));
      return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ error: "id o mark_all_read requerido" }, { status: 400 });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
