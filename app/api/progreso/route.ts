import { NextRequest, NextResponse } from "next/server";
import { put, list } from "@vercel/blob";
import { getAllUsers } from "@/lib/auth";
import { CURSOS_CATALOGO } from "@/lib/cursos-data";

const API_SECRET = process.env.PROGRESO_API_SECRET || "salud-digital-progreso-2026";

interface ProgresoRecord {
  id: string;
  userId: string;
  telefono: string;
  cursoId: string;
  cursoNombre: string;
  moduloIdx: number;
  temaIdx: number;
  moduloCompletado: number;
  totalModulos: number;
  porcentaje: number;
  nota?: number;
  detalle?: string;
  updatedAt: string;
}

// POST — Lambda sends progress updates
export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("x-api-key") || "";
    if (authHeader !== API_SECRET) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const body = await req.json();
    const { telefono, cursoId, cursoNombre, moduloCompletado, totalModulos, moduloIdx, temaIdx, nota, detalle, moduloCompleto } = body;

    if (!telefono || !cursoId) {
      return NextResponse.json({ error: "telefono y cursoId son requeridos" }, { status: 400 });
    }

    const users = await getAllUsers();
    const normalizedPhone = telefono.replace(/\D/g, "").slice(-10);
    const user = users.find((u) => {
      const userPhone = (u.telefono || "").replace(/\D/g, "").slice(-10);
      return userPhone === normalizedPhone;
    });

    if (!user) {
      return NextResponse.json({ error: "Usuario no encontrado", telefono }, { status: 404 });
    }

    const porcentaje = totalModulos > 0 ? Math.round((moduloCompletado / totalModulos) * 100) : 0;
    const recordId = `${user.id}-${cursoId}`;

    const record: ProgresoRecord = {
      id: recordId,
      userId: user.id,
      telefono,
      cursoId,
      cursoNombre: cursoNombre || cursoId,
      moduloIdx: moduloIdx ?? 0,
      temaIdx: temaIdx ?? 0,
      moduloCompletado: moduloCompletado || 0,
      totalModulos: totalModulos || 1,
      porcentaje,
      nota,
      detalle,
      updatedAt: new Date().toISOString(),
    };

    await put(`progreso/${recordId}.json`, JSON.stringify(record), {
      access: "public",
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType: "application/json",
    });

    // ── Sync: mark completed items in inscripciones ──
    try {
      const mIdx = moduloIdx ?? 0;

      const { blobs: inscBlobs } = await list({ prefix: "inscripciones/" });
      for (const blob of inscBlobs) {
        const res = await fetch(blob.url, { cache: "no-store" });
        if (!res.ok) continue;
        const insc = await res.json();

        if (insc.userId !== user.id || insc.cursoId !== cursoId) continue;

        const completedItems: string[] = [...(insc.completedItems || [])];
        let changed = false;

        if (moduloCompleto) {
          // Mark ALL items in the completed module
          const cursoData = CURSOS_CATALOGO.find(c => c.id === cursoId);
          const modulo = cursoData?.modulos[mIdx];
          if (modulo) {
            for (let ti = 0; ti < modulo.items.length; ti++) {
              const key = `${mIdx}:${ti}`;
              if (!completedItems.includes(key)) {
                completedItems.push(key);
                changed = true;
              }
            }
          }
        } else {
          const key = `${mIdx}:${temaIdx ?? 0}`;
          if (!completedItems.includes(key)) {
            completedItems.push(key);
            changed = true;
          }
        }

        if (changed) {
          insc.completedItems = completedItems;
          insc.ultimaActividad = new Date().toISOString();
          await put(`inscripciones/${insc.id}.json`, JSON.stringify(insc), {
            access: "public",
            addRandomSuffix: false,
            allowOverwrite: true,
            contentType: "application/json",
          });
          console.log(`[Sync] Marked ${moduloCompleto ? `module ${mIdx} complete` : `item ${mIdx}:${temaIdx}`} for inscripcion ${insc.id}`);
        }
        break;
      }
    } catch (syncErr) {
      console.error("Sync error:", syncErr);
    }

    return NextResponse.json({ ok: true, progreso: record });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: "Error interno", detail: message }, { status: 500 });
  }
}

// GET — Dashboard fetches user progress
export async function GET(req: NextRequest) {
  try {
    const userId = req.nextUrl.searchParams.get("userId");
    if (!userId) {
      return NextResponse.json({ error: "userId requerido" }, { status: 400 });
    }

    const { blobs } = await list({ prefix: `progreso/${userId}-` });
    const items: ProgresoRecord[] = [];
    for (const blob of blobs) {
      try {
        const res = await fetch(blob.url, { cache: "no-store" });
        if (res.ok) items.push(await res.json());
      } catch {}
    }

    return NextResponse.json({ progreso: items });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: "Error interno", detail: message }, { status: 500 });
  }
}
