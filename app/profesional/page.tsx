"use client";

import { useAuth } from "@/lib/AuthContext";
import UserNav from "@/lib/UserNav";
import { useState, useEffect } from "react";

interface Agenda {
  id: string;
  estudianteId: string;
  estudianteNombre: string;
  estudianteEmail: string;
  cursoId: string;
  cursoNombre: string;
  tema: string;
  modalidad: "virtual" | "presencial";
  fechaPropuesta: string;
  horaPropuesta: string;
  notas: string;
  estado: "pendiente" | "aceptada" | "completada" | "cancelada";
  profesionalId: string | null;
  profesionalNombre: string | null;
  profesionalEspecialidad: string | null;
  calificacion: number | null;
  createdAt: string;
  updatedAt: string;
}

export default function ProfesionalPage() {
  const { user } = useAuth();
  const [agendas, setAgendas] = useState<Agenda[]>([]);
  const [tab, setTab] = useState<"pool" | "mis" | "metricas">("pool");
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchAgendas = async () => {
    const res = await fetch("/api/agendas");
    if (res.ok) {
      const data = await res.json();
      setAgendas(data.agendas || []);
    }
    setLoading(false);
  };

  useEffect(() => { fetchAgendas(); }, []);

  const handleAction = async (id: string, accion: string) => {
    setActionLoading(id);
    await fetch(`/api/agendas/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ accion }),
    });
    await fetchAgendas();
    setActionLoading(null);
  };

  if (!user) return null;

  const pool = agendas.filter(a => a.estado === "pendiente");
  const mis = agendas.filter(a => a.profesionalId === (user as Record<string, string>).id);
  const misActivas = mis.filter(a => a.estado === "aceptada");
  const misCompletadas = mis.filter(a => a.estado === "completada");
  const calificaciones = misCompletadas.filter(a => a.calificacion).map(a => a.calificacion as number);
  const promCal = calificaciones.length ? (calificaciones.reduce((s, c) => s + c, 0) / calificaciones.length).toFixed(1) : "—";

  // Distribution by course
  const cursoCount: Record<string, number> = {};
  mis.forEach(a => { cursoCount[a.cursoNombre] = (cursoCount[a.cursoNombre] || 0) + 1; });

  const tabs = [
    { id: "pool", label: "Pool Disponible", icon: "inbox", count: pool.length },
    { id: "mis", label: "Mis Tutorías", icon: "assignment_ind", count: misActivas.length },
    { id: "metricas", label: "Métricas", icon: "analytics", count: 0 },
  ];

  return (
    <div className="min-h-screen bg-[#f1f5f9]">
      <UserNav />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-[#0f2847]">Panel Profesional</h1>
          <p className="text-slate-500 text-sm">Gestiona tutorías y acompaña estudiantes</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
            <p className="text-xs text-slate-400 mb-1">Pool Disponible</p>
            <p className="text-2xl font-bold text-blue-600">{pool.length}</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
            <p className="text-xs text-slate-400 mb-1">Activas</p>
            <p className="text-2xl font-bold text-amber-600">{misActivas.length}</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
            <p className="text-xs text-slate-400 mb-1">Completadas</p>
            <p className="text-2xl font-bold text-green-600">{misCompletadas.length}</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
            <p className="text-xs text-slate-400 mb-1">Calificación</p>
            <p className="text-2xl font-bold text-[#c5a044]">⭐ {promCal}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id as typeof tab)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition ${
                tab === t.id ? "bg-[#0f2847] text-white" : "bg-white text-slate-600 hover:bg-slate-50"
              }`}
            >
              <span className="material-icons-outlined text-lg">{t.icon}</span>
              {t.label}
              {t.count > 0 && (
                <span className={`px-2 py-0.5 rounded-full text-xs ${tab === t.id ? "bg-white/20" : "bg-blue-100 text-blue-700"}`}>
                  {t.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-20 text-slate-400">Cargando...</div>
        ) : (
          <>
            {/* POOL */}
            {tab === "pool" && (
              <div className="space-y-4">
                {pool.length === 0 ? (
                  <div className="bg-white rounded-xl p-12 text-center shadow-sm">
                    <span className="material-icons-outlined text-5xl text-slate-300 mb-3 block">inbox</span>
                    <p className="text-slate-400">No hay solicitudes pendientes</p>
                  </div>
                ) : pool.map(a => (
                  <div key={a.id} className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-bold text-[#0f2847]">{a.cursoNombre}</h3>
                        <p className="text-sm text-slate-500">Tema: {a.tema}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        a.modalidad === "virtual" ? "bg-blue-100 text-blue-700" : "bg-green-100 text-green-700"
                      }`}>{a.modalidad === "virtual" ? "🖥 Virtual" : "🏫 Presencial"}</span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm mb-3">
                      <div><span className="text-slate-400">Estudiante:</span> <span className="font-medium">{a.estudianteNombre}</span></div>
                      <div><span className="text-slate-400">Fecha:</span> <span className="font-medium">{a.fechaPropuesta}</span></div>
                      <div><span className="text-slate-400">Hora:</span> <span className="font-medium">{a.horaPropuesta}</span></div>
                      <div><span className="text-slate-400">Email:</span> <span className="font-medium text-xs">{a.estudianteEmail}</span></div>
                    </div>
                    {a.notas && <p className="text-sm text-slate-500 mb-3 italic">"{a.notas}"</p>}
                    <button
                      onClick={() => handleAction(a.id, "aceptar")}
                      disabled={actionLoading === a.id}
                      className="px-6 py-2 bg-[#0f2847] text-white rounded-lg font-bold text-sm hover:opacity-90 transition disabled:opacity-50"
                    >
                      {actionLoading === a.id ? "Aceptando..." : "✋ Aceptar Tutoría"}
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* MIS TUTORÍAS */}
            {tab === "mis" && (
              <div className="space-y-4">
                {mis.length === 0 ? (
                  <div className="bg-white rounded-xl p-12 text-center shadow-sm">
                    <span className="material-icons-outlined text-5xl text-slate-300 mb-3 block">assignment_ind</span>
                    <p className="text-slate-400">No tienes tutorías asignadas aún</p>
                  </div>
                ) : mis.map(a => (
                  <div key={a.id} className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-bold text-[#0f2847]">{a.cursoNombre}</h3>
                        <p className="text-sm text-slate-500">Tema: {a.tema}</p>
                        <p className="text-sm text-slate-500">Estudiante: <span className="font-medium">{a.estudianteNombre}</span> ({a.estudianteEmail})</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        a.estado === "aceptada" ? "bg-amber-100 text-amber-700" :
                        a.estado === "completada" ? "bg-green-100 text-green-700" :
                        "bg-slate-100 text-slate-600"
                      }`}>
                        {a.estado === "aceptada" ? "🟡 Activa" : a.estado === "completada" ? "✅ Completada" : a.estado}
                      </span>
                    </div>
                    <div className="flex gap-3 text-sm mb-3">
                      <span>{a.modalidad === "virtual" ? "🖥 Virtual" : "🏫 Presencial"}</span>
                      <span>📅 {a.fechaPropuesta}</span>
                      <span>⏰ {a.horaPropuesta}</span>
                    </div>
                    {a.calificacion && <p className="text-sm text-[#c5a044] font-bold">⭐ Calificación: {a.calificacion}/5</p>}
                    {a.estado === "aceptada" && (
                      <button
                        onClick={() => handleAction(a.id, "completar")}
                        disabled={actionLoading === a.id}
                        className="px-6 py-2 bg-green-600 text-white rounded-lg font-bold text-sm hover:opacity-90 transition disabled:opacity-50 mt-2"
                      >
                        {actionLoading === a.id ? "Finalizando..." : "✅ Marcar Completada"}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* MÉTRICAS */}
            {tab === "metricas" && (
              <div className="space-y-6">
                {/* Distribution by course */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
                  <h3 className="font-bold text-[#0f2847] mb-4">📊 Distribución por Curso</h3>
                  {Object.keys(cursoCount).length === 0 ? (
                    <p className="text-slate-400 text-sm">Sin datos aún</p>
                  ) : (
                    <div className="space-y-3">
                      {Object.entries(cursoCount).sort((a, b) => b[1] - a[1]).map(([curso, count]) => (
                        <div key={curso}>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="font-medium">{curso}</span>
                            <span className="text-slate-400">{count} sesiones</span>
                          </div>
                          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-[#0f2847] rounded-full"
                              style={{ width: `${Math.min(100, (count / Math.max(...Object.values(cursoCount))) * 100)}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Resumen */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
                  <h3 className="font-bold text-[#0f2847] mb-4">📋 Resumen General</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="bg-slate-50 rounded-lg p-3">
                      <p className="text-slate-400">Total tutorías tomadas</p>
                      <p className="text-xl font-bold text-[#0f2847]">{mis.length}</p>
                    </div>
                    <div className="bg-slate-50 rounded-lg p-3">
                      <p className="text-slate-400">Tasa de completación</p>
                      <p className="text-xl font-bold text-green-600">
                        {mis.length > 0 ? Math.round((misCompletadas.length / mis.length) * 100) : 0}%
                      </p>
                    </div>
                    <div className="bg-slate-50 rounded-lg p-3">
                      <p className="text-slate-400">Estudiantes atendidos</p>
                      <p className="text-xl font-bold text-blue-600">
                        {new Set(mis.map(a => a.estudianteId)).size}
                      </p>
                    </div>
                    <div className="bg-slate-50 rounded-lg p-3">
                      <p className="text-slate-400">Calificación promedio</p>
                      <p className="text-xl font-bold text-[#c5a044]">⭐ {promCal}</p>
                    </div>
                  </div>
                </div>

                {/* Students list */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
                  <h3 className="font-bold text-[#0f2847] mb-4">👩‍🎓 Estudiantes Atendidos</h3>
                  {mis.length === 0 ? (
                    <p className="text-slate-400 text-sm">Sin datos aún</p>
                  ) : (
                    <div className="divide-y divide-slate-100">
                      {[...new Map(mis.map(a => [a.estudianteId, a])).values()].map(a => (
                        <div key={a.estudianteId} className="py-3 flex justify-between items-center">
                          <div>
                            <p className="font-medium text-sm">{a.estudianteNombre}</p>
                            <p className="text-xs text-slate-400">{a.estudianteEmail}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-slate-400">
                              {mis.filter(m => m.estudianteId === a.estudianteId).length} sesiones
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
