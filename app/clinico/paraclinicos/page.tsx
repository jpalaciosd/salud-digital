"use client";
import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/lib/AuthContext";
import UserNav from "@/lib/UserNav";

interface Examen { code: string; name: string; categoria: string; indicaciones?: string; }

export default function ParaclinicosPage() {
  const { user, loading } = useAuth();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [savedId, setSavedId] = useState("");

  const [pacienteNombre, setPacienteNombre] = useState("");
  const [pacienteDoc, setPacienteDoc] = useState("");
  const [diagnostico, setDiagnostico] = useState("");
  const [prioridad, setPrioridad] = useState("normal");
  const [indicaciones, setIndicaciones] = useState("");
  const [examenes, setExamenes] = useState<Examen[]>([]);

  // Search
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Examen[]>([]);

  const search = useCallback(async (q: string) => {
    if (q.length < 1) { setResults([]); return; }
    const res = await fetch(`/api/clinico/paraclinicos?q=${encodeURIComponent(q)}`);
    const d = await res.json();
    setResults(d.examenes || []);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => search(query), 200);
    return () => clearTimeout(t);
  }, [query, search]);

  const addExamen = (e: Examen) => {
    if (examenes.find((x) => x.code === e.code)) return;
    setExamenes([...examenes, e]);
    setQuery("");
    setResults([]);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/clinico/paraclinicos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paciente_nombre: pacienteNombre, paciente_documento: pacienteDoc, diagnostico, prioridad, indicaciones, examenes }),
      });
      if (res.ok) { const d = await res.json(); setSaved(true); setSavedId(d.id || ""); }
    } catch (e) { console.error(e); }
    setSaving(false);
  };

  if (loading) return <div className="min-h-screen bg-[#0f172a] flex items-center justify-center"><div className="animate-spin h-10 w-10 border-4 border-[#c5a044] border-t-transparent rounded-full" /></div>;

  const grouped = examenes.reduce<Record<string, Examen[]>>((acc, e) => {
    (acc[e.categoria] = acc[e.categoria] || []).push(e);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-[#0f172a] text-white">
      <UserNav />
      <div className="max-w-lg mx-auto px-4 py-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 flex items-center justify-center text-2xl">🔬</div>
          <div>
            <h1 className="text-xl font-bold">Orden de Paraclínicos</h1>
            <p className="text-xs text-gray-400">Laboratorios e imagenología</p>
          </div>
        </div>

        {saved ? (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center">
            <p className="text-5xl mb-4">✅</p>
            <h2 className="text-xl font-bold text-green-400">Orden Emitida</h2>
            <p className="text-gray-400 text-sm mt-2">{examenes.length} exámenes · Paciente: {pacienteNombre}</p>
            <div className="mt-6 flex flex-col gap-3">
              {savedId && (
                <a href={`/api/clinico/paraclinicos/pdf?id=${savedId}`} target="_blank"
                  className="block py-3 bg-[#c5a044] text-[#0f172a] rounded-xl font-bold text-sm text-center">
                  📄 Descargar PDF
                </a>
              )}
              <button onClick={() => { setSaved(false); setSavedId(""); setExamenes([]); setPacienteNombre(""); setDiagnostico(""); }}
                className="py-3 border border-white/10 text-gray-300 rounded-xl font-bold text-sm">
                Nueva Orden
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-3">
              <h2 className="text-sm font-bold text-[#c5a044]">Paciente</h2>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Nombre</label>
                  <input type="text" value={pacienteNombre} onChange={(e) => setPacienteNombre(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm" />
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Documento</label>
                  <input type="text" value={pacienteDoc} onChange={(e) => setPacienteDoc(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm" />
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Diagnóstico</label>
                <input type="text" value={diagnostico} onChange={(e) => setDiagnostico(e.target.value)} placeholder="Ej: K29 Gastritis"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm" />
              </div>
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="text-xs text-gray-400 mb-1 block">Prioridad</label>
                  <select value={prioridad} onChange={(e) => setPrioridad(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm">
                    <option value="normal">Normal</option>
                    <option value="urgente">Urgente</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-3">
              <h2 className="text-sm font-bold text-[#c5a044]">Buscar Exámenes</h2>
              <div className="relative">
                <input type="text" value={query} onChange={(e) => setQuery(e.target.value)}
                  placeholder="Hemograma, glucosa, TSH, radiografía..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white" />
                {results.length > 0 && (
                  <div className="absolute z-20 w-full mt-1 bg-[#1e293b] border border-white/20 rounded-xl shadow-2xl max-h-56 overflow-y-auto">
                    {results.map((r) => (
                      <button key={r.code} onClick={() => addExamen(r)}
                        className="w-full text-left px-4 py-2.5 hover:bg-white/10 flex items-center gap-3 border-b border-white/5">
                        <span className="text-cyan-400 font-mono text-xs font-bold min-w-[40px]">{r.code}</span>
                        <span className="text-sm text-gray-300 flex-1">{r.name}</span>
                        <span className="text-[10px] text-gray-500">{r.categoria}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {examenes.length === 0 && <p className="text-xs text-gray-500">Busque y agregue exámenes a la orden</p>}

              {Object.entries(grouped).map(([cat, exams]) => (
                <div key={cat}>
                  <p className="text-[10px] text-gray-500 font-bold mt-2 mb-1">{cat}</p>
                  {exams.map((e) => (
                    <div key={e.code} className="flex items-center gap-2 p-2 bg-cyan-500/5 border border-cyan-500/20 rounded-lg mb-1">
                      <span className="text-cyan-400 font-mono text-xs font-bold">{e.code}</span>
                      <span className="text-sm flex-1">{e.name}</span>
                      <button onClick={() => setExamenes(examenes.filter((x) => x.code !== e.code))} className="text-red-400 text-xs">✕</button>
                    </div>
                  ))}
                </div>
              ))}
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
              <label className="text-xs text-gray-400 mb-1 block">Indicaciones generales</label>
              <textarea value={indicaciones} onChange={(e) => setIndicaciones(e.target.value)} rows={2} placeholder="Ayuno de 12h, recoger muestra en la mañana..."
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm resize-none" />
            </div>

            <button onClick={handleSave} disabled={examenes.length === 0 || !pacienteNombre || saving}
              className={`w-full py-4 rounded-xl font-bold text-lg transition ${examenes.length > 0 && pacienteNombre && !saving ? "bg-[#c5a044] text-[#0f172a] active:scale-95" : "bg-gray-700 text-gray-500 cursor-not-allowed"}`}>
              {saving ? "Emitiendo..." : `🔬 Emitir Orden (${examenes.length} exámenes)`}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
