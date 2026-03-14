"use client";
import { useState } from "react";
import { useAuth } from "@/lib/AuthContext";

const cursos = [
  { titulo: "Gestión de Proyectos Comunitarios", nivel: "Intermedio", lecciones: 12, progreso: 75, tarea: "Diseño del Plan de Impacto", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAkN_EeQG9gkRXU7njcwVADBAS41_mbUK21fAA42RDMVLiYAytTkYpD5IktBL-1Kp6sPi1xKqYkGd86VAP0HQQOxFhsKXmBgd0XW9HUk6V9x0sgbFqsB17hGFEUydGUPOqOpdGwWtlR4OgBGJjOZswfeccTwpF2z78p47yq4fcfH6ktAlE3-4RfEUVOfu85g4S7FWGp2xDlxhU-6LbztMmA54nI2XnY-Bl_7DC--MD9fxXLb_NCzcTNofwpFNMpEHHOnzTrr-1dOQY" },
  { titulo: "Análisis Técnico y Sostenibilidad", nivel: "Avanzado", lecciones: 8, progreso: 32, tarea: "Evaluación de Riesgos", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDpB7G5vJsJH5oD8kJyB6NVUWp4v0F52a2IYd7ZHQuDQNp2lyiDLpV_ih8R17IIHH2dTOS3nzgbnvqrglCsucf8aUloror88_HuVTcoBcqGpkeCxQmng_npWgWPEwZzaGuAM8DzN1p71F7RlKblNSblSPNF7vjmiS42Geoe1CNPJbuS0ZRUr_AaN8ZkoWSOxiUoehFxRGcQvQaunHENFRB8vYg3xzydSUEjPrZgMPwG8dXx9WB7EBXmNW28akhwZKeiqAFZTtL5lng" },
];

const competencias = [
  { nombre: "Liderazgo", pct: 75, offset: 44, cambio: "+5%" },
  { nombre: "Técnica", pct: 40, offset: 105, cambio: "+2%" },
  { nombre: "Impacto Social", pct: 90, offset: 17, cambio: "+12%" },
];

export default function Estudiante() {
  const { user, logout } = useAuth();
  const [tab, setTab] = useState("inicio");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
    { id: "inicio", icon: "home", label: "Inicio" },
    { id: "cursos", icon: "menu_book", label: "Mis Cursos" },
    { id: "progreso", icon: "leaderboard", label: "Mi Progreso" },
    { id: "comunidad", icon: "group", label: "Comunidad" },
    { id: "soporte", icon: "help_outline", label: "Soporte" },
  ];

  return (
    <div className="flex min-h-screen bg-[#f6f8f6]" style={{ fontFamily: "'Manrope', sans-serif" }}>
      {/* Mobile overlay */}
      {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 w-72 lg:w-64 bg-white border-r border-[#1d4ed8]/10 z-50 transform transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 lg:static lg:shrink-0 flex flex-col`}>
        <div className="p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#1d4ed8]/20 rounded-lg flex items-center justify-center">
              <span className="material-icons-outlined text-[#1d4ed8] font-bold">school</span>
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight">CVFDI</h1>
              <p className="text-[10px] uppercase tracking-widest text-[#4c9a6c] font-semibold">Formación Integral</p>
            </div>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-1 text-slate-400">
            <span className="material-icons-outlined">close</span>
          </button>
        </div>
        <nav className="flex-1 mt-2 px-3 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => { setTab(item.id); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-sm ${
                tab === item.id ? "bg-[#1d4ed8]/15 border-r-4 border-[#1d4ed8] font-semibold" : "text-[#4c5a52] hover:bg-[#1d4ed8]/5"
              }`}
            >
              <span className="material-icons-outlined text-xl">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="p-4 mt-auto">
          <div className="bg-[#1d4ed8]/10 rounded-xl p-3 border border-[#1d4ed8]/20">
            <p className="text-xs font-semibold mb-1">Impacto Social</p>
            <div className="flex items-center gap-2">
              <span className="material-icons-outlined text-[#1d4ed8] text-sm">volunteer_activism</span>
              <span className="text-sm font-bold">1,250 pts</span>
            </div>
          </div>
          <div className="mt-3 flex items-center gap-3 px-2">
            <div className="w-9 h-9 bg-[#1d4ed8]/20 rounded-full flex items-center justify-center text-[#1d4ed8] font-bold text-xs shrink-0">
              {(user?.nombre?.[0] || "A")}{(user?.apellido?.[0] || "R")}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold truncate">{user?.nombre} {user?.apellido}</p>
              <p className="text-[10px] text-[#4c9a6c] truncate capitalize">{user?.rol || "Estudiante"}</p>
            </div>
          </div>
          <button onClick={logout} className="mt-2 w-full text-xs text-red-500 hover:bg-red-50 py-1.5 rounded-lg transition flex items-center justify-center gap-1">
            <span className="material-icons-outlined text-sm">logout</span>
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile header */}
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-lg border-b border-[#1d4ed8]/10 px-4 py-3 lg:hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button onClick={() => setSidebarOpen(true)} className="p-2 -ml-2 text-slate-600 hover:bg-blue-50 rounded-lg">
                <span className="material-icons-outlined">menu</span>
              </button>
              <span className="text-lg font-bold">CVFDI</span>
            </div>
            <div className="w-8 h-8 bg-[#1d4ed8]/20 rounded-full flex items-center justify-center text-[#1d4ed8] font-bold text-xs">
              {(user?.nombre?.[0] || "A")}{(user?.apellido?.[0] || "R")}
            </div>
          </div>
        </header>

        <div className="flex flex-1 overflow-hidden">
          <main className="flex-1 overflow-y-auto p-4 lg:p-8">
            {/* Header */}
            <header className="mb-6 lg:mb-10">
              <h2 className="text-2xl lg:text-3xl font-black tracking-tight">¡Hola, {user?.nombre || "Estudiante"}! 👋</h2>
              <p className="text-[#4c9a6c] mt-1 text-sm lg:text-lg">Tu formación integral es nuestra prioridad.</p>
            </header>

            {/* Competencias */}
            <section className="mb-8 lg:mb-10">
              <div className="flex items-center justify-between mb-4 lg:mb-6">
                <h3 className="text-lg lg:text-xl font-bold">Progreso por Competencias</h3>
                <button className="text-[#1d4ed8] text-xs lg:text-sm font-bold flex items-center gap-1">Ver detalles <span className="material-icons-outlined text-sm">arrow_forward</span></button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {competencias.map((c, i) => (
                  <div key={i} className="bg-white p-4 lg:p-6 rounded-xl border border-[#1d4ed8]/10 flex items-center gap-4 shadow-sm">
                    <div className="relative w-14 h-14 lg:w-16 lg:h-16 shrink-0">
                      <svg className="w-full h-full" style={{ transform: "rotate(-90deg)" }}>
                        <circle cx="50%" cy="50%" r="44%" fill="transparent" stroke="#1d4ed8" strokeWidth="6" opacity="0.1" />
                        <circle cx="50%" cy="50%" r="44%" fill="transparent" stroke="#1d4ed8" strokeWidth="6" strokeDasharray="175" strokeDashoffset={c.offset} strokeLinecap="round" />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center font-bold text-xs">{c.pct}%</div>
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{c.nombre}</p>
                      <p className="text-xs text-[#078829] font-medium">{c.cambio} esta semana</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Cursos Activos */}
            <section>
              <h3 className="text-lg lg:text-xl font-bold mb-4 lg:mb-6">Cursos Activos</h3>
              <div className="space-y-4">
                {cursos.map((curso, i) => (
                  <div key={i} className="bg-white p-4 lg:p-5 rounded-xl border border-[#1d4ed8]/10 shadow-sm group hover:border-[#1d4ed8]/30 transition-all">
                    <div className="flex gap-4 items-start">
                      <div className="w-16 h-16 lg:w-20 lg:h-20 bg-cover bg-center rounded-lg shrink-0" style={{ backgroundImage: `url('${curso.img}')` }}></div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className="px-2 py-0.5 bg-[#1d4ed8]/10 text-[#1d4ed8] text-[10px] font-bold rounded uppercase">{curso.nivel}</span>
                          <span className="text-[10px] lg:text-xs text-slate-400">• {curso.lecciones} Lecciones</span>
                        </div>
                        <h4 className="text-sm lg:text-lg font-bold truncate">{curso.titulo}</h4>
                        <div className="mt-2 flex items-center gap-3">
                          <div className="flex-1 bg-slate-100 h-2 rounded-full overflow-hidden">
                            <div className="bg-[#1d4ed8] h-full rounded-full" style={{ width: `${curso.progreso}%` }}></div>
                          </div>
                          <span className="text-xs lg:text-sm font-bold">{curso.progreso}%</span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <div>
                        <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Próxima Tarea</p>
                        <p className="text-xs lg:text-sm font-medium truncate">{curso.tarea}</p>
                      </div>
                      <button className={`font-bold py-2 px-5 rounded-lg text-xs lg:text-sm transition-all shrink-0 ${
                        i === 0 ? "bg-[#1d4ed8] hover:bg-[#1d4ed8]/90 text-white shadow-lg shadow-[#1d4ed8]/20" : "bg-white border border-[#1d4ed8] text-[#1d4ed8]"
                      }`}>
                        {i === 0 ? "Continuar" : "Retomar clase"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Tutorías & Mentor — shown on mobile below main content */}
            <div className="xl:hidden mt-8 space-y-6">
              <div>
                <h3 className="text-lg font-bold flex items-center gap-2 mb-4">
                  <span className="material-icons-outlined text-[#1d4ed8]">calendar_today</span>
                  Próximas Tutorías
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { when: "MAÑANA", hora: "10:00 AM", titulo: "Estrategias de Impacto Social", mentor: "Carlos Méndez" },
                    { when: "15 MAYO", hora: "4:30 PM", titulo: "Taller de Liderazgo Ético", mentor: "Sofía Valente" },
                  ].map((t, i) => (
                    <div key={i} className="p-4 rounded-xl bg-white border border-slate-100">
                      <div className="flex justify-between items-start mb-2">
                        <span className={`text-[10px] font-bold px-2 py-0.5 bg-slate-50 rounded-full ${i === 0 ? "text-[#1d4ed8]" : "text-slate-400"}`}>{t.when}</span>
                        <span className="text-xs text-slate-400">{t.hora}</span>
                      </div>
                      <p className="text-sm font-bold mb-1">{t.titulo}</p>
                      <p className="text-xs text-[#4c9a6c]">Mentor: {t.mentor}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-[#1d4ed8]/5 rounded-2xl p-5 border border-[#1d4ed8]/10 text-center">
                <h4 className="font-bold">¿Necesitas guía?</h4>
                <p className="text-xs text-[#4c9a6c] mt-1 mb-4">Tu mentor Carlos está disponible.</p>
                <button className="w-full bg-[#0d1b13] text-white py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2">
                  <span className="material-icons-outlined text-[#1d4ed8] text-sm">chat</span>
                  Chat con Mentor
                </button>
              </div>
            </div>
          </main>

          {/* Right Sidebar — desktop only */}
          <aside className="w-80 bg-white border-l border-[#1d4ed8]/10 p-6 overflow-y-auto hidden xl:block shrink-0">
            <div className="mb-8">
              <h3 className="text-lg font-bold flex items-center gap-2 mb-5">
                <span className="material-icons-outlined text-[#1d4ed8]">calendar_today</span>
                Próximas Tutorías
              </h3>
              <div className="space-y-4">
                {[
                  { when: "MAÑANA", hora: "10:00 AM", titulo: "Estrategias de Impacto Social", mentor: "Carlos Méndez" },
                  { when: "15 MAYO", hora: "4:30 PM", titulo: "Taller de Liderazgo Ético", mentor: "Sofía Valente" },
                ].map((t, i) => (
                  <div key={i} className="p-4 rounded-xl bg-[#f6f8f7] border border-slate-100 hover:border-[#1d4ed8]/20 transition-all">
                    <div className="flex justify-between items-start mb-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 bg-white rounded-full shadow-sm ${i === 0 ? "text-[#1d4ed8]" : "text-slate-400"}`}>{t.when}</span>
                      <span className="text-xs text-slate-400">{t.hora}</span>
                    </div>
                    <p className="text-sm font-bold mb-1">{t.titulo}</p>
                    <p className="text-xs text-[#4c9a6c]">Mentor: {t.mentor}</p>
                  </div>
                ))}
              </div>
              <button className="w-full mt-4 text-xs font-bold text-slate-400 py-2 border border-dashed border-slate-200 rounded-lg hover:border-[#1d4ed8]/40 hover:text-[#1d4ed8] transition-all">+ Agendar nueva sesión</button>
            </div>

            <div className="bg-[#1d4ed8]/5 rounded-2xl p-6 border border-[#1d4ed8]/10 relative overflow-hidden">
              <div className="absolute -right-4 -top-4 w-20 h-20 bg-[#1d4ed8]/10 rounded-full blur-xl"></div>
              <div className="relative z-10 text-center">
                <div className="w-20 h-20 mx-auto rounded-full p-1 border-2 border-[#1d4ed8] mb-4">
                  <img className="w-full h-full rounded-full object-cover shadow-md" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAJCzTzsUeEPca8KeZyb4ilAKhw6y1J0yhiwhHBmN3fOvwUHpMUwJS_LttB3r3J8zWuh5JKX7osqz34reHsh4zzvD6Cu6g6dgufS2ERmou5DN0hGW6M88MH2Rzez5waxOLSmmdeh7GMHZdqwoL0XY_WlJfEcRLtkC3Pq6xnObw2zXaK1Ay1rdADJuBoBqvZ7r6KKeqTPAx8axa7F6upsTxHPYKkVTB2Z9lZ_vIV5wLO1zqCcbV5AFY8sT5tpFcV9wOpcDgz3aOqobY" alt="Mentor" />
                </div>
                <h4 className="font-bold">¿Necesitas guía?</h4>
                <p className="text-xs text-[#4c9a6c] mt-1 px-4 mb-6">Tu mentor Carlos está disponible para resolver tus dudas.</p>
                <button className="w-full bg-[#0d1b13] hover:bg-black text-white py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-xl">
                  <span className="material-icons-outlined text-[#1d4ed8] text-sm">chat</span>
                  Chat con Mentor
                </button>
              </div>
            </div>

            <div className="mt-8">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Actividad Reciente</h4>
              <div className="space-y-4">
                {[
                  { texto: "<b>Completaste</b> la lección: Introducción al desarrollo humano.", tiempo: "Hace 2 horas" },
                  { texto: "<b>Recibiste feedback</b> en tu proyecto de sostenibilidad.", tiempo: "Ayer" },
                ].map((a, i) => (
                  <div key={i} className="flex gap-3">
                    <div className={`w-2 h-2 bg-[#1d4ed8] rounded-full mt-1.5 shrink-0 ${i > 0 ? "opacity-40" : ""}`}></div>
                    <div>
                      <p className="text-xs leading-tight" dangerouslySetInnerHTML={{ __html: a.texto }}></p>
                      <p className="text-[10px] text-slate-400 mt-1">{a.tiempo}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
