"use client";
import { useState } from "react";
import { useAuth } from "@/lib/AuthContext";
import UserNav from "@/lib/UserNav";
import Link from "next/link";

export default function OnboardingPage() {
  const { user, loading } = useAuth();
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);

  // Org data
  const [orgNombre, setOrgNombre] = useState("");
  const [orgNit, setOrgNit] = useState("");
  const [orgTipo, setOrgTipo] = useState("ips");

  // Profile data (medical)
  const [rethus, setRethus] = useState("");
  const [especialidad, setEspecialidad] = useState("");
  const [institucion, setInstitucion] = useState("");

  // Profile data (patient)
  const [docTipo, setDocTipo] = useState("CC");
  const [docNumero, setDocNumero] = useState("");
  const [fechaNac, setFechaNac] = useState("");
  const [sexo, setSexo] = useState("");
  const [eps, setEps] = useState("");
  const [direccion, setDireccion] = useState("");
  const [telefono, setTelefono] = useState("");

  const isMedical = user && ["medico", "profesional"].includes((user as Record<string,string>).rol);

  const handleSave = async () => {
    setSaving(true);
    try {
      // 1. Create org if provided
      if (orgNombre) {
        await fetch("/api/clinico/organizaciones", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nombre: orgNombre, nit: orgNit, tipo: orgTipo }),
        });
      }

      // 2. Save clinical profile
      if (isMedical) {
        await fetch("/api/clinico/perfiles", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            tipo: "medico",
            rethus, especialidad, institucion,
          }),
        });
      }

      // Patient profile (everyone has one)
      await fetch("/api/clinico/perfiles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tipo: "paciente",
          documento_tipo: docTipo,
          documento_numero: docNumero,
          fecha_nacimiento: fechaNac,
          sexo, eps, direccion, telefono,
        }),
      });

      // 3. Accept consent
      await fetch("/api/clinico/consentimiento", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tipo: "telemedicina", aceptado: true }),
      });

      setDone(true);
    } catch (e) {
      console.error(e);
    }
    setSaving(false);
  };

  if (loading) return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
      <div className="animate-spin h-10 w-10 border-4 border-[#c5a044] border-t-transparent rounded-full" />
    </div>
  );

  const Input = ({ label, value, onChange, type = "text", placeholder = "" }: { label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string }) => (
    <div>
      <label className="text-xs text-gray-400 mb-1 block">{label}</label>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
        className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:border-[#c5a044]/50 outline-none" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0f172a] text-white">
      <UserNav />
      <div className="max-w-lg mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-[#c5a044]/20 flex items-center justify-center text-3xl mx-auto mb-4">🏥</div>
          <h1 className="text-2xl font-bold">Configuración del Ecosistema Clínico</h1>
          <p className="text-gray-400 text-sm mt-2">Complete su perfil para acceder a los módulos de telemedicina</p>
        </div>

        {done ? (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center">
            <p className="text-5xl mb-4">✅</p>
            <h2 className="text-xl font-bold text-green-400">¡Configuración Completa!</h2>
            <p className="text-gray-400 text-sm mt-2">Su perfil clínico está listo. Ya puede acceder a los módulos de telemedicina.</p>
            <div className="mt-6 flex flex-col gap-3">
              {isMedical && (
                <Link href="/clinico/aiepi" className="block py-3 bg-[#c5a044] text-[#0f172a] rounded-xl font-bold text-center">
                  🧒 Evaluación AIEPI
                </Link>
              )}
              <Link href="/dashboard" className="block py-3 border border-white/10 rounded-xl text-gray-300 text-center">
                Ir al Dashboard
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* Progress */}
            <div className="flex gap-2 mb-6">
              {["Organización", "Datos personales", isMedical ? "Datos médicos" : null, "Confirmar"].filter(Boolean).map((s, i) => (
                <div key={i} className={`flex-1 h-1.5 rounded-full transition-all ${i <= step ? "bg-[#c5a044]" : "bg-white/10"}`} />
              ))}
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">

              {/* Step 0: Organización */}
              {step === 0 && (
                <>
                  <h2 className="text-lg font-bold">🏢 Organización / IPS</h2>
                  <p className="text-xs text-gray-400">Si pertenece a una IPS o consultorio, registre los datos. Si es paciente independiente, puede saltar este paso.</p>
                  <Input label="Nombre de la organización" value={orgNombre} onChange={setOrgNombre} placeholder="Ej: Clínica San Rafael" />
                  <Input label="NIT" value={orgNit} onChange={setOrgNit} placeholder="Ej: 900123456-1" />
                  <div>
                    <label className="text-xs text-gray-400 mb-1 block">Tipo</label>
                    <select value={orgTipo} onChange={(e) => setOrgTipo(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm">
                      <option value="ips">IPS</option>
                      <option value="eps">EPS</option>
                      <option value="consultorio">Consultorio</option>
                      <option value="universidad">Universidad</option>
                    </select>
                  </div>
                </>
              )}

              {/* Step 1: Datos personales */}
              {step === 1 && (
                <>
                  <h2 className="text-lg font-bold">📋 Datos Personales</h2>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-gray-400 mb-1 block">Tipo documento</label>
                      <select value={docTipo} onChange={(e) => setDocTipo(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm">
                        <option value="CC">Cédula (CC)</option>
                        <option value="TI">Tarjeta de Identidad (TI)</option>
                        <option value="CE">Cédula Extranjería (CE)</option>
                        <option value="PA">Pasaporte (PA)</option>
                        <option value="RC">Registro Civil (RC)</option>
                      </select>
                    </div>
                    <Input label="Número de documento" value={docNumero} onChange={setDocNumero} />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <Input label="Fecha de nacimiento" value={fechaNac} onChange={setFechaNac} type="date" />
                    <div>
                      <label className="text-xs text-gray-400 mb-1 block">Sexo</label>
                      <select value={sexo} onChange={(e) => setSexo(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm">
                        <option value="">Seleccionar</option>
                        <option value="M">Masculino</option>
                        <option value="F">Femenino</option>
                        <option value="O">Otro</option>
                      </select>
                    </div>
                  </div>
                  <Input label="EPS" value={eps} onChange={setEps} placeholder="Ej: Nueva EPS, Sura, Coomeva" />
                  <Input label="Dirección" value={direccion} onChange={setDireccion} placeholder="Dirección de residencia" />
                  <Input label="Teléfono" value={telefono} onChange={setTelefono} placeholder="3001234567" />
                </>
              )}

              {/* Step 2: Datos médicos (solo profesionales) */}
              {step === 2 && isMedical && (
                <>
                  <h2 className="text-lg font-bold">⚕️ Datos Profesionales</h2>
                  <Input label="Registro Médico (Rethus)" value={rethus} onChange={setRethus} placeholder="Número de registro" />
                  <Input label="Especialidad" value={especialidad} onChange={setEspecialidad} placeholder="Ej: Medicina General, Pediatría" />
                  <Input label="Institución" value={institucion} onChange={setInstitucion} placeholder="Institución donde ejerce" />
                </>
              )}

              {/* Step final: Confirmar */}
              {step === (isMedical ? 3 : 2) && (
                <>
                  <h2 className="text-lg font-bold">✅ Confirmar y Aceptar</h2>
                  <div className="bg-white/5 rounded-xl p-4 text-xs text-gray-400 max-h-48 overflow-y-auto leading-relaxed">
                    <p className="font-bold text-white mb-2">CONSENTIMIENTO INFORMADO PARA TELEMEDICINA</p>
                    <p>Acepto recibir atención en salud a través de medios tecnológicos, entendiendo las limitaciones del examen físico virtual.</p>
                    <p className="mt-2">Autorizo el tratamiento de mis datos personales y de salud conforme a la Ley 1581 de 2012 y la Resolución 2654 de 2019.</p>
                    <p className="mt-2">Comprendo que puedo ser remitido a atención presencial cuando sea necesario.</p>
                  </div>
                  <label className="flex items-center gap-3 p-3 rounded-xl border border-[#c5a044]/30 bg-[#c5a044]/5 cursor-pointer">
                    <input type="checkbox" defaultChecked className="w-5 h-5 accent-[#c5a044]" />
                    <span className="text-sm text-gray-300">Acepto los términos del consentimiento informado</span>
                  </label>
                </>
              )}
            </div>

            {/* Nav buttons */}
            <div className="flex gap-3 mt-6">
              {step > 0 && (
                <button onClick={() => setStep(step - 1)} className="flex-1 py-3 rounded-xl border border-white/10 text-gray-300 font-semibold text-sm">
                  ← Anterior
                </button>
              )}
              {step < (isMedical ? 3 : 2) ? (
                <button onClick={() => setStep(step + 1)} className="flex-1 py-3 rounded-xl bg-[#c5a044] text-[#0f172a] font-semibold text-sm active:scale-95 transition">
                  Siguiente →
                </button>
              ) : (
                <button onClick={handleSave} disabled={saving}
                  className="flex-1 py-3 rounded-xl bg-green-600 text-white font-semibold text-sm active:scale-95 transition disabled:opacity-50">
                  {saving ? "Guardando..." : "✅ Completar Registro"}
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
