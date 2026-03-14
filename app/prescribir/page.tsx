"use client";
import { useState } from "react";
import { useAuth } from "@/lib/AuthContext";
import Link from "next/link";

export default function Prescribir() {
  const { user, logout } = useAuth();
  const [sendPatient, setSendPatient] = useState(true);
  const [bridgePharmacy, setBridgePharmacy] = useState(false);
  const [showSafety, setShowSafety] = useState(false);

  return (
    <div className="min-h-screen flex flex-col" style={{ fontFamily: "'Manrope', sans-serif" }}>
      {/* Header */}
      <header className="bg-white border-b border-[#1d4ed8]/20 px-4 lg:px-6 py-3 sticky top-0 z-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/dashboard">
              <div className="w-8 h-8 bg-[#1d4ed8] rounded-lg flex items-center justify-center">
                <span className="material-icons-outlined text-white text-xl">medication</span>
              </div>
            </Link>
            <span className="font-bold text-base lg:text-lg tracking-tight">Prescribe<span className="text-[#1d4ed8]">Direct</span></span>
            <span className="hidden sm:inline-block px-2 py-0.5 bg-[#1d4ed8]/10 text-[#1d4ed8] text-[10px] font-bold uppercase rounded border border-[#1d4ed8]/20 ml-2">MIPRES</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:block text-right">
              <p className="text-xs font-semibold">{user?.nombre} {user?.apellido}</p>
              <p className="text-[10px] text-slate-500 capitalize">{user?.rol}</p>
            </div>
            <div className="w-9 h-9 rounded-full bg-[#1d4ed8]/20 flex items-center justify-center text-[#1d4ed8] font-bold text-xs">
              {(user?.nombre?.[0] || "D")}{(user?.apellido?.[0] || "r")}
            </div>
          </div>
        </div>
      </header>

      {/* Patient Summary Bar */}
      <section className="bg-white border-b border-slate-200 px-4 lg:px-6 py-3 sticky top-[52px] z-40">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl bg-slate-100 overflow-hidden shrink-0">
              <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAcYGQF2sUKozlGUKgpgwPtYqnaMnDnzkciPdokPIt7nUMiHkQIAFxQMZlhcjAPQbEOFWAXKly60UL7H1KYLzcRR2kHw7aFmQtQgCo68aAaVJ8M_WcjDQRYZ_JgbDjKqioQAyJnnTrtWSO-TLYzjsbT-Vt_u-UqMgGPJdqmYWRvFzv36v3HfsJaW54GeyYA-yh0S8iMsiBJrFuNRsX5-AqOCJB_b8pT__utQU9TBzsmGQ10R9SQVsZ20ukqr2nMMGNTj9LJW7sMOHLT" alt="Paciente" />
            </div>
            <div className="min-w-0">
              <h2 className="text-sm font-bold truncate">CARLA SOFIA MENDOZA</h2>
              <p className="text-[10px] text-slate-500">ID: 1.032.445.981 • F • 42 Años</p>
            </div>
            <div className="hidden md:flex items-center gap-6 ml-4 text-xs">
              <div><p className="text-slate-400">Peso</p><p className="font-bold">68.5 kg</p></div>
              <div><p className="text-slate-400">PA</p><p className="font-bold">128/84</p></div>
              <div><p className="text-slate-400">Dx</p><p className="font-bold">Diabetes T2</p></div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-1.5 flex items-center gap-2">
              <span className="material-icons-outlined text-red-600 text-sm">warning</span>
              <div>
                <p className="text-[9px] uppercase font-bold text-red-600 leading-none">Alergias</p>
                <p className="text-xs font-bold text-red-700">Penicilina, AINEs</p>
              </div>
            </div>
            <button onClick={() => setShowSafety(!showSafety)} className="xl:hidden p-2 bg-amber-50 border border-amber-200 rounded-lg text-amber-600">
              <span className="material-icons-outlined text-xl">security</span>
            </button>
          </div>
        </div>
      </section>

      {/* Main Workspace */}
      <main className="flex-1 flex flex-col xl:flex-row overflow-hidden relative">
        {/* Left Pane: Form */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-6 bg-[#f6f8f6]">
          <div className="max-w-4xl mx-auto space-y-4 lg:space-y-6">
            {/* Medication Entry Card */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="bg-slate-50 px-4 lg:px-6 py-3 border-b border-slate-200 flex justify-between items-center">
                <h3 className="text-sm font-bold flex items-center gap-2">
                  <span className="material-icons-outlined text-[#1d4ed8] text-lg">add_circle</span>
                  Prescripción
                </h3>
                <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Paso 1/2</span>
              </div>
              <div className="p-4 lg:p-6 space-y-4 lg:space-y-6">
                <div className="relative">
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Buscar Medicamento</label>
                  <div className="relative">
                    <span className="material-icons-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
                    <input className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-[#1d4ed8] focus:border-[#1d4ed8] text-sm" placeholder="Nombre del medicamento..." type="text" />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Dosis</label>
                    <div className="flex gap-2">
                      <input className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm" placeholder="500" type="text" />
                      <select className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm w-20">
                        <option>mg</option><option>mcg</option><option>ml</option><option>UI</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Frecuencia</label>
                    <select className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm">
                      <option>Cada 8h (TID)</option><option>Cada 12h (BID)</option><option>Diario (QD)</option><option>PRN</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Duración</label>
                    <div className="flex gap-2">
                      <input className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm" placeholder="30" type="number" />
                      <select className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm w-24">
                        <option>Días</option><option>Sem.</option><option>Meses</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Vía</label>
                    <select className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm">
                      <option>Oral</option><option>Subcutánea</option><option>IV</option><option>Tópica</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Cantidad Total</label>
                    <input className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm" placeholder="ej. 90 Tabletas" type="text" />
                  </div>
                </div>
              </div>
            </div>

            {/* Justification */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="bg-slate-50 px-4 lg:px-6 py-3 border-b border-slate-200">
                <h3 className="text-sm font-bold flex items-center gap-2">
                  <span className="material-icons-outlined text-[#1d4ed8] text-lg">description</span>
                  Justificación Clínica
                </h3>
              </div>
              <div className="p-4 lg:p-6">
                <textarea className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-[#1d4ed8]" placeholder="Describa la necesidad médica..." rows={3}></textarea>
                <div className="mt-2 flex items-center gap-2">
                  <span className="material-icons-outlined text-amber-500 text-sm">info</span>
                  <p className="text-[10px] text-slate-500 italic">Requerido para autorización EPS.</p>
                </div>
              </div>
            </div>

            {/* Basket */}
            <div className="space-y-3">
              <p className="text-xs font-bold text-slate-500 uppercase px-1">Canasta (2 ítems)</p>
              {[
                { icon: "medication", nombre: "Metformina 850mg", detalle: "1 tableta c/12h - 90 días" },
                { icon: "water_drop", nombre: "Insulina Glargina 100 U/ml", detalle: "15 U diarias al acostarse - 30 días" },
              ].map((med, i) => (
                <div key={i} className="bg-white rounded-xl border border-slate-200 p-3 lg:p-4 flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#1d4ed8]/10 rounded-lg flex items-center justify-center text-[#1d4ed8] shrink-0">
                    <span className="material-icons-outlined">{med.icon}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <h4 className="text-sm font-bold truncate">{med.nombre}</h4>
                      <span className="text-[10px] font-bold text-[#1d4ed8] shrink-0 ml-2">Activo</span>
                    </div>
                    <p className="text-xs text-slate-500 truncate">{med.detalle}</p>
                  </div>
                  <button className="p-1.5 text-slate-300 hover:text-red-500 transition shrink-0">
                    <span className="material-icons-outlined text-xl">delete_outline</span>
                  </button>
                </div>
              ))}
            </div>

            {/* Safety panel — shown inline on mobile */}
            {showSafety && (
              <div className="xl:hidden">
                <SafetyPanel />
              </div>
            )}
          </div>
        </div>

        {/* Right Pane: Safety — desktop only */}
        <aside className="w-96 border-l border-slate-200 bg-white overflow-y-auto hidden xl:block shrink-0">
          <div className="sticky top-0 bg-white z-10 px-6 py-4 border-b border-slate-200 flex items-center justify-between">
            <h3 className="text-sm font-bold flex items-center gap-2">
              <span className="material-icons-outlined text-amber-500 text-lg">security</span>
              Verificación de Seguridad
            </h3>
            <span className="w-2 h-2 rounded-full bg-[#1d4ed8] animate-pulse"></span>
          </div>
          <div className="p-6">
            <SafetyPanel />
          </div>
        </aside>
      </main>

      {/* Footer Actions */}
      <footer className="bg-white border-t border-slate-200 px-4 lg:px-6 py-3 lg:py-4 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-4 lg:gap-8">
            <label className="inline-flex items-center cursor-pointer">
              <input type="checkbox" checked={sendPatient} onChange={() => setSendPatient(!sendPatient)} className="sr-only peer" />
              <div className="w-9 h-5 bg-slate-200 rounded-full peer peer-checked:bg-[#1d4ed8] after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-full relative"></div>
              <span className="ml-2 text-[10px] lg:text-xs font-bold text-slate-600 uppercase">Enviar al Paciente</span>
            </label>
            <label className="inline-flex items-center cursor-pointer">
              <input type="checkbox" checked={bridgePharmacy} onChange={() => setBridgePharmacy(!bridgePharmacy)} className="sr-only peer" />
              <div className="w-9 h-5 bg-slate-200 rounded-full peer peer-checked:bg-[#1d4ed8] after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-full relative"></div>
              <span className="ml-2 text-[10px] lg:text-xs font-bold text-slate-600 uppercase">Red de Farmacias</span>
            </label>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button className="flex-1 sm:flex-none bg-slate-100 text-slate-600 px-4 lg:px-6 py-2.5 rounded-lg text-xs lg:text-sm font-bold hover:bg-slate-200 transition">
              Borrador
            </button>
            <button className="flex-1 sm:flex-none bg-[#1d4ed8] text-slate-900 px-4 lg:px-8 py-2.5 rounded-lg text-xs lg:text-sm font-bold hover:shadow-lg transition flex items-center justify-center gap-2">
              <span className="material-icons-outlined text-lg">verified_user</span>
              Emitir Fórmula
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

function SafetyPanel() {
  return (
    <div className="space-y-4 lg:space-y-6">
      <div>
        <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3">Interacciones</h4>
        <div className="bg-amber-50 border border-amber-200 p-3 lg:p-4 rounded-xl space-y-2">
          <div className="flex items-center gap-2 text-amber-700">
            <span className="material-icons-outlined text-sm">warning</span>
            <span className="text-xs font-bold">Interacción Moderada</span>
          </div>
          <p className="text-xs font-semibold">Metformina + Insulina</p>
          <p className="text-[11px] text-amber-800/70 leading-relaxed">Puede aumentar efectos hipoglucémicos. Monitorear glucosa.</p>
        </div>
      </div>
      <div>
        <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3">Alergias</h4>
        <div className="bg-[#1d4ed8]/5 border border-[#1d4ed8]/20 p-3 lg:p-4 rounded-xl flex items-center gap-3">
          <span className="material-icons-outlined text-[#1d4ed8] text-xl">check_circle</span>
          <p className="text-xs font-medium">Sin conflictos de alergia detectados.</p>
        </div>
      </div>
      <div>
        <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3">Terapia Duplicada</h4>
        <div className="p-3 lg:p-4 border border-dashed border-slate-200 rounded-xl text-center">
          <p className="text-[11px] text-slate-400 italic">Sin duplicados</p>
        </div>
      </div>
      <div className="bg-slate-50 p-3 lg:p-4 rounded-xl border border-slate-200">
        <h4 className="text-xs font-bold mb-2">Farmacia Preferida</h4>
        <div className="flex items-center gap-2 mb-2">
          <span className="material-icons-outlined text-sm text-slate-400">location_on</span>
          <span className="text-[11px] font-medium">Cruz Verde - Calle 100</span>
        </div>
        <div className="flex items-center justify-between text-[11px]">
          <span className="text-slate-500">Metformina 850mg</span>
          <span className="text-[#1d4ed8] font-bold">EN STOCK</span>
        </div>
        <div className="flex items-center justify-between text-[11px] mt-1">
          <span className="text-slate-500">Insulina Glargina</span>
          <span className="text-amber-500 font-bold">LIMITADO</span>
        </div>
      </div>
    </div>
  );
}
