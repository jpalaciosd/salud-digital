"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/lib/AuthContext";
import UserNav from "@/lib/UserNav";

interface AuditLog {
  id: string; user_id: string; rol: string; accion: string;
  recurso_tipo: string; recurso_id: string; datos_despues?: Record<string, unknown>;
  ip_address?: string; created_at: string;
}

const BADGE_COLORS: Record<string, string> = {
  CREATE: "bg-green-500/20 text-green-400",
  UPDATE: "bg-blue-500/20 text-blue-400",
  DELETE: "bg-red-500/20 text-red-400",
  READ: "bg-gray-500/20 text-gray-400",
};

const RECURSO_ICONS: Record<string, string> = {
  hce_registro: "📋", consentimiento: "✅", consulta: "🩺",
  formula_medica: "💊", organizacion: "🏢", aiepi: "🧒",
  perfil_paciente: "👤", perfil_medico: "⚕️",
};

export default function AuditorPage() {
  const { user, loading } = useAuth();
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [stats, setStats] = useState<{ byType: Record<string, number>; byAction: Record<string, number>; total: number }>({ byType: {}, byAction: {}, total: 0 });
  const [fetching, setFetching] = useState(true);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    if (loading || !user) return;
    fetch(`/api/clinico/audit?limit=100`)
      .then((r) => r.json())
      .then((d) => {
        setLogs(d.logs || []);
        setStats({ byType: d.byType || {}, byAction: d.byAction || {}, total: d.total || 0 });
        setFetching(false);
      })
      .catch(() => setFetching(false));
  }, [user, loading]);

  if (loading || fetching) return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
      <div className="animate-spin h-10 w-10 border-4 border-[#c5a044] border-t-transparent rounded-full" />
    </div>
  );

  if (!user || !["admin", "super_admin", "auditor"].includes((user as Record<string, string>).rol)) {
    return (
      <div className="min-h-screen bg-[#0f172a] text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-5xl mb-4">🔒</p>
          <h1 className="text-xl font-bold text-red-400">Acceso Denegado</h1>
          <p className="text-gray-400 text-sm mt-2">Solo administradores y auditores pueden acceder a este panel.</p>
        </div>
      </div>
    );
  }

  const filtered = filter ? logs.filter((l) => l.recurso_tipo === filter) : logs;

  return (
    <div className="min-h-screen bg-[#0f172a] text-white">
      <UserNav />
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-red-500/20 flex items-center justify-center text-2xl">🔍</div>
          <div>
            <h1 className="text-xl font-bold">Panel de Auditoría</h1>
            <p className="text-xs text-gray-400">Trazabilidad completa · {stats.total} registros</p>
          </div>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-[#c5a044]">{stats.total}</p>
            <p className="text-[10px] text-gray-400">Total eventos</p>
          </div>
          {Object.entries(stats.byAction).map(([action, count]) => (
            <div key={action} className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold">{count}</p>
              <p className="text-[10px] text-gray-400">{action}</p>
            </div>
          ))}
        </div>

        {/* Filter by type */}
        <div className="flex flex-wrap gap-2 mb-4">
          <button onClick={() => setFilter("")} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${!filter ? "bg-[#c5a044] text-[#0f172a]" : "bg-white/5 text-gray-400"}`}>
            Todos
          </button>
          {Object.entries(stats.byType).map(([type, count]) => (
            <button key={type} onClick={() => setFilter(type)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${filter === type ? "bg-[#c5a044] text-[#0f172a]" : "bg-white/5 text-gray-400"}`}>
              {RECURSO_ICONS[type] || "📄"} {type} ({count})
            </button>
          ))}
        </div>

        {/* Log list */}
        <div className="space-y-2">
          {filtered.length === 0 ? (
            <div className="bg-white/5 border border-white/10 rounded-xl p-8 text-center">
              <p className="text-gray-500">Sin registros de auditoría</p>
            </div>
          ) : filtered.map((log) => (
            <div key={log.id} className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-start gap-3">
              <span className="text-xl">{RECURSO_ICONS[log.recurso_tipo] || "📄"}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${BADGE_COLORS[log.accion] || "bg-gray-500/20 text-gray-400"}`}>
                    {log.accion}
                  </span>
                  <span className="text-sm font-medium">{log.recurso_tipo}</span>
                  <span className="text-[10px] text-gray-500 font-mono truncate">{log.recurso_id?.slice(0, 8)}...</span>
                </div>
                <div className="flex items-center gap-2 mt-1 text-[10px] text-gray-500">
                  <span>👤 {log.rol}</span>
                  {log.ip_address && <span>🌐 {log.ip_address}</span>}
                  <span>🕐 {new Date(log.created_at).toLocaleString("es-CO")}</span>
                </div>
                {log.datos_despues && (
                  <p className="text-[10px] text-gray-600 mt-1 font-mono truncate">
                    {JSON.stringify(log.datos_despues).slice(0, 120)}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
