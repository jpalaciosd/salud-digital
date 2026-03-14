import { NextRequest, NextResponse } from "next/server";
import { create } from "@/lib/db";
import { getAllUsers } from "@/lib/auth";
import type { Cita } from "@/lib/types";

const API_SECRET = process.env.DR_NOVA_API_SECRET;

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get("x-api-key") || "";
  if (!API_SECRET || authHeader !== API_SECRET) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  let body: {
    telefono?: string;
    medicoId?: string;
    medicoNombre?: string;
    especialidad?: string;
    fecha?: string;
    hora?: string;
    tipo?: "presencial" | "teleconsulta" | "laboratorio";
    motivo?: string;
    notas?: string;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Body JSON inválido" }, { status: 400 });
  }

  const {
    telefono,
    medicoId,
    medicoNombre,
    especialidad,
    fecha,
    hora,
    tipo,
    motivo,
    notas,
  } = body;

  if (!telefono || !medicoNombre || !especialidad || !fecha || !hora || !tipo || !motivo) {
    return NextResponse.json(
      {
        error:
          "Faltan campos requeridos: telefono, medicoNombre, especialidad, fecha, hora, tipo, motivo",
      },
      { status: 400 }
    );
  }

  const normalizedPhone = telefono.replace(/\D/g, "").slice(-10);
  const users = await getAllUsers();
  const user = users.find((u) => {
    const userPhone = (u.telefono || "").replace(/\D/g, "").slice(-10);
    return userPhone === normalizedPhone;
  });

  if (!user) {
    return NextResponse.json(
      { error: "Usuario no encontrado para el teléfono indicado" },
      { status: 404 }
    );
  }

  const medicos = users.filter((u) => u.rol === "medico");
  if (medicoId && !medicos.some((m) => m.id === medicoId)) {
    return NextResponse.json(
      { error: "El médico indicado no existe" },
      { status: 400 }
    );
  }

  const validTipos: Cita["tipo"][] = ["presencial", "teleconsulta", "laboratorio"];
  if (!validTipos.includes(tipo)) {
    return NextResponse.json(
      { error: "tipo debe ser presencial, teleconsulta o laboratorio" },
      { status: 400 }
    );
  }

  const cita: Cita = {
    id: crypto.randomUUID(),
    pacienteId: user.id,
    pacienteNombre: `${user.nombre} ${user.apellido}`,
    medicoId: medicoId || undefined,
    medicoNombre,
    especialidad,
    fecha,
    hora,
    tipo,
    estado: "pendiente",
    motivo,
    notas,
    createdAt: new Date().toISOString(),
  };

  await create("citas", cita);
  return NextResponse.json({ cita }, { status: 201 });
}
