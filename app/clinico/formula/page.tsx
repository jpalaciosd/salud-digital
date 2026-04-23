"use client";
import { useState } from "react";
import { useAuth } from "@/lib/AuthContext";
import UserNav from "@/lib/UserNav";

interface Medicamento { nombre: string; dosis: string; frecuencia: string; via: string; duracion: string; }

const VIAS = ["Oral", "Sublingual", "Tópica", "Intravenosa", "Intramuscular", "Subcutánea", "Inhalatoria", "Rectal", "Oftálmica", "Ótica"];

export default function FormulaPage() {
  const { user, loading } = useAuth();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [savedId, setSavedId] = useState("");

  const [pacienteNombre, setPacienteNombre] = useState("");
  const [pacienteDoc, setPacienteDoc] = useState("");
  const [diagnostico, setDiagnostico] = useState("");
  const [observaciones, setObservaciones] = useState("");

  const [medicamentos, setMedicamentos] = useState<Medicamento[]>([]);
  const [medNombre, setMedNombre] = useState("");
  const [medDosis, setMedDosis] = useState("");
  const [medFrec, setMedFrec] = useState("");
  const [medVia, setMedVia] = useState("Oral");
  const [medDuracion, setMedDuracion] = useState("");

  const addMed = () => {
    if (!medNombre || !medDosis) return;
    setMedicamentos([...medicamentos, { nombre: medNombre, dosis: medDosis, frecuencia: medFrec, via: medVia, duracion: medDuracion }]);
    setMedNombre(""); setMedDosis(""); setMedFrec(""); setMedDuracion("");
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/clinico/formulas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paciente_nombre: pacienteNombre, paciente_documento: pacienteDoc, diagnostico, observaciones, medicamentos }),
      });
      if (res.ok) { const d = await res.json(); setSaved(true); setSavedId(d.id || ""); }
    } catch (e) { console.error(e); }
    setSaving(false);
  };

  if (loading) return <div className="min-h-screen bg-[#0f172a] flex items-center justify-center"><div className="animate-spin h-10 w-10 border-4 border-[#c5a044] border-t-transparent rounded-full" /></div>;

  const Input = ({ label, value, onChange, placeholder = "" }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) => (
    <div>
      <label className="text-xs text-gray-400 mb-1 block">{label}</label>
      <input type="text" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
        className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:border-[#c5a044]/50 outline-none" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0f172a] text-white">
      <UserNav />
      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-[#c5a044]/20 flex items-center justify-center text-2xl">💊</div>
          <div>
            <h1 className="text-xl font-bold">Fórmula Médica</h1>
            <p className="text-xs text-gray-400">Decreto 2200 de 2005</p>
          </div>
        </div>

        {saved ? (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center">
            <p className="text-5xl mb-4">✅</p>
            <h2 className="text-xl font-bold text-green-400">Fórmula Guardada</h2>
            <p className="text-gray-400 text-sm mt-2">Prescripción registrada con trazabilidad.</p>
            <div className="mt-4 text-xs text-gray-500">
              <p>Médico: {user?.nombre} {user?.apellido}</p>
              <p>Paciente: {pacienteNombre}</p>
              <p>Medicamentos: {medicamentos.length}</p>
              <p>{new Date().toLocaleString("es-CO")}</p>
            </div>
            <div className="mt-6 flex flex-col gap-3">
              {savedId && (
                <a href={`/api/clinico/formulas/pdf?id=${savedId}`} target="_blank"
                  className="block py-3 bg-[#c5a044] text-[#0f172a] rounded-xl font-bold text-sm text-center">
                  📄 Descargar PDF
                </a>
              )}
              <button onClick={() => { setSaved(false); setSavedId(""); setMedicamentos([]); setPacienteNombre(""); setPacienteDoc(""); setDiagnostico(""); }}
                className="px-6 py-3 border border-white/10 text-gray-300 rounded-xl font-bold text-sm">
                Nueva Fórmula
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Paciente */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-3">
              <h2 className="text-sm font-bold text-[#c5a044]">Datos del Paciente</h2>
              <div className="grid grid-cols-2 gap-3">
                <Input label="Nombre completo" value={pacienteNombre} onChange={setPacienteNombre} placeholder="Nombre del paciente" />
                <Input label="Documento" value={pacienteDoc} onChange={setPacienteDoc} placeholder="CC 1234567890" />
              </div>
              <Input label="Diagnóstico" value={diagnostico} onChange={setDiagnostico} placeholder="Ej: K29 - Gastritis" />
            </div>

            {/* Add medicamento */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-3">
              <h2 className="text-sm font-bold text-[#c5a044]">Agregar Medicamento</h2>
              <Input label="Medicamento *" value={medNombre} onChange={setMedNombre} placeholder="Ej: Amoxicilina" />
              <div className="grid grid-cols-2 gap-3">
                <Input label="Dosis *" value={medDosis} onChange={setMedDosis} placeholder="500mg" />
                <Input label="Frecuencia" value={medFrec} onChange={setMedFrec} placeholder="Cada 8 horas" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Vía</label>
                  <select value={medVia} onChange={(e) => setMedVia(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm">
                    {VIAS.map((v) => <option key={v} value={v}>{v}</option>)}
                  </select>
                </div>
                <Input label="Duración" value={medDuracion} onChange={setMedDuracion} placeholder="7 días" />
              </div>
              <button onClick={addMed} disabled={!medNombre || !medDosis}
                className={`w-full py-2.5 rounded-xl font-bold text-sm transition ${medNombre && medDosis ? "bg-[#c5a044]/20 text-[#c5a044] border border-[#c5a044]/30 active:scale-95" : "bg-gray-800 text-gray-600 cursor-not-allowed"}`}>
                + Agregar medicamento
              </button>
            </div>

            {/* Lista */}
            {medicamentos.length > 0 && (
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-3">
                <h2 className="text-sm font-bold text-[#c5a044]">Medicamentos ({medicamentos.length})</h2>
                {medicamentos.map((m, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 bg-white/5 rounded-xl border border-white/10">
                    <span className="text-[#c5a044] font-bold text-sm mt-0.5">{i + 1}.</span>
                    <div className="flex-1 text-sm">
                      <p className="font-semibold">{m.nombre}</p>
                      <p className="text-gray-400 text-xs">{m.dosis} · {m.frecuencia} · {m.via} · {m.duracion}</p>
                    </div>
                    <button onClick={() => setMedicamentos(medicamentos.filter((_, j) => j !== i))} className="text-red-400 text-xs">✕</button>
                  </div>
                ))}
              </div>
            )}

            {/* Observaciones */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
              <label className="text-xs text-gray-400 mb-1 block">Observaciones</label>
              <textarea value={observaciones} onChange={(e) => setObservaciones(e.target.value)} rows={2} placeholder="Instrucciones adicionales..."
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm resize-none" />
            </div>

            {/* Firma */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 text-center">
              <p className="text-xs text-gray-500 mb-3">Médico: <strong>{user?.nombre} {user?.apellido}</strong> · {new Date().toLocaleDateString("es-CO")}</p>
              {medicamentos.length === 0 && <p className="text-red-400 text-xs mb-3">⚠️ Agregue al menos un medicamento</p>}
              <button onClick={handleSave} disabled={medicamentos.length === 0 || !pacienteNombre || saving}
                className={`w-full py-4 rounded-xl font-bold text-lg transition ${medicamentos.length > 0 && pacienteNombre && !saving ? "bg-[#c5a044] text-[#0f172a] active:scale-95" : "bg-gray-700 text-gray-500 cursor-not-allowed"}`}>
                {saving ? "Guardando..." : "✍️ Firmar y Generar Fórmula"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
