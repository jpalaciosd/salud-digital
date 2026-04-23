"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/lib/AuthContext";
import UserNav from "@/lib/UserNav";
import Link from "next/link";

interface Consulta {
  id: string; estado: string; paciente_id: string; paciente_nombre: string;
  motivo: string; especialidad: string; fecha_programada: string;
  created_at: string; tipo: string;
}

interface HCE {
  id: string; motivo_consulta: string; diagnosticos: { cie10: string; descripcion: string; tipo: string }[];
  created_at: string; paciente_id: string; medico_nombre: string;
}

export default function PacientesPage() {
  const { user, loading } = useAuth();
  const [consultas, setConsultas] = useState<Consulta[]>([]);
  const [hces, setHces] = useState<HCE[]>([]);
  const [fetching, setFetching] = useState(true);
  const [selectedPaciente, setSelectedPaciente] = useState<string | null>(null);

  useEffect(() => {
    if (loading || !user) return;
    Promise.allSettled([
      fetch("/api/clinico/consultas").then((r) => r.json()),
      fetch("/api/clinico/hce").then((r) => r.json()),
    ]).then(([c, h]) => {
      if (c.status === "fulfilled") setConsultas(c.value.consultas || []);
      if (h.status === "fulfilled") setHces(h.value.registros || []);
      setFetching(false);
    });
  }, [user, loading]);

  if (loading || fetching) return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
      <div className="animate-spin h-10 w-10 border-4 border-[#c5a044] border-t-transparent rounded-full" />
    </div>
  );

  // Build patient list from consultas
  const pacientesMap = new Map<string, { nombre: string; consultas: number; ultima: string; estados: string[] }>();
  for (const c of consultas) {
    const pid = c.paciente_id || c.paciente_nombre;
    if (!pid) continue;
    const existing = pacientesMap.get(pid) || { nombre: c.paciente_nombre || pid, consultas: 0, ultima: "", estados: [] };
    existing.consultas++;
    if (!existing.ultima || c.created_at > existing.ultima) existing.ultima = c.created_at;
    existing.estados.push(c.estado);
    pacientesMap.set(pid, existing);
  }
  const pacientes = Array.from(pacientesMap.entries()).sort((a, b) => b[1].ultima.localeCompare(a[1].ultima));

  const pacienteConsultas = selectedPaciente ? consultas.filter((c) => (c.paciente_id || c.paciente_nombre) === selectedPaciente) : [];
  const pacienteHces = selectedPaciente ? hces.filter((h) => h.paciente_id === selectedPaciente) : [];

  return (
    <div className="min-h-screen bg-[#0f172a] text-white">
      <UserNav />
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-[#c5a044]/20 flex items-center justify-center text-2xl">👥</div>
          <div>
            <h1 className="text-xl font-bold">Mis Pacientes</h1>
            <p className="text-xs text-gray-400">{pacientes.length} pacientes atendidos · {consultas.length} consultas totales</p>
          </div>
        </div>

        <div className="flex gap-4">
          {/* Patient list */}
          <div className={`${selectedPaciente ? "w-1/3" : "w-full"} space-y-2 transition-all`}>
            {pacientes.length === 0 ? (
              <div className="bg-white/5 border border-white/10 rounded-xl p-8 text-center">
                <p className="text-3xl mb-2">👥</p>
                <p className="text-gray-500 text-sm">Aún no tiene pacientes registrados.</p>
                <Link href="/clinico/agenda" className="text-[#c5a044] text-xs mt-2 inline-block">Ir a Agenda →</Link>
              </div>
            ) : pacientes.map(([pid, p]) => (
              <button key={pid} onClick={() => setSelectedPaciente(pid === selectedPaciente ? null : pid)}
                className={`w-full text-left p-4 rounded-xl border transition-all ${
                  pid === selectedPaciente ? "bg-[#c5a044]/10 border-[#c5a044]/30" : "bg-white/5 border-white/10 hover:border-white/20"
                }`}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-sm font-bold">
                    {p.nombre.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate">{p.nombre}</p>
                    <p className="text-[10px] text-gray-500">{p.consultas} consulta{p.consultas > 1 ? "s" : ""} · Última: {new Date(p.ultima).toLocaleDateString("es-CO")}</p>
                  </div>
                  {p.estados.includes("en_curso") && <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />}
                  {p.estados.includes("programada") && <span className="w-2 h-2 rounded-full bg-blue-400" />}
                </div>
              </button>
            ))}
          </div>

          {/* Patient detail */}
          {selectedPaciente && (
            <div className="flex-1 space-y-4">
              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <h2 className="text-sm font-bold text-[#c5a044] mb-3">Consultas ({pacienteConsultas.length})</h2>
                {pacienteConsultas.length === 0 ? (
                  <p className="text-gray-500 text-xs">Sin consultas</p>
                ) : pacienteConsultas.map((c) => (
                  <div key={c.id} className="flex items-center gap-3 p-3 bg-white/5 rounded-lg mb-2 border border-white/5">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      c.estado === "completada" ? "bg-green-500/20 text-green-400" :
                      c.estado === "en_curso" ? "bg-yellow-500/20 text-yellow-400" :
                      c.estado === "programada" ? "bg-blue-500/20 text-blue-400" :
                      "bg-gray-500/20 text-gray-400"
                    }`}>{c.estado}</span>
                    <div className="flex-1">
                      <p className="text-xs font-medium">{c.motivo || "Sin motivo"}</p>
                      <p className="text-[10px] text-gray-500">{c.fecha_programada || new Date(c.created_at).toLocaleDateString("es-CO")} · {c.especialidad?.replace("_", " ")}</p>
                    </div>
                    {c.estado === "programada" && (
                      <Link href={`/clinico/sala?id=${c.id}`} className="px-3 py-1 bg-green-600/20 text-green-400 rounded-lg text-[10px] font-bold">
                        ▶ Entrar
                      </Link>
                    )}
                  </div>
                ))}
              </div>

              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <h2 className="text-sm font-bold text-[#c5a044] mb-3">Historias Clínicas ({pacienteHces.length})</h2>
                {pacienteHces.length === 0 ? (
                  <p className="text-gray-500 text-xs">Sin registros HCE</p>
                ) : pacienteHces.map((h) => (
                  <div key={h.id} className="p-3 bg-white/5 rounded-lg mb-2 border border-white/5">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-medium">{h.motivo_consulta}</p>
                      <a href={`/api/clinico/hce/pdf?id=${h.id}`} target="_blank" className="text-[#c5a044] text-[10px] font-bold">📄 PDF</a>
                    </div>
                    <div className="flex gap-2 mt-1 flex-wrap">
                      {(h.diagnosticos || []).map((d) => (
                        <span key={d.cie10} className="px-2 py-0.5 bg-[#c5a044]/10 text-[#c5a044] rounded text-[10px] font-mono">{d.cie10}</span>
                      ))}
                    </div>
                    <p className="text-[10px] text-gray-500 mt-1">{new Date(h.created_at).toLocaleDateString("es-CO")}</p>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <Link href="/clinico/hce" className="flex-1 py-2 bg-[#c5a044]/10 text-[#c5a044] rounded-xl text-xs font-bold text-center border border-[#c5a044]/20">
                  📋 Nueva HCE
                </Link>
                <Link href="/clinico/formula" className="flex-1 py-2 bg-purple-500/10 text-purple-400 rounded-xl text-xs font-bold text-center border border-purple-500/20">
                  💊 Formular
                </Link>
                <Link href="/clinico/aiepi" className="flex-1 py-2 bg-green-500/10 text-green-400 rounded-xl text-xs font-bold text-center border border-green-500/20">
                  🧒 AIEPI
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
