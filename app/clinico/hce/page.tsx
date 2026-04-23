"use client";
import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/lib/AuthContext";
import UserNav from "@/lib/UserNav";

interface CIE10Result { code: string; description: string; category: string; }
interface Diagnostico { cie10: string; descripcion: string; tipo: "principal" | "diferencial"; }

const SISTEMAS = [
  { key: "cardiovascular", label: "Cardiovascular" },
  { key: "respiratorio", label: "Respiratorio" },
  { key: "gastrointestinal", label: "Gastrointestinal" },
  { key: "genitourinario", label: "Genitourinario" },
  { key: "neurologico", label: "Neurológico" },
  { key: "musculoesqueletico", label: "Musculoesquelético" },
  { key: "piel", label: "Piel y faneras" },
  { key: "endocrino", label: "Endocrino" },
  { key: "psiquiatrico", label: "Psiquiátrico" },
];

export default function HCEPage() {
  const { user, loading } = useAuth();
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Step 0: Motivo + enfermedad actual
  const [motivo, setMotivo] = useState("");
  const [enfermedadActual, setEnfermedadActual] = useState("");

  // Step 1: Antecedentes
  const [antPatologicos, setAntPatologicos] = useState("");
  const [antQuirurgicos, setAntQuirurgicos] = useState("");
  const [antFarmacologicos, setAntFarmacologicos] = useState("");
  const [antAlergicos, setAntAlergicos] = useState("");
  const [antFamiliares, setAntFamiliares] = useState("");

  // Step 2: Revisión por sistemas
  const [sistemas, setSistemas] = useState<Record<string, { presente: boolean; observaciones: string }>>(
    Object.fromEntries(SISTEMAS.map((s) => [s.key, { presente: false, observaciones: "" }]))
  );

  // Step 3: Examen físico + signos vitales
  const [estadoGeneral, setEstadoGeneral] = useState("Estable");
  const [conciencia, setConciencia] = useState("Alerta, orientado");
  const [difRespiratoria, setDifRespiratoria] = useState(false);
  const [coloracion, setColoracion] = useState("Normal");
  const [examenObs, setExamenObs] = useState("");
  const [limitaciones, setLimitaciones] = useState("Examen físico limitado por modalidad virtual. No fue posible realizar palpación, percusión ni auscultación directa.");
  // Signos vitales
  const [taSist, setTaSist] = useState<number>(0);
  const [taDiast, setTaDiast] = useState<number>(0);
  const [fc, setFc] = useState<number>(0);
  const [fr, setFr] = useState<number>(0);
  const [temp, setTemp] = useState<number>(0);
  const [spo2, setSpo2] = useState<number>(0);
  const [pesoHce, setPesoHce] = useState<number>(0);
  const [tallaHce, setTallaHce] = useState<number>(0);
  const [svAutoReportados, setSvAutoReportados] = useState(true);

  // Step 4: Diagnóstico CIE-10
  const [diagnosticos, setDiagnosticos] = useState<Diagnostico[]>([]);
  const [cie10Query, setCie10Query] = useState("");
  const [cie10Results, setCie10Results] = useState<CIE10Result[]>([]);
  const [searchingCie, setSearchingCie] = useState(false);

  // Step 5: Plan de manejo
  const [planFarma, setPlanFarma] = useState("");
  const [planNoFarma, setPlanNoFarma] = useState("");
  const [educacion, setEducacion] = useState("");
  const [signosAlarma, setSignosAlarma] = useState("");

  // Step 6: Seguimiento
  const [controlDias, setControlDias] = useState<number>(0);
  const [remision, setRemision] = useState("");

  const STEPS = ["Motivo de consulta", "Antecedentes", "Revisión por sistemas", "Examen físico", "Diagnóstico CIE-10", "Plan de manejo", "Seguimiento", "✅ Firmar"];

  // CIE-10 search with debounce
  const searchCIE10 = useCallback(async (q: string) => {
    if (q.length < 2) { setCie10Results([]); return; }
    setSearchingCie(true);
    try {
      const res = await fetch(`/api/clinico/cie10?q=${encodeURIComponent(q)}&limit=8`);
      const data = await res.json();
      setCie10Results(data.results || []);
    } catch { setCie10Results([]); }
    setSearchingCie(false);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => searchCIE10(cie10Query), 300);
    return () => clearTimeout(timer);
  }, [cie10Query, searchCIE10]);

  const addDiagnostico = (r: CIE10Result) => {
    if (diagnosticos.find((d) => d.cie10 === r.code)) return;
    setDiagnosticos([...diagnosticos, {
      cie10: r.code,
      descripcion: r.description,
      tipo: diagnosticos.length === 0 ? "principal" : "diferencial",
    }]);
    setCie10Query("");
    setCie10Results([]);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const body = {
        motivo_consulta: motivo,
        enfermedad_actual: enfermedadActual,
        antecedentes_consulta: {
          patologicos: antPatologicos.split(",").map((s) => s.trim()).filter(Boolean),
          quirurgicos: antQuirurgicos.split(",").map((s) => s.trim()).filter(Boolean),
          farmacologicos: antFarmacologicos.split(",").map((s) => s.trim()).filter(Boolean),
          alergicos: antAlergicos.split(",").map((s) => s.trim()).filter(Boolean),
          familiares: antFamiliares.split(",").map((s) => s.trim()).filter(Boolean),
        },
        revision_sistemas: sistemas,
        examen_fisico: {
          estado_general: estadoGeneral,
          conciencia,
          dificultad_respiratoria: difRespiratoria,
          coloracion,
          observaciones: examenObs,
          limitado_por_virtualidad: true,
        },
        signos_vitales: {
          ta_sistolica: taSist || null, ta_diastolica: taDiast || null,
          frecuencia_cardiaca: fc || null, frecuencia_respiratoria: fr || null,
          temperatura: temp || null, saturacion_o2: spo2 || null,
          peso: pesoHce || null, talla: tallaHce || null,
          autoreportados: svAutoReportados,
        },
        limitaciones_teleconsulta: limitaciones,
        diagnosticos,
        plan_manejo: {
          farmacologico: planFarma,
          no_farmacologico: planNoFarma,
          educacion,
          signos_alarma: signosAlarma,
        },
        seguimiento: {
          control_en_dias: controlDias || null,
          remision: remision || null,
        },
      };
      const res = await fetch("/api/clinico/hce", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (res.ok) setSaved(true);
    } catch (e) { console.error(e); }
    setSaving(false);
  };

  if (loading) return <div className="min-h-screen bg-[#0f172a] flex items-center justify-center"><div className="animate-spin h-10 w-10 border-4 border-[#c5a044] border-t-transparent rounded-full" /></div>;

  const Textarea = ({ label, value, onChange, rows = 3, placeholder = "" }: { label: string; value: string; onChange: (v: string) => void; rows?: number; placeholder?: string }) => (
    <div>
      <label className="text-xs text-gray-400 mb-1 block">{label}</label>
      <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={rows} placeholder={placeholder}
        className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm resize-none focus:border-[#c5a044]/50 outline-none" />
    </div>
  );

  const NumInput = ({ label, value, onChange, unit }: { label: string; value: number; onChange: (v: number) => void; unit?: string }) => (
    <div>
      <label className="text-xs text-gray-400 mb-1 block">{label}</label>
      <div className="flex items-center gap-1">
        <input type="number" value={value || ""} onChange={(e) => onChange(Number(e.target.value))}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:border-[#c5a044]/50 outline-none" />
        {unit && <span className="text-[10px] text-gray-500 whitespace-nowrap">{unit}</span>}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0f172a] text-white">
      <UserNav />
      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-[#c5a044]/20 flex items-center justify-center text-2xl">📋</div>
          <div>
            <h1 className="text-xl font-bold">Historia Clínica Electrónica</h1>
            <p className="text-xs text-gray-400">Resolución 1995 de 1999 · Teleconsulta</p>
          </div>
        </div>

        {/* Progress */}
        <div className="mb-6">
          <div className="flex justify-between mb-2">
            <span className="text-xs text-gray-400">Paso {step + 1}/{STEPS.length}</span>
            <span className="text-xs text-[#c5a044] font-semibold">{STEPS[step]}</span>
          </div>
          <div className="w-full bg-white/5 rounded-full h-2">
            <div className="h-2 rounded-full bg-gradient-to-r from-[#c5a044] to-[#d4af37] transition-all" style={{ width: `${((step + 1) / STEPS.length) * 100}%` }} />
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-6">

          {/* STEP 0: Motivo + enfermedad actual */}
          {step === 0 && (
            <div className="space-y-4">
              <Textarea label="Motivo de consulta *" value={motivo} onChange={setMotivo} rows={2} placeholder="Motivo principal de la consulta" />
              <Textarea label="Enfermedad actual" value={enfermedadActual} onChange={setEnfermedadActual} rows={4} placeholder="Inicio, evolución, síntomas asociados, factores agravantes/aliviantes..." />
            </div>
          )}

          {/* STEP 1: Antecedentes */}
          {step === 1 && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold">Antecedentes</h2>
              <p className="text-[10px] text-gray-500">Separe múltiples con comas</p>
              <Textarea label="Patológicos" value={antPatologicos} onChange={setAntPatologicos} rows={2} placeholder="HTA, DM2, asma..." />
              <Textarea label="Quirúrgicos" value={antQuirurgicos} onChange={setAntQuirurgicos} rows={2} placeholder="Apendicectomía 2020..." />
              <Textarea label="Farmacológicos" value={antFarmacologicos} onChange={setAntFarmacologicos} rows={2} placeholder="Losartán 50mg/día..." />
              <Textarea label="Alérgicos" value={antAlergicos} onChange={setAntAlergicos} rows={1} placeholder="Penicilina, AINEs..." />
              <Textarea label="Familiares" value={antFamiliares} onChange={setAntFamiliares} rows={2} placeholder="Madre HTA, padre DM2..." />
            </div>
          )}

          {/* STEP 2: Revisión por sistemas */}
          {step === 2 && (
            <div className="space-y-3">
              <h2 className="text-lg font-bold">Revisión por Sistemas</h2>
              {SISTEMAS.map((s) => (
                <div key={s.key} className={`border rounded-xl p-3 transition-all ${sistemas[s.key].presente ? "bg-yellow-500/10 border-yellow-500/30" : "bg-white/5 border-white/10"}`}>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" checked={sistemas[s.key].presente}
                      onChange={(e) => setSistemas({ ...sistemas, [s.key]: { ...sistemas[s.key], presente: e.target.checked } })}
                      className="w-4 h-4 accent-[#c5a044]" />
                    <span className="text-sm font-medium">{s.label}</span>
                  </label>
                  {sistemas[s.key].presente && (
                    <input type="text" value={sistemas[s.key].observaciones} placeholder="Observaciones..."
                      onChange={(e) => setSistemas({ ...sistemas, [s.key]: { ...sistemas[s.key], observaciones: e.target.value } })}
                      className="mt-2 w-full bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white" />
                  )}
                </div>
              ))}
            </div>
          )}

          {/* STEP 3: Examen físico + signos vitales */}
          {step === 3 && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold">Examen Físico</h2>
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-3">
                <p className="text-xs text-yellow-300">⚠️ Teleconsulta: examen físico limitado por modalidad virtual</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Estado general</label>
                  <select value={estadoGeneral} onChange={(e) => setEstadoGeneral(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm">
                    <option value="Estable">Estable</option>
                    <option value="Regular">Regular</option>
                    <option value="Malo">Malo</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Conciencia</label>
                  <select value={conciencia} onChange={(e) => setConciencia(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm">
                    <option value="Alerta, orientado">Alerta, orientado</option>
                    <option value="Somnoliento">Somnoliento</option>
                    <option value="Confuso">Confuso</option>
                    <option value="Estuporoso">Estuporoso</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Coloración</label>
                  <select value={coloracion} onChange={(e) => setColoracion(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm">
                    <option value="Normal">Normal</option>
                    <option value="Pálido">Pálido</option>
                    <option value="Ictérico">Ictérico</option>
                    <option value="Cianótico">Cianótico</option>
                  </select>
                </div>
                <label className="flex items-center gap-2 p-2 rounded-xl border border-white/10 cursor-pointer">
                  <input type="checkbox" checked={difRespiratoria} onChange={(e) => setDifRespiratoria(e.target.checked)} className="w-4 h-4 accent-red-500" />
                  <span className="text-sm">Dif. respiratoria</span>
                </label>
              </div>
              <Textarea label="Observaciones del examen" value={examenObs} onChange={setExamenObs} rows={2} />
              <Textarea label="Limitaciones de teleconsulta" value={limitaciones} onChange={setLimitaciones} rows={2} />

              <h3 className="text-sm font-bold text-[#c5a044] mt-4">Signos Vitales</h3>
              <label className="flex items-center gap-2 text-xs text-gray-400">
                <input type="checkbox" checked={svAutoReportados} onChange={(e) => setSvAutoReportados(e.target.checked)} className="w-3 h-3 accent-[#c5a044]" />
                Autoreportados por el paciente
              </label>
              <div className="grid grid-cols-4 gap-2">
                <NumInput label="TA Sist" value={taSist} onChange={setTaSist} unit="mmHg" />
                <NumInput label="TA Diast" value={taDiast} onChange={setTaDiast} unit="mmHg" />
                <NumInput label="FC" value={fc} onChange={setFc} unit="lpm" />
                <NumInput label="FR" value={fr} onChange={setFr} unit="rpm" />
              </div>
              <div className="grid grid-cols-4 gap-2">
                <NumInput label="Temp" value={temp} onChange={setTemp} unit="°C" />
                <NumInput label="SpO2" value={spo2} onChange={setSpo2} unit="%" />
                <NumInput label="Peso" value={pesoHce} onChange={setPesoHce} unit="kg" />
                <NumInput label="Talla" value={tallaHce} onChange={setTallaHce} unit="cm" />
              </div>
            </div>
          )}

          {/* STEP 4: Diagnóstico CIE-10 */}
          {step === 4 && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold">Diagnóstico (CIE-10) *</h2>
              <div className="relative">
                <input type="text" value={cie10Query} onChange={(e) => setCie10Query(e.target.value)}
                  placeholder="Buscar diagnóstico: gastritis, J45, hipertensión..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-[#c5a044]/50 outline-none" />
                {searchingCie && <span className="absolute right-3 top-3 text-xs text-gray-500">Buscando...</span>}
                {cie10Results.length > 0 && (
                  <div className="absolute z-20 w-full mt-1 bg-[#1e293b] border border-white/20 rounded-xl shadow-2xl max-h-64 overflow-y-auto">
                    {cie10Results.map((r) => (
                      <button key={r.code} onClick={() => addDiagnostico(r)}
                        className="w-full text-left px-4 py-2.5 hover:bg-white/10 transition flex items-center gap-3 border-b border-white/5 last:border-0">
                        <span className="text-[#c5a044] font-mono text-xs font-bold min-w-[50px]">{r.code}</span>
                        <span className="text-sm text-gray-300">{r.description}</span>
                        <span className="text-[10px] text-gray-500 ml-auto">{r.category}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {diagnosticos.length === 0 && (
                <p className="text-xs text-red-400">⚠️ Debe agregar al menos un diagnóstico CIE-10</p>
              )}

              <div className="space-y-2">
                {diagnosticos.map((d, i) => (
                  <div key={d.cie10} className={`flex items-center gap-3 p-3 rounded-xl border ${d.tipo === "principal" ? "bg-[#c5a044]/10 border-[#c5a044]/30" : "bg-white/5 border-white/10"}`}>
                    <span className="text-[#c5a044] font-mono text-xs font-bold">{d.cie10}</span>
                    <span className="text-sm flex-1">{d.descripcion}</span>
                    <select value={d.tipo} onChange={(e) => {
                      const updated = [...diagnosticos];
                      updated[i] = { ...d, tipo: e.target.value as "principal" | "diferencial" };
                      setDiagnosticos(updated);
                    }} className="bg-transparent text-xs text-gray-400 border border-white/10 rounded-lg px-2 py-1">
                      <option value="principal">Principal</option>
                      <option value="diferencial">Diferencial</option>
                    </select>
                    <button onClick={() => setDiagnosticos(diagnosticos.filter((_, j) => j !== i))} className="text-red-400 text-sm">✕</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 5: Plan */}
          {step === 5 && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold">Plan de Manejo</h2>
              <Textarea label="Tratamiento farmacológico" value={planFarma} onChange={setPlanFarma} rows={3} placeholder="Medicamentos, dosis, frecuencia, duración..." />
              <Textarea label="Tratamiento no farmacológico" value={planNoFarma} onChange={setPlanNoFarma} rows={2} placeholder="Dieta, ejercicio, reposo..." />
              <Textarea label="Educación al paciente" value={educacion} onChange={setEducacion} rows={2} placeholder="Recomendaciones, hábitos..." />
              <Textarea label="Signos de alarma" value={signosAlarma} onChange={setSignosAlarma} rows={2} placeholder="Motivos para consultar urgencias..." />
            </div>
          )}

          {/* STEP 6: Seguimiento */}
          {step === 6 && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold">Seguimiento</h2>
              <NumInput label="Control en (días)" value={controlDias} onChange={setControlDias} />
              <Textarea label="Remisión (si aplica)" value={remision} onChange={setRemision} rows={2} placeholder="Especialidad, nivel de atención..." />
            </div>
          )}

          {/* STEP 7: Firmar */}
          {step === 7 && (
            <div className="text-center space-y-4">
              {saved ? (
                <div className="py-8">
                  <p className="text-5xl mb-4">✅</p>
                  <h2 className="text-2xl font-bold text-green-400">Historia Clínica Guardada</h2>
                  <p className="text-gray-400 mt-2 text-sm">Registro almacenado con trazabilidad completa.</p>
                  <p className="text-xs text-gray-500 mt-2">Profesional: {user?.nombre} {user?.apellido} · {new Date().toLocaleString("es-CO")}</p>
                </div>
              ) : (
                <>
                  <h2 className="text-lg font-bold">Resumen y Firma</h2>
                  <div className="bg-white/5 rounded-xl p-4 text-left text-sm space-y-1">
                    <p><strong>Motivo:</strong> {motivo || "—"}</p>
                    <p><strong>Diagnósticos:</strong> {diagnosticos.map((d) => `${d.cie10} (${d.tipo})`).join(", ") || "⚠️ Sin diagnóstico"}</p>
                    <p><strong>Sistemas afectados:</strong> {Object.entries(sistemas).filter(([, v]) => v.presente).map(([k]) => k).join(", ") || "Ninguno"}</p>
                    <p><strong>Profesional:</strong> {user?.nombre} {user?.apellido}</p>
                  </div>
                  {diagnosticos.length === 0 && <p className="text-red-400 text-sm">⚠️ No puede firmar sin diagnóstico CIE-10</p>}
                  {!motivo && <p className="text-red-400 text-sm">⚠️ Motivo de consulta es obligatorio</p>}
                  <button onClick={handleSave} disabled={!motivo || diagnosticos.length === 0 || saving}
                    className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${motivo && diagnosticos.length > 0 && !saving ? "bg-[#c5a044] text-[#0f172a] active:scale-95" : "bg-gray-700 text-gray-500 cursor-not-allowed"}`}>
                    {saving ? "Guardando..." : "✍️ Firmar y Guardar HCE"}
                  </button>
                </>
              )}
            </div>
          )}
        </div>

        {/* Nav */}
        {!saved && (
          <div className="flex gap-3">
            {step > 0 && <button onClick={() => setStep(step - 1)} className="flex-1 py-3 rounded-xl border border-white/10 text-gray-300 font-semibold text-sm">← Anterior</button>}
            {step < STEPS.length - 1 && <button onClick={() => setStep(step + 1)} className="flex-1 py-3 rounded-xl bg-[#c5a044] text-[#0f172a] font-semibold text-sm active:scale-95 transition">Siguiente →</button>}
          </div>
        )}
      </div>
    </div>
  );
}
