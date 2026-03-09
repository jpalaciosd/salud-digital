"use client";
import { useState } from "react";

export default function Teleconsulta() {
  const [activeTab, setActiveTab] = useState("notes");

  return (
    <div className="h-screen flex flex-col overflow-hidden" style={{ fontFamily: "'Manrope', sans-serif" }}>
      {/* Header */}
      <header className="h-16 border-b border-slate-200 bg-white px-6 flex items-center justify-between z-10">
        <div className="flex items-center gap-4">
          <div className="bg-[#13ec5b]/20 p-2 rounded-lg">
            <span className="material-icons-outlined text-[#13ec5b]">video_call</span>
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight">Juan Carlos Pérez</h1>
            <div className="flex items-center gap-3 text-xs text-slate-500">
              <span>CC 79.452.128</span>
              <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
              <span>54 Años</span>
              <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
              <span className="text-[#13ec5b] font-semibold">Control Diabetes Tipo 2</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200">
            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
            <span className="font-mono font-bold text-sm">12:45 <span className="text-slate-400 font-normal">/ 20:00</span></span>
          </div>
          <div className="w-8 h-8 rounded-full bg-[#13ec5b] flex items-center justify-center text-white font-bold">DR</div>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 flex overflow-hidden">
        {/* Video Zone 60% */}
        <section className="w-[60%] relative bg-black flex flex-col">
          <div className="flex-1 relative overflow-hidden">
            <img alt="Paciente" className="w-full h-full object-cover opacity-90" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBCkaaXWxoDE0PW0yKLQaTF23PH4LS_eU57Xb_3vsxLay03_EecnxO73JIbYLlIJGP4yUcds3SjxIg6Nexn-1dS2tkAe1Eydl3ERh5Pss_uiREOf_gkX8XGXwVBUWVQD14bU3gcqNTa-CQeTfc0vGt7XXFyxovtOGIpgj-qx3QHRcWfpDnCzxpFmPYptSMXLUox2_SAuV_UMXz1bnXPQNJUkf1_AISnEFfPlOdTqSLvJvSvICdEKr0DChHJe3D9Kb4ZxN9BxMAvd6rT" />

            {/* Controls */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/20">
              {["mic", "videocam", "screen_share", "more_horiz"].map((icon) => (
                <button key={icon} className="w-12 h-12 rounded-xl bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-all">
                  <span className="material-icons-outlined">{icon}</span>
                </button>
              ))}
              <div className="w-px h-8 bg-white/20 mx-1"></div>
              <button className="px-6 h-12 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold flex items-center gap-2 transition-all">
                <span className="material-icons-outlined">call_end</span>
                Finalizar
              </button>
            </div>

            {/* Self View */}
            <div className="absolute top-6 right-6 w-48 h-32 rounded-xl overflow-hidden border-2 border-white/20 shadow-2xl">
              <img alt="Doctor" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAL8ddRLMSbknY6eWJ0ozVvnTwQYyXjalcCMySP5kQzc827R66Z8UGR792I4IYTXOD0eQayedBhANygsmXknzqBO8q2BRiHPJtO6xK5jzxOR5Ed5AF0nQwWzJFwDjD-x4u9cChjH9ARTwzeVB3B6aIYcvdaDR9bCcpXeEOv6RZQEERoeZA-KODVQb9rupDtMwkxCgwPCNln_gln30_lz0FrrGpaCnpnDZO7zfEB-UxhnmHeRXuO31yEGVve5RC2ACtJ41HYRKhUVlEe" />
              <div className="absolute bottom-2 left-2 px-1.5 py-0.5 bg-black/50 backdrop-blur-md rounded text-[10px] text-white uppercase tracking-wider">Tú</div>
            </div>

            {/* Signal */}
            <div className="absolute top-6 left-6 flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10">
              <div className="flex gap-0.5 items-end h-3">
                {[1, 2, 3, 2.5].map((h, i) => (
                  <div key={i} className="w-1 bg-[#13ec5b] rounded-full" style={{ height: `${h * 4}px` }}></div>
                ))}
              </div>
              <span className="text-[10px] text-white font-medium uppercase tracking-widest">HD Estable</span>
            </div>
          </div>
        </section>

        {/* Clinical Panel 40% */}
        <section className="w-[40%] flex flex-col bg-white border-l border-slate-200">
          {/* Tabs */}
          <div className="flex border-b border-slate-200">
            {[
              { id: "notes", label: "Notas Clínicas" },
              { id: "history", label: "Historial" },
              { id: "vitals", label: "Vitales y Labs" },
            ].map((tab) => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex-1 py-4 text-sm font-semibold transition-colors ${activeTab === tab.id ? "border-b-2 border-[#13ec5b] text-[#13ec5b]" : "text-slate-500 hover:text-slate-900"}`}>
                {tab.label}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Notes */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Notas Clínicas</label>
                <span className="text-[10px] bg-[#13ec5b]/10 text-[#13ec5b] px-2 py-0.5 rounded-full font-bold">Autoguardado 14:02</span>
              </div>
              <textarea className="w-full h-48 p-4 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-[#13ec5b] focus:border-transparent resize-none text-sm leading-relaxed" placeholder="Escriba síntomas, observaciones o hallazgos reportados por el paciente..."></textarea>
            </div>

            {/* Vitals */}
            <div className="space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Monitoreo Reciente (Bluetooth Sync)</label>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-slate-500">Presión Arterial</span>
                    <span className="material-icons-outlined text-[#13ec5b] text-sm">monitor_heart</span>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold">128/84</span>
                    <span className="text-[10px] text-slate-500">mmHg</span>
                  </div>
                  <div className="mt-2 flex items-center gap-1 text-[10px] text-amber-600 font-medium">
                    <span className="material-icons-outlined text-[12px]">trending_up</span>
                    <span>Ligeramente elevada</span>
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-slate-500">Glucosa en Sangre</span>
                    <span className="material-icons-outlined text-[#13ec5b] text-sm">water_drop</span>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold">112</span>
                    <span className="text-[10px] text-slate-500">mg/dL</span>
                  </div>
                  <div className="mt-2 flex items-center gap-1 text-[10px] text-[#13ec5b] font-medium">
                    <span className="material-icons-outlined text-[12px]">check_circle</span>
                    <span>Rango objetivo (Ayunas)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Key Alerts */}
            <div className="p-4 rounded-xl bg-[#13ec5b]/5 border border-[#13ec5b]/20 space-y-2">
              <div className="flex items-center gap-2 text-[#13ec5b]">
                <span className="material-icons-outlined text-sm">info</span>
                <span className="text-xs font-bold uppercase tracking-wide">Alertas Clave</span>
              </div>
              <ul className="text-xs space-y-1.5 text-slate-600">
                <li className="flex items-start gap-2">
                  <span className="mt-1 w-1 h-1 bg-[#13ec5b] rounded-full shrink-0"></span>
                  <span>Alérgico a Penicilina (reacción severa reportada 2019)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 w-1 h-1 bg-[#13ec5b] rounded-full shrink-0"></span>
                  <span>Actualmente con Metformina 500mg BID</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Actions Footer */}
          <div className="p-6 border-t border-slate-200 bg-slate-50/50">
            <div className="grid grid-cols-2 gap-3">
              <button className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl bg-white border border-slate-200 hover:border-[#13ec5b] hover:shadow-lg transition-all group">
                <div className="w-10 h-10 rounded-full bg-[#13ec5b]/10 flex items-center justify-center group-hover:bg-[#13ec5b]/20">
                  <span className="material-icons-outlined text-[#13ec5b]">medication</span>
                </div>
                <span className="text-xs font-bold">e-Prescripción</span>
              </button>
              <button className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl bg-white border border-slate-200 hover:border-[#13ec5b] hover:shadow-lg transition-all group">
                <div className="w-10 h-10 rounded-full bg-[#13ec5b]/10 flex items-center justify-center group-hover:bg-[#13ec5b]/20">
                  <span className="material-icons-outlined text-[#13ec5b]">assignment</span>
                </div>
                <span className="text-xs font-bold">Remisión / Labs</span>
              </button>
            </div>
            <button className="w-full mt-4 py-3 rounded-xl bg-[#13ec5b] text-slate-900 font-bold text-sm hover:brightness-105 transition-all flex items-center justify-center gap-2">
              <span className="material-icons-outlined">task_alt</span>
              Finalizar y Sincronizar Registros
            </button>
          </div>
        </section>
      </main>

      {/* Location overlay */}
      <div className="fixed bottom-4 left-4 z-20 flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/20 text-[10px] text-white">
        <span className="material-icons-outlined text-[14px]">location_on</span>
        <span>Ubicación del Paciente: Bogotá, CO</span>
      </div>
    </div>
  );
}
