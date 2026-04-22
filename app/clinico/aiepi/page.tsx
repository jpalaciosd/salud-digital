"use client";
import { useState, useMemo } from "react";
import { useAuth } from "@/lib/AuthContext";
import UserNav from "@/lib/UserNav";
import {
  generarClasificaciones,
  generarPlanSugerido,
  nivelMasGrave,
  getFRAlta,
  fechaControlSugerida,
} from "@/lib/aiepi-engine";
import type {
  SignosPeligro,
  SintomaRespiratorio,
  SintomaDiarrea,
  SintomaFiebre,
  SintomaOido,
  Nutricion,
  Vacunacion,
  ConsejeriaAiepi,
  ClasificacionAiepi,
  PlanAiepi,
} from "@/lib/types-clinical";

const STEPS = [
  "Datos del niño",
  "⚠️ Signos de peligro",
  "Síntomas",
  "Nutrición",
  "Vacunación",
  "🚦 Clasificación",
  "Plan de manejo",
  "Consejería",
  "Seguimiento",
  "✅ Firmar",
];

const NIVEL_COLORS = { rojo: "#ef4444", amarillo: "#eab308", verde: "#22c55e" };
const NIVEL_BG = { rojo: "bg-red-500/10 border-red-500/30", amarillo: "bg-yellow-500/10 border-yellow-500/30", verde: "bg-green-500/10 border-green-500/30" };
const NIVEL_EMOJI = { rojo: "🔴", amarillo: "🟡", verde: "🟢" };

export default function AiepiWizard() {
  const { user, loading } = useAuth();
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Step 1: Datos del niño
  const [nombreNino, setNombreNino] = useState("");
  const [edadMeses, setEdadMeses] = useState<number>(0);
  const [peso, setPeso] = useState<number>(0);
  const [talla, setTalla] = useState<number>(0);
  const [cuidadorNombre, setCuidadorNombre] = useState("");
  const [cuidadorParentesco, setCuidadorParentesco] = useState("");

  // Step 2: Signos de peligro
  const [signos, setSignos] = useState<SignosPeligro>({
    no_bebe_lacta: false,
    vomita_todo: false,
    convulsiones: false,
    letargico_inconsciente: false,
  });

  // Step 3: Síntomas
  const [respiratorio, setRespiratorio] = useState<SintomaRespiratorio>({
    presente: false, duracion_dias: 0, frecuencia_respiratoria: 0, tiraje_subcostal: false, estridor_reposo: false,
  });
  const [diarrea, setDiarrea] = useState<SintomaDiarrea>({
    presente: false, duracion_dias: 0, sangre_heces: false, ojos_hundidos: false, pliegue_lento: false, sed_aumentada: false, irritable: false,
  });
  const [fiebre, setFiebre] = useState<SintomaFiebre>({
    presente: false, duracion_dias: 0, temperatura: 0, zona_endemica: false, rigidez_nuca: false,
  });
  const [oido, setOido] = useState<SintomaOido>({ dolor: false, supuracion: false, duracion_dias: 0 });

  // Step 4: Nutrición
  const [nutricion, setNutricion] = useState<Nutricion>({
    peso_edad_zscore: undefined, edema_bilateral: false, palidez_palmar: false, palidez_grave: false,
  });

  // Step 5: Vacunación
  const [vacunacion, setVacunacion] = useState<Vacunacion>({
    esquema_completo: true, vacunas_faltantes: [],
  });
  const [vacunaInput, setVacunaInput] = useState("");

  // Step 8: Consejería
  const [consejeria, setConsejeria] = useState<ConsejeriaAiepi>({
    signos_alarma_explicados: false, alimentacion: false, hidratacion: false, lactancia: false, cuando_volver: false,
  });

  // Step 9: Seguimiento
  const [fechaControl, setFechaControl] = useState("");
  const [motivoReconsulta, setMotivoReconsulta] = useState("");

  // Computed: clasificaciones
  const tieneSignoPeligro = signos.no_bebe_lacta || signos.vomita_todo || signos.convulsiones || signos.letargico_inconsciente;

  const clasificaciones = useMemo(() => generarClasificaciones(
    edadMeses, signos,
    respiratorio.presente ? respiratorio : undefined,
    diarrea.presente ? diarrea : undefined,
    fiebre.presente ? fiebre : undefined,
    (oido.dolor || oido.supuracion) ? oido : undefined,
    nutricion,
  ), [edadMeses, signos, respiratorio, diarrea, fiebre, oido, nutricion]);

  const nivelGeneral = useMemo(() => nivelMasGrave(clasificaciones), [clasificaciones]);
  const planSugerido = useMemo(() => generarPlanSugerido(clasificaciones, diarrea.presente ? diarrea : undefined), [clasificaciones, diarrea]);

  const consejeriaCompleta = consejeria.signos_alarma_explicados && consejeria.alimentacion && consejeria.hidratacion && consejeria.cuando_volver;

  // Save
  const handleSave = async () => {
    setSaving(true);
    try {
      const body = {
        nombre_nino: nombreNino,
        edad_meses: edadMeses,
        peso, talla,
        cuidador_nombre: cuidadorNombre,
        cuidador_parentesco: cuidadorParentesco,
        signos_peligro: signos,
        tiene_signo_peligro: tieneSignoPeligro,
        sintomas_respiratorio: respiratorio.presente ? respiratorio : null,
        sintomas_diarrea: diarrea.presente ? diarrea : null,
        sintomas_fiebre: fiebre.presente ? fiebre : null,
        sintomas_oido: (oido.dolor || oido.supuracion) ? oido : null,
        nutricion, vacunacion, clasificaciones,
        plan_tratamiento: planSugerido,
        consejeria,
        consejeria_completa: consejeriaCompleta,
        fecha_control: fechaControl || undefined,
        motivo_reconsulta: motivoReconsulta || undefined,
      };
      const res = await fetch("/api/clinico/aiepi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (res.ok) setSaved(true);
    } catch (e) {
      console.error(e);
    }
    setSaving(false);
  };

  if (loading) return <div className="min-h-screen bg-[#0f172a] flex items-center justify-center"><div className="animate-spin h-10 w-10 border-4 border-[#c5a044] border-t-transparent rounded-full" /></div>;

  // ── Helpers UI ──
  const CheckField = ({ label, checked, onChange, danger }: { label: string; checked: boolean; onChange: (v: boolean) => void; danger?: boolean }) => (
    <label className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${checked ? (danger ? "bg-red-500/10 border-red-500/50" : "bg-[#c5a044]/10 border-[#c5a044]/50") : "bg-white/5 border-white/10 hover:border-white/20"}`}>
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="w-5 h-5 rounded accent-[#c5a044]" />
      <span className={`text-sm ${checked && danger ? "text-red-400 font-semibold" : "text-gray-300"}`}>{label}</span>
    </label>
  );

  const NumField = ({ label, value, onChange, unit, min, max }: { label: string; value: number; onChange: (v: number) => void; unit?: string; min?: number; max?: number }) => (
    <div>
      <label className="text-xs text-gray-400 mb-1 block">{label}</label>
      <div className="flex items-center gap-2">
        <input type="number" value={value || ""} onChange={(e) => onChange(Number(e.target.value))} min={min} max={max}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:border-[#c5a044]/50 outline-none" />
        {unit && <span className="text-xs text-gray-500">{unit}</span>}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0f172a] text-white">
      <UserNav />
      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-[#c5a044]/20 flex items-center justify-center text-2xl">🧒</div>
          <div>
            <h1 className="text-xl font-bold">Evaluación AIEPI</h1>
            <p className="text-xs text-gray-400">Atención Integrada a Enfermedades Prevalentes de la Infancia</p>
          </div>
        </div>

        {/* Progress */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-400">Paso {step + 1} de {STEPS.length}</span>
            <span className="text-xs text-[#c5a044] font-semibold">{STEPS[step]}</span>
          </div>
          <div className="w-full bg-white/5 rounded-full h-2">
            <div className="h-2 rounded-full bg-gradient-to-r from-[#c5a044] to-[#d4af37] transition-all duration-500" style={{ width: `${((step + 1) / STEPS.length) * 100}%` }} />
          </div>
        </div>

        {/* Steps */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-6">

          {/* STEP 0: Datos del niño */}
          {step === 0 && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold mb-2">Identificación del paciente</h2>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Nombre del niño</label>
                <input type="text" value={nombreNino} onChange={(e) => setNombreNino(e.target.value)} placeholder="Nombre completo"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:border-[#c5a044]/50 outline-none" />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <NumField label="Edad (meses)" value={edadMeses} onChange={setEdadMeses} unit="m" min={0} max={60} />
                <NumField label="Peso" value={peso} onChange={setPeso} unit="kg" min={0} max={30} />
                <NumField label="Talla" value={talla} onChange={setTalla} unit="cm" min={0} max={120} />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Cuidador / responsable</label>
                <input type="text" value={cuidadorNombre} onChange={(e) => setCuidadorNombre(e.target.value)} placeholder="Nombre del cuidador"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:border-[#c5a044]/50 outline-none" />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Parentesco</label>
                <select value={cuidadorParentesco} onChange={(e) => setCuidadorParentesco(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:border-[#c5a044]/50 outline-none">
                  <option value="">Seleccionar...</option>
                  <option value="madre">Madre</option>
                  <option value="padre">Padre</option>
                  <option value="abuelo/a">Abuelo/a</option>
                  <option value="tio/a">Tío/a</option>
                  <option value="otro">Otro</option>
                </select>
              </div>
            </div>
          )}

          {/* STEP 1: Signos de peligro */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-2">
                <h2 className="text-lg font-bold text-red-400 flex items-center gap-2">⚠️ Signos Generales de Peligro</h2>
                <p className="text-xs text-red-300/70 mt-1">Si alguno está presente → Enfermedad muy grave → Remisión inmediata</p>
              </div>
              <CheckField label="¿No puede beber ni lactar?" checked={signos.no_bebe_lacta} onChange={(v) => setSignos({ ...signos, no_bebe_lacta: v })} danger />
              <CheckField label="¿Vomita todo lo que ingiere?" checked={signos.vomita_todo} onChange={(v) => setSignos({ ...signos, vomita_todo: v })} danger />
              <CheckField label="¿Ha tenido convulsiones?" checked={signos.convulsiones} onChange={(v) => setSignos({ ...signos, convulsiones: v })} danger />
              <CheckField label="¿Está letárgico o inconsciente?" checked={signos.letargico_inconsciente} onChange={(v) => setSignos({ ...signos, letargico_inconsciente: v })} danger />

              {tieneSignoPeligro && (
                <div className="bg-red-600/20 border-2 border-red-500 rounded-xl p-4 animate-pulse">
                  <p className="text-red-400 font-bold text-lg">🚨 ENFERMEDAD MUY GRAVE</p>
                  <p className="text-red-300 text-sm mt-1">REMISIÓN INMEDIATA al hospital. Administrar primera dosis de antibiótico. No continuar evaluación ambulatoria.</p>
                </div>
              )}
            </div>
          )}

          {/* STEP 2: Síntomas */}
          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-lg font-bold">Síntomas Principales</h2>

              {/* Respiratorio */}
              <div className="border border-white/10 rounded-xl p-4 space-y-3">
                <CheckField label="🫁 ¿Tiene tos o dificultad para respirar?" checked={respiratorio.presente} onChange={(v) => setRespiratorio({ ...respiratorio, presente: v })} />
                {respiratorio.presente && (
                  <div className="pl-4 space-y-3 border-l-2 border-[#c5a044]/30">
                    <NumField label="Duración (días)" value={respiratorio.duracion_dias || 0} onChange={(v) => setRespiratorio({ ...respiratorio, duracion_dias: v })} />
                    <div>
                      <NumField label="Frecuencia respiratoria" value={respiratorio.frecuencia_respiratoria || 0} onChange={(v) => setRespiratorio({ ...respiratorio, frecuencia_respiratoria: v })} unit="rpm" />
                      <p className="text-[10px] text-gray-500 mt-1">⚡ Umbral para {edadMeses} meses: ≥{getFRAlta(edadMeses)} rpm</p>
                    </div>
                    <CheckField label="Tiraje subcostal" checked={respiratorio.tiraje_subcostal} onChange={(v) => setRespiratorio({ ...respiratorio, tiraje_subcostal: v })} danger />
                    <CheckField label="Estridor en reposo" checked={respiratorio.estridor_reposo} onChange={(v) => setRespiratorio({ ...respiratorio, estridor_reposo: v })} danger />
                  </div>
                )}
              </div>

              {/* Diarrea */}
              <div className="border border-white/10 rounded-xl p-4 space-y-3">
                <CheckField label="💧 ¿Tiene diarrea?" checked={diarrea.presente} onChange={(v) => setDiarrea({ ...diarrea, presente: v })} />
                {diarrea.presente && (
                  <div className="pl-4 space-y-3 border-l-2 border-[#c5a044]/30">
                    <NumField label="Duración (días)" value={diarrea.duracion_dias || 0} onChange={(v) => setDiarrea({ ...diarrea, duracion_dias: v })} />
                    <CheckField label="Sangre en heces" checked={diarrea.sangre_heces} onChange={(v) => setDiarrea({ ...diarrea, sangre_heces: v })} danger />
                    <p className="text-xs text-gray-400 font-semibold mt-2">Signos de deshidratación:</p>
                    <CheckField label="Ojos hundidos" checked={diarrea.ojos_hundidos} onChange={(v) => setDiarrea({ ...diarrea, ojos_hundidos: v })} />
                    <CheckField label="Pliegue cutáneo lento (≥2 seg)" checked={diarrea.pliegue_lento} onChange={(v) => setDiarrea({ ...diarrea, pliegue_lento: v })} />
                    <CheckField label="Sed aumentada / bebe ávidamente" checked={diarrea.sed_aumentada} onChange={(v) => setDiarrea({ ...diarrea, sed_aumentada: v })} />
                    <CheckField label="Inquieto / irritable" checked={diarrea.irritable} onChange={(v) => setDiarrea({ ...diarrea, irritable: v })} />
                  </div>
                )}
              </div>

              {/* Fiebre */}
              <div className="border border-white/10 rounded-xl p-4 space-y-3">
                <CheckField label="🌡️ ¿Tiene fiebre?" checked={fiebre.presente} onChange={(v) => setFiebre({ ...fiebre, presente: v })} />
                {fiebre.presente && (
                  <div className="pl-4 space-y-3 border-l-2 border-[#c5a044]/30">
                    <NumField label="Duración (días)" value={fiebre.duracion_dias || 0} onChange={(v) => setFiebre({ ...fiebre, duracion_dias: v })} />
                    <NumField label="Temperatura" value={fiebre.temperatura || 0} onChange={(v) => setFiebre({ ...fiebre, temperatura: v })} unit="°C" />
                    <CheckField label="Zona endémica (dengue/malaria)" checked={fiebre.zona_endemica} onChange={(v) => setFiebre({ ...fiebre, zona_endemica: v })} />
                    <CheckField label="Rigidez de nuca" checked={fiebre.rigidez_nuca} onChange={(v) => setFiebre({ ...fiebre, rigidez_nuca: v })} danger />
                  </div>
                )}
              </div>

              {/* Oído */}
              <div className="border border-white/10 rounded-xl p-4 space-y-3">
                <h3 className="text-sm font-semibold text-gray-300">👂 Problema de oído</h3>
                <CheckField label="Dolor de oído" checked={oido.dolor} onChange={(v) => setOido({ ...oido, dolor: v })} />
                <CheckField label="Supuración" checked={oido.supuracion} onChange={(v) => setOido({ ...oido, supuracion: v })} />
                {(oido.dolor || oido.supuracion) && (
                  <NumField label="Duración (días)" value={oido.duracion_dias || 0} onChange={(v) => setOido({ ...oido, duracion_dias: v })} />
                )}
              </div>
            </div>
          )}

          {/* STEP 3: Nutrición */}
          {step === 3 && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold">Estado Nutricional y Anemia</h2>
              <NumField label="Z-score peso/edad (si disponible)" value={nutricion.peso_edad_zscore || 0} onChange={(v) => setNutricion({ ...nutricion, peso_edad_zscore: v })} />
              <p className="text-[10px] text-gray-500">Normal: -2 a +2 | Desnutrición: &lt;-2 | Grave: &lt;-3</p>
              <CheckField label="Edema bilateral en ambos pies" checked={nutricion.edema_bilateral} onChange={(v) => setNutricion({ ...nutricion, edema_bilateral: v })} danger />
              <CheckField label="Palidez palmar" checked={nutricion.palidez_palmar} onChange={(v) => setNutricion({ ...nutricion, palidez_palmar: v })} />
              {nutricion.palidez_palmar && (
                <CheckField label="Palidez palmar GRAVE (muy pálido)" checked={nutricion.palidez_grave} onChange={(v) => setNutricion({ ...nutricion, palidez_grave: v })} danger />
              )}
            </div>
          )}

          {/* STEP 4: Vacunación */}
          {step === 4 && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold">Estado de Vacunación</h2>
              <CheckField label="Esquema de vacunación completo para la edad" checked={vacunacion.esquema_completo} onChange={(v) => setVacunacion({ ...vacunacion, esquema_completo: v })} />
              {!vacunacion.esquema_completo && (
                <div className="space-y-3">
                  <p className="text-xs text-gray-400">Vacunas faltantes:</p>
                  <div className="flex gap-2">
                    <input type="text" value={vacunaInput} onChange={(e) => setVacunaInput(e.target.value)} placeholder="Ej: Pentavalente 3ra dosis"
                      className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm" />
                    <button onClick={() => { if (vacunaInput.trim()) { setVacunacion({ ...vacunacion, vacunas_faltantes: [...vacunacion.vacunas_faltantes, vacunaInput.trim()] }); setVacunaInput(""); } }}
                      className="px-4 py-2 bg-[#c5a044] text-[#0f172a] rounded-xl text-sm font-bold">+</button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {vacunacion.vacunas_faltantes.map((v, i) => (
                      <span key={i} className="px-3 py-1 bg-yellow-500/10 border border-yellow-500/30 rounded-full text-xs text-yellow-300 flex items-center gap-1">
                        {v}
                        <button onClick={() => setVacunacion({ ...vacunacion, vacunas_faltantes: vacunacion.vacunas_faltantes.filter((_, j) => j !== i) })} className="text-yellow-400 hover:text-red-400">×</button>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 5: Clasificación */}
          {step === 5 && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold">🚦 Clasificación AIEPI</h2>
              <p className="text-xs text-gray-400">Generada automáticamente según la evaluación clínica</p>

              {clasificaciones.length === 0 ? (
                <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 text-center">
                  <p className="text-green-400 text-lg">🟢 Sin hallazgos patológicos</p>
                  <p className="text-gray-400 text-sm">Niño sano. Consejería de rutina.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {/* Resumen general */}
                  <div className={`rounded-xl p-4 border-2 ${NIVEL_BG[nivelGeneral]}`}>
                    <p className="font-bold text-lg" style={{ color: NIVEL_COLORS[nivelGeneral] }}>
                      {NIVEL_EMOJI[nivelGeneral]} Clasificación general: {nivelGeneral.toUpperCase()}
                    </p>
                    {nivelGeneral === "rojo" && <p className="text-red-300 text-sm mt-1">⚡ Requiere remisión o atención urgente</p>}
                    {nivelGeneral === "amarillo" && <p className="text-yellow-300 text-sm mt-1">📋 Requiere tratamiento y control en {fechaControlSugerida(nivelGeneral)} días</p>}
                    {nivelGeneral === "verde" && <p className="text-green-300 text-sm mt-1">🏠 Manejo en casa con seguimiento</p>}
                  </div>

                  {/* Detalle por clasificación */}
                  {clasificaciones.map((c, i) => (
                    <div key={i} className={`rounded-xl p-4 border ${NIVEL_BG[c.nivel]}`}>
                      <div className="flex items-center gap-2 mb-1">
                        <span>{NIVEL_EMOJI[c.nivel]}</span>
                        <span className="font-bold text-sm" style={{ color: NIVEL_COLORS[c.nivel] }}>{c.tipo}</span>
                      </div>
                      <p className="text-xs text-gray-300 mb-2">{c.descripcion}</p>
                      <div className="bg-black/20 rounded-lg p-2">
                        <p className="text-xs text-gray-400"><strong>Acción:</strong> {c.accion}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* STEP 6: Plan de manejo */}
          {step === 6 && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold">Plan de Manejo</h2>
              <p className="text-xs text-gray-400">Sugerido automáticamente. Ajuste según criterio clínico.</p>

              {planSugerido.medicamentos.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold text-[#c5a044]">💊 Medicamentos</h3>
                  {planSugerido.medicamentos.map((m, i) => (
                    <div key={i} className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-gray-300">{m}</div>
                  ))}
                </div>
              )}

              {planSugerido.hidratacion_plan && (
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
                  <h3 className="text-sm font-semibold text-blue-400">💧 Hidratación: Plan {planSugerido.hidratacion_plan}</h3>
                  <p className="text-xs text-gray-400 mt-1">
                    {planSugerido.hidratacion_plan === "A" && "SRO en casa después de cada deposición. Continuar alimentación."}
                    {planSugerido.hidratacion_plan === "B" && "SRO en consultorio durante 4 horas. Reevaluar después."}
                    {planSugerido.hidratacion_plan === "C" && "URGENTE: Rehidratación IV. Lactato Ringer o SSN."}
                  </p>
                </div>
              )}

              {planSugerido.manejo_fiebre && (
                <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-4">
                  <h3 className="text-sm font-semibold text-orange-400">🌡️ Manejo de fiebre</h3>
                  <p className="text-xs text-gray-300 mt-1">{planSugerido.manejo_fiebre}</p>
                </div>
              )}

              {planSugerido.zinc && (
                <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4">
                  <h3 className="text-sm font-semibold text-purple-400">🔬 Zinc</h3>
                  <p className="text-xs text-gray-300 mt-1">Zinc por 14 días: &lt;6 meses = 10mg/día, ≥6 meses = 20mg/día</p>
                </div>
              )}

              {planSugerido.medicamentos.length === 0 && !planSugerido.hidratacion_plan && !planSugerido.manejo_fiebre && (
                <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 text-center">
                  <p className="text-green-400">Sin tratamiento farmacológico requerido</p>
                  <p className="text-xs text-gray-400 mt-1">Manejo sintomático y consejería</p>
                </div>
              )}
            </div>
          )}

          {/* STEP 7: Consejería */}
          {step === 7 && (
            <div className="space-y-4">
              <div className="bg-[#c5a044]/10 border border-[#c5a044]/30 rounded-xl p-4">
                <h2 className="text-lg font-bold text-[#c5a044]">📋 Consejería al Cuidador</h2>
                <p className="text-xs text-gray-400 mt-1">OBLIGATORIO — Marque cada punto que haya explicado al cuidador</p>
              </div>
              <CheckField label="✅ Explicados los signos de alarma (no come, empeora, fiebre persistente, dificultad respiratoria)" checked={consejeria.signos_alarma_explicados} onChange={(v) => setConsejeria({ ...consejeria, signos_alarma_explicados: v })} />
              <CheckField label="✅ Consejería sobre alimentación adecuada para la edad" checked={consejeria.alimentacion} onChange={(v) => setConsejeria({ ...consejeria, alimentacion: v })} />
              <CheckField label="✅ Consejería sobre hidratación" checked={consejeria.hidratacion} onChange={(v) => setConsejeria({ ...consejeria, hidratacion: v })} />
              <CheckField label="✅ Consejería sobre lactancia materna (si aplica)" checked={consejeria.lactancia} onChange={(v) => setConsejeria({ ...consejeria, lactancia: v })} />
              <CheckField label="✅ Explicado cuándo volver de inmediato" checked={consejeria.cuando_volver} onChange={(v) => setConsejeria({ ...consejeria, cuando_volver: v })} />

              {!consejeriaCompleta && (
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-3">
                  <p className="text-yellow-400 text-xs font-semibold">⚠️ Debe completar al menos: signos de alarma, alimentación, hidratación y cuándo volver para poder finalizar.</p>
                </div>
              )}
            </div>
          )}

          {/* STEP 8: Seguimiento */}
          {step === 8 && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold">Seguimiento</h2>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Fecha de control</label>
                <input type="date" value={fechaControl} onChange={(e) => setFechaControl(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm" />
                <p className="text-[10px] text-gray-500 mt-1">Sugerido: {fechaControlSugerida(nivelGeneral)} días después de hoy</p>
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Motivo de reconsulta</label>
                <textarea value={motivoReconsulta} onChange={(e) => setMotivoReconsulta(e.target.value)} rows={3} placeholder="Indicaciones para reconsulta..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm resize-none" />
              </div>
            </div>
          )}

          {/* STEP 9: Firmar */}
          {step === 9 && (
            <div className="space-y-4 text-center">
              {saved ? (
                <div className="py-8">
                  <p className="text-5xl mb-4">✅</p>
                  <h2 className="text-2xl font-bold text-green-400">Evaluación Guardada</h2>
                  <p className="text-gray-400 mt-2">Registro AIEPI almacenado con trazabilidad completa.</p>
                  <div className="mt-4 text-xs text-gray-500">
                    <p>Profesional: {user?.nombre} {user?.apellido}</p>
                    <p>Fecha: {new Date().toLocaleString("es-CO")}</p>
                  </div>
                </div>
              ) : (
                <>
                  <h2 className="text-lg font-bold">Firmar y Guardar</h2>
                  <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-left text-sm space-y-2">
                    <p><strong>Paciente:</strong> {nombreNino} ({edadMeses} meses)</p>
                    <p><strong>Clasificación:</strong> {NIVEL_EMOJI[nivelGeneral]} {nivelGeneral.toUpperCase()} ({clasificaciones.length} hallazgos)</p>
                    <p><strong>Profesional:</strong> {user?.nombre} {user?.apellido}</p>
                    <p><strong>Consejería:</strong> {consejeriaCompleta ? "✅ Completa" : "⚠️ Incompleta"}</p>
                  </div>

                  {!consejeriaCompleta && (
                    <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3">
                      <p className="text-red-400 text-sm font-semibold">No puede firmar sin completar la consejería obligatoria</p>
                    </div>
                  )}

                  <button
                    onClick={handleSave}
                    disabled={!consejeriaCompleta || saving}
                    className={`w-full py-4 rounded-2xl font-bold text-lg transition-all ${
                      consejeriaCompleta && !saving
                        ? "bg-[#c5a044] text-[#0f172a] hover:bg-[#d4af37] active:scale-95"
                        : "bg-gray-700 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    {saving ? "Guardando..." : "✍️ Firmar y Guardar Evaluación"}
                  </button>
                </>
              )}
            </div>
          )}
        </div>

        {/* Navigation */}
        {!saved && (
          <div className="flex gap-3">
            {step > 0 && (
              <button onClick={() => setStep(step - 1)}
                className="flex-1 py-3 rounded-xl border border-white/10 text-gray-300 font-semibold text-sm hover:bg-white/5 transition">
                ← Anterior
              </button>
            )}
            {step < STEPS.length - 1 && (
              <button onClick={() => setStep(step + 1)}
                className="flex-1 py-3 rounded-xl bg-[#c5a044] text-[#0f172a] font-semibold text-sm hover:bg-[#d4af37] transition active:scale-95">
                Siguiente →
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
