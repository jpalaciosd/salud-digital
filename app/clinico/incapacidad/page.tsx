"use client";
import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/lib/AuthContext";
import UserNav from "@/lib/UserNav";

interface CIE10R { code: string; description: string; }

export default function IncapacidadPage() {
  const { user, loading } = useAuth();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [savedId, setSavedId] = useState("");

  const [pacienteNombre, setPacienteNombre] = useState("");
  const [pacienteDoc, setPacienteDoc] = useState("");
  const [diagnostico, setDiagnostico] = useState("");
  const [diagnosticoCie10, setDiagnosticoCie10] = useState("");
  const [dias, setDias] = useState<number>(0);
  const [fechaInicio, setFechaInicio] = useState(new Date().toISOString().split("T")[0]);
  const [tipo, setTipo] = useState("enfermedad_general");
  const [recomendaciones, setRecomendaciones] = useState("");

  // CIE-10 search
  const [cieQuery, setCieQuery] = useState("");
  const [cieResults, setCieResults] = useState<CIE10R[]>([]);

  const searchCIE = useCallback(async (q: string) => {
    if (q.length < 2) { setCieResults([]); return; }
    const res = await fetch(`/api/clinico/cie10?q=${encodeURIComponent(q)}&limit=5`);
    const d = await res.json();
    setCieResults(d.results || []);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => searchCIE(cieQuery), 300);
    return () => clearTimeout(t);
  }, [cieQuery, searchCIE]);

  const fechaFin = dias > 0 ? new Date(new Date(fechaInicio).getTime() + dias * 86400000).toISOString().split("T")[0] : "";

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/clinico/incapacidades", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paciente_nombre: pacienteNombre, paciente_documento: pacienteDoc, diagnostico, diagnostico_cie10: diagnosticoCie10, dias, fecha_inicio: fechaInicio, tipo, recomendaciones }),
      });
      if (res.ok) { const d = await res.json(); setSaved(true); setSavedId(d.id || ""); }
    } catch (e) { console.error(e); }
    setSaving(false);
  };

  if (loading) return <div className="min-h-screen bg-[#0f172a] flex items-center justify-center"><div className="animate-spin h-10 w-10 border-4 border-[#c5a044] border-t-transparent rounded-full" /></div>;

  const Input = ({ label, value, onChange, placeholder = "", type = "text" }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string }) => (
    <div>
      <label className="text-xs text-gray-400 mb-1 block">{label}</label>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
        className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:border-[#c5a044]/50 outline-none" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0f172a] text-white">
      <UserNav />
      <div className="max-w-lg mx-auto px-4 py-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-orange-500/20 flex items-center justify-center text-2xl">🏥</div>
          <div>
            <h1 className="text-xl font-bold">Certificado de Incapacidad</h1>
            <p className="text-xs text-gray-400">Generación digital con trazabilidad</p>
          </div>
        </div>

        {saved ? (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center">
            <p className="text-5xl mb-4">✅</p>
            <h2 className="text-xl font-bold text-green-400">Incapacidad Emitida</h2>
            <p className="text-gray-400 text-sm mt-2">{dias} días · {fechaInicio} al {fechaFin}</p>
            <p className="text-xs text-gray-500 mt-1">Paciente: {pacienteNombre} · Médico: {user?.nombre} {user?.apellido}</p>
            <div className="mt-6 flex flex-col gap-3">
              {savedId && (
                <a href={`/api/clinico/incapacidades/pdf?id=${savedId}`} target="_blank"
                  className="block py-3 bg-[#c5a044] text-[#0f172a] rounded-xl font-bold text-sm text-center">
                  📄 Descargar PDF
                </a>
              )}
              <button onClick={() => { setSaved(false); setSavedId(""); setDias(0); setPacienteNombre(""); setDiagnostico(""); }}
                className="py-3 border border-white/10 text-gray-300 rounded-xl font-bold text-sm">
                Nueva Incapacidad
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-3">
              <h2 className="text-sm font-bold text-[#c5a044]">Datos del Paciente</h2>
              <div className="grid grid-cols-2 gap-3">
                <Input label="Nombre completo" value={pacienteNombre} onChange={setPacienteNombre} />
                <Input label="Documento" value={pacienteDoc} onChange={setPacienteDoc} placeholder="CC 1234567890" />
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-3">
              <h2 className="text-sm font-bold text-[#c5a044]">Diagnóstico</h2>
              <div className="relative">
                <input type="text" value={cieQuery} onChange={(e) => setCieQuery(e.target.value)}
                  placeholder="Buscar CIE-10: gastritis, J45..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white" />
                {cieResults.length > 0 && (
                  <div className="absolute z-20 w-full mt-1 bg-[#1e293b] border border-white/20 rounded-xl shadow-2xl max-h-48 overflow-y-auto">
                    {cieResults.map((r) => (
                      <button key={r.code} onClick={() => { setDiagnosticoCie10(r.code); setDiagnostico(r.description); setCieQuery(""); setCieResults([]); }}
                        className="w-full text-left px-4 py-2 hover:bg-white/10 flex gap-2 border-b border-white/5">
                        <span className="text-[#c5a044] font-mono text-xs font-bold">{r.code}</span>
                        <span className="text-sm text-gray-300">{r.description}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              {diagnosticoCie10 && (
                <div className="flex items-center gap-2 p-2 bg-[#c5a044]/10 rounded-lg">
                  <span className="text-[#c5a044] font-mono text-xs font-bold">{diagnosticoCie10}</span>
                  <span className="text-sm">{diagnostico}</span>
                  <button onClick={() => { setDiagnosticoCie10(""); setDiagnostico(""); }} className="ml-auto text-red-400 text-xs">✕</button>
                </div>
              )}
              {!diagnosticoCie10 && <Input label="Diagnóstico (texto libre)" value={diagnostico} onChange={setDiagnostico} placeholder="Descripción del diagnóstico" />}
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-3">
              <h2 className="text-sm font-bold text-[#c5a044]">Datos de la Incapacidad</h2>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Tipo</label>
                <select value={tipo} onChange={(e) => setTipo(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm">
                  <option value="enfermedad_general">Enfermedad General</option>
                  <option value="accidente_trabajo">Accidente de Trabajo</option>
                  <option value="maternidad">Licencia de Maternidad</option>
                  <option value="paternidad">Licencia de Paternidad</option>
                </select>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Días</label>
                  <input type="number" value={dias || ""} onChange={(e) => setDias(Number(e.target.value))} min={1} max={180}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm text-center font-bold text-lg" />
                </div>
                <Input label="Desde" value={fechaInicio} onChange={setFechaInicio} type="date" />
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Hasta</label>
                  <div className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-gray-400 text-sm">{fechaFin || "—"}</div>
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Recomendaciones</label>
                <textarea value={recomendaciones} onChange={(e) => setRecomendaciones(e.target.value)} rows={2} placeholder="Reposo, evitar esfuerzos..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm resize-none" />
              </div>
            </div>

            <button onClick={handleSave} disabled={!pacienteNombre || !diagnostico || !dias || saving}
              className={`w-full py-4 rounded-xl font-bold text-lg transition ${pacienteNombre && diagnostico && dias && !saving ? "bg-[#c5a044] text-[#0f172a] active:scale-95" : "bg-gray-700 text-gray-500 cursor-not-allowed"}`}>
              {saving ? "Emitiendo..." : "✍️ Emitir Incapacidad"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
