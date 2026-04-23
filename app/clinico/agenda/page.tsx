"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/lib/AuthContext";
import UserNav from "@/lib/UserNav";

interface Consulta {
  id: string; tipo: string; estado: string; paciente_nombre: string;
  medico_nombre: string; especialidad: string; motivo: string;
  fecha_programada: string; hora_inicio: string; created_at: string;
}

const ESTADO_BADGE: Record<string, { bg: string; label: string }> = {
  programada: { bg: "bg-blue-500/20 text-blue-400", label: "Programada" },
  en_curso: { bg: "bg-yellow-500/20 text-yellow-400", label: "En curso" },
  completada: { bg: "bg-green-500/20 text-green-400", label: "Completada" },
  cancelada: { bg: "bg-red-500/20 text-red-400", label: "Cancelada" },
  no_asistio: { bg: "bg-gray-500/20 text-gray-400", label: "No asistió" },
};

const ESPECIALIDADES = [
  "medicina_general", "pediatria", "ginecologia", "medicina_interna",
  "psicologia", "nutricion", "dermatologia", "oftalmologia",
];

export default function AgendaClinicaPage() {
  const { user, loading } = useAuth();
  const [consultas, setConsultas] = useState<Consulta[]>([]);
  const [fetching, setFetching] = useState(true);
  const [tab, setTab] = useState<"agenda" | "nueva">("agenda");
  const [saving, setSaving] = useState(false);

  // New consultation form
  const [motivo, setMotivo] = useState("");
  const [especialidad, setEspecialidad] = useState("medicina_general");
  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("");
  const [tipo, setTipo] = useState("teleconsulta_sincronica");

  const isMedical = user && ["medico", "profesional"].includes((user as Record<string, string>).rol);
  const isAdmin = user && ["admin", "super_admin"].includes((user as Record<string, string>).rol);

  const loadConsultas = () => {
    fetch("/api/clinico/consultas")
      .then((r) => r.json())
      .then((d) => { setConsultas(d.consultas || []); setFetching(false); })
      .catch(() => setFetching(false));
  };

  useEffect(() => {
    if (loading || !user) return;
    loadConsultas();
  }, [user, loading]);

  const handleCreate = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/clinico/consultas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ motivo, especialidad, fecha_programada: fecha, hora_inicio: hora, tipo }),
      });
      if (res.ok) {
        setMotivo(""); setFecha(""); setHora("");
        setTab("agenda");
        loadConsultas();
      }
    } catch (e) { console.error(e); }
    setSaving(false);
  };

  const handleAction = async (id: string, estado: string) => {
    await fetch("/api/clinico/consultas", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, estado }),
    });
    loadConsultas();
  };

  if (loading || fetching) return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
      <div className="animate-spin h-10 w-10 border-4 border-[#c5a044] border-t-transparent rounded-full" />
    </div>
  );

  const programadas = consultas.filter((c) => c.estado === "programada");
  const enCurso = consultas.filter((c) => c.estado === "en_curso");
  const historial = consultas.filter((c) => ["completada", "cancelada", "no_asistio"].includes(c.estado));

  return (
    <div className="min-h-screen bg-[#0f172a] text-white">
      <UserNav />
      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#c5a044]/20 flex items-center justify-center text-2xl">🩺</div>
            <div>
              <h1 className="text-xl font-bold">Agenda Clínica</h1>
              <p className="text-xs text-gray-400">{consultas.length} consultas · {programadas.length} pendientes</p>
            </div>
          </div>
          <button onClick={() => setTab(tab === "nueva" ? "agenda" : "nueva")}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition ${tab === "nueva" ? "bg-white/10 text-gray-300" : "bg-[#c5a044] text-[#0f172a]"}`}>
            {tab === "nueva" ? "← Volver" : "+ Nueva consulta"}
          </button>
        </div>

        {tab === "nueva" ? (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
            <h2 className="text-lg font-bold">Solicitar Consulta</h2>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Motivo de consulta *</label>
              <textarea value={motivo} onChange={(e) => setMotivo(e.target.value)} rows={3} placeholder="Describa el motivo de la consulta..."
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm resize-none focus:border-[#c5a044]/50 outline-none" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Especialidad</label>
                <select value={especialidad} onChange={(e) => setEspecialidad(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm">
                  {ESPECIALIDADES.map((e) => <option key={e} value={e}>{e.replace("_", " ")}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Modalidad</label>
                <select value={tipo} onChange={(e) => setTipo(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm">
                  <option value="teleconsulta_sincronica">Teleconsulta (sincrónica)</option>
                  <option value="teleconsulta_asincronica">Teleconsulta (asincrónica)</option>
                  <option value="presencial">Presencial</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Fecha</label>
                <input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm" />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Hora</label>
                <input type="time" value={hora} onChange={(e) => setHora(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm" />
              </div>
            </div>
            <button onClick={handleCreate} disabled={!motivo || !fecha || saving}
              className={`w-full py-3 rounded-xl font-bold text-sm transition ${motivo && fecha && !saving ? "bg-[#c5a044] text-[#0f172a] active:scale-95" : "bg-gray-700 text-gray-500 cursor-not-allowed"}`}>
              {saving ? "Agendando..." : "📅 Agendar Consulta"}
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* En curso */}
            {enCurso.length > 0 && (
              <div>
                <h2 className="text-sm font-bold text-yellow-400 mb-3">🔴 En Curso ({enCurso.length})</h2>
                {enCurso.map((c) => (
                  <ConsultaCard key={c.id} c={c} isMedical={!!isMedical} isAdmin={!!isAdmin} onAction={handleAction} />
                ))}
              </div>
            )}

            {/* Programadas */}
            <div>
              <h2 className="text-sm font-bold text-blue-400 mb-3">📅 Programadas ({programadas.length})</h2>
              {programadas.length === 0 ? (
                <div className="bg-white/5 border border-white/10 rounded-xl p-6 text-center text-gray-500 text-sm">
                  No hay consultas programadas
                </div>
              ) : programadas.map((c) => (
                <ConsultaCard key={c.id} c={c} isMedical={!!isMedical} isAdmin={!!isAdmin} onAction={handleAction} />
              ))}
            </div>

            {/* Historial */}
            {historial.length > 0 && (
              <div>
                <h2 className="text-sm font-bold text-gray-400 mb-3">📜 Historial ({historial.length})</h2>
                {historial.map((c) => (
                  <ConsultaCard key={c.id} c={c} isMedical={!!isMedical} isAdmin={!!isAdmin} onAction={handleAction} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function ConsultaCard({ c, isMedical, isAdmin, onAction }: { c: Consulta; isMedical: boolean; isAdmin: boolean; onAction: (id: string, estado: string) => void }) {
  const badge = ESTADO_BADGE[c.estado] || { bg: "bg-gray-500/20 text-gray-400", label: c.estado };
  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-2">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${badge.bg}`}>{badge.label}</span>
            <span className="text-xs text-gray-500">{c.especialidad?.replace("_", " ")}</span>
            <span className="text-[10px] text-gray-600">{c.tipo?.replace(/_/g, " ")}</span>
          </div>
          <p className="text-sm font-medium">{c.motivo || "Sin motivo"}</p>
          <div className="flex gap-3 mt-1 text-[10px] text-gray-500">
            {c.fecha_programada && <span>📅 {c.fecha_programada}</span>}
            {c.hora_inicio && <span>🕐 {c.hora_inicio}</span>}
            {c.paciente_nombre && <span>👤 {c.paciente_nombre}</span>}
            {c.medico_nombre && <span>⚕️ {c.medico_nombre}</span>}
          </div>
        </div>
      </div>
      {/* Actions */}
      {(isMedical || isAdmin) && c.estado === "programada" && (
        <div className="flex gap-2 mt-3">
          <button onClick={() => onAction(c.id, "en_curso")} className="flex-1 py-1.5 bg-green-600/20 text-green-400 rounded-lg text-xs font-bold">▶ Iniciar</button>
          <button onClick={() => onAction(c.id, "no_asistio")} className="px-3 py-1.5 bg-gray-600/20 text-gray-400 rounded-lg text-xs">No asistió</button>
          <button onClick={() => onAction(c.id, "cancelada")} className="px-3 py-1.5 bg-red-600/20 text-red-400 rounded-lg text-xs">Cancelar</button>
        </div>
      )}
      {(isMedical || isAdmin) && c.estado === "en_curso" && (
        <div className="flex gap-2 mt-3 flex-wrap">
          <a href={`/clinico/sala?id=${c.id}`} className="flex-1 py-1.5 bg-emerald-500/20 text-emerald-400 rounded-lg text-xs font-bold text-center">📹 Sala</a>
          <a href={`/clinico/hce?consulta_id=${c.id}`} className="flex-1 py-1.5 bg-[#c5a044]/20 text-[#c5a044] rounded-lg text-xs font-bold text-center">📋 HCE</a>
          <a href={`/clinico/formula?consulta_id=${c.id}`} className="flex-1 py-1.5 bg-purple-500/20 text-purple-400 rounded-lg text-xs font-bold text-center">💊 Fórmula</a>
          <a href={`/clinico/incapacidad?consulta_id=${c.id}`} className="flex-1 py-1.5 bg-orange-500/20 text-orange-400 rounded-lg text-xs font-bold text-center">🏥 Incap.</a>
          <a href={`/clinico/paraclinicos?consulta_id=${c.id}`} className="flex-1 py-1.5 bg-cyan-500/20 text-cyan-400 rounded-lg text-xs font-bold text-center">🔬 Labs</a>
          <button onClick={() => onAction(c.id, "completada")} className="flex-1 py-1.5 bg-green-600/20 text-green-400 rounded-lg text-xs font-bold">✅ Completar</button>
        </div>
      )}
    </div>
  );
}
