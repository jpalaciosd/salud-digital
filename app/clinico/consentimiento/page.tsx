"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/lib/AuthContext";
import UserNav from "@/lib/UserNav";
import { useRouter } from "next/navigation";

export default function ConsentimientoPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [checked, setChecked] = useState(false);
  const [saving, setSaving] = useState(false);
  const [already, setAlready] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (loading || !user) return;
    fetch("/api/clinico/consentimiento")
      .then((r) => r.json())
      .then((d) => {
        if (d.tiene_consentimiento) setAlready(true);
        setChecking(false);
      })
      .catch(() => setChecking(false));
  }, [user, loading]);

  const handleAccept = async () => {
    setSaving(true);
    const res = await fetch("/api/clinico/consentimiento", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tipo: "telemedicina", aceptado: true }),
    });
    if (res.ok) {
      setAlready(true);
    }
    setSaving(false);
  };

  if (loading || checking) return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
      <div className="animate-spin h-10 w-10 border-4 border-[#c5a044] border-t-transparent rounded-full" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0f172a] text-white">
      <UserNav />
      <div className="max-w-lg mx-auto px-4 py-8">
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-[#c5a044]/20 flex items-center justify-center text-2xl mx-auto mb-3">📋</div>
          <h1 className="text-xl font-bold">Consentimiento Informado</h1>
          <p className="text-xs text-gray-400 mt-1">Resolución 2654 de 2019 · Ley 1581 de 2012</p>
        </div>

        {already ? (
          <div className="bg-green-500/10 border border-green-500/30 rounded-2xl p-6 text-center">
            <p className="text-3xl mb-3">✅</p>
            <h2 className="text-lg font-bold text-green-400">Consentimiento Vigente</h2>
            <p className="text-gray-400 text-sm mt-2">Ya ha aceptado el consentimiento informado para telemedicina.</p>
            <button onClick={() => router.push("/dashboard")} className="mt-4 px-6 py-2 bg-[#c5a044] text-[#0f172a] rounded-xl font-bold text-sm">
              Ir al Dashboard
            </button>
          </div>
        ) : (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
            <div className="bg-white/5 rounded-xl p-4 text-sm text-gray-300 max-h-64 overflow-y-auto leading-relaxed space-y-3">
              <p className="font-bold text-white">CONSENTIMIENTO INFORMADO PARA ATENCIÓN EN TELEMEDICINA</p>
              <p>Yo, <strong>{user?.nombre} {user?.apellido}</strong>, identificado(a) como usuario de la plataforma ISSI, declaro que:</p>
              <p><strong>1.</strong> ACEPTO recibir atención en salud a través de medios tecnológicos (teleconsulta sincrónica o asincrónica), entendiendo que esta modalidad tiene limitaciones en el examen físico directo.</p>
              <p><strong>2.</strong> COMPRENDO que la teleconsulta NO reemplaza la atención presencial cuando esta sea clínicamente necesaria, y que el profesional de salud podrá remitirme a atención presencial en cualquier momento.</p>
              <p><strong>3.</strong> AUTORIZO el tratamiento de mis datos personales y datos sensibles de salud conforme a la Ley 1581 de 2012 (Protección de Datos Personales) y la Resolución 2654 de 2019 (Telesalud y Telemedicina).</p>
              <p><strong>4.</strong> COMPRENDO las limitaciones del examen físico en modalidad virtual y acepto que el profesional documentará dichas limitaciones en mi historia clínica electrónica.</p>
              <p><strong>5.</strong> He sido informado(a) sobre los signos de alarma por los cuales debo acudir a urgencias de manera presencial e inmediata.</p>
              <p><strong>6.</strong> Entiendo que este consentimiento queda registrado electrónicamente con fecha, hora, dirección IP e identificación del dispositivo, lo cual tiene validez legal según la normativa colombiana vigente.</p>
              <p className="text-xs text-gray-500 mt-4">Base normativa: Resolución 2654 de 2019 · Resolución 1995 de 1999 · Ley 1581 de 2012 · Decreto 2200 de 2005</p>
            </div>

            <label className="flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all" style={{ borderColor: checked ? "#c5a04480" : "#ffffff15", background: checked ? "#c5a04410" : "transparent" }}>
              <input type="checkbox" checked={checked} onChange={(e) => setChecked(e.target.checked)} className="w-5 h-5 accent-[#c5a044]" />
              <span className="text-sm">He leído, comprendido y acepto los términos del consentimiento informado</span>
            </label>

            <button onClick={handleAccept} disabled={!checked || saving}
              className={`w-full py-4 rounded-xl font-bold text-sm transition-all ${
                checked && !saving ? "bg-[#c5a044] text-[#0f172a] active:scale-95" : "bg-gray-700 text-gray-500 cursor-not-allowed"
              }`}>
              {saving ? "Registrando..." : "✅ Aceptar Consentimiento Informado"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
