"use client";
import Link from "next/link";
import { useState } from "react";

const modulos = [
  { num: "01", titulo: "Fundamentos de la Gestión Social", desc: "Introducción al marco normativo y conceptual", open: false },
  { num: "02", titulo: "Diagnóstico Territorial Participativo", desc: "Mapeo de actores y herramientas de escucha activa", open: true, contenido: [
    { titulo: "Técnicas de observación participante", desc: "Cómo documentar realidades sociales sin sesgos." },
    { titulo: "Cartografía Social", desc: "Representación visual del territorio y sus tensiones." },
  ]},
  { num: "03", titulo: "Diseño de Proyectos de Impacto", desc: "Marco Lógico y formulación técnica", open: false },
  { num: "04", titulo: "Sostenibilidad y Financiamiento", desc: "Gestión de recursos y alianzas público-privadas", open: false },
];

export default function ProgramaCVFDI() {
  const [openMod, setOpenMod] = useState(1);

  return (
    <div className="min-h-screen bg-[#f6f8f7] text-[#0d1b13]" style={{ fontFamily: "'Manrope', sans-serif" }}>
      {/* Nav */}
      <header className="sticky top-0 z-50 w-full border-b border-[#e7f3ec] bg-white/80 backdrop-blur-md px-6 md:px-20 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-8">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#13ec6d] rounded-lg flex items-center justify-center">
                <span className="material-icons-outlined text-[#0d1b13]">hub</span>
              </div>
              <h2 className="text-xl font-bold tracking-tight">CVFDI</h2>
            </div>
            <nav className="hidden lg:flex items-center gap-8">
              <Link href="/cvfdi" className="text-sm font-medium hover:text-[#13ec6d] transition-colors">Programas</Link>
              <a className="text-sm font-medium hover:text-[#13ec6d] transition-colors" href="#">Comunidad</a>
              <a className="text-sm font-medium hover:text-[#13ec6d] transition-colors" href="#">Impacto</a>
              <a className="text-sm font-medium hover:text-[#13ec6d] transition-colors" href="#">Nosotros</a>
            </nav>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/estudiante" className="bg-[#13ec6d] text-[#0d1b13] px-5 py-2 rounded-lg text-sm font-bold hover:shadow-lg transition-all">Iniciar Sesión</Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 md:px-20 py-8">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 mb-8 text-sm text-[#4c9a6c] font-medium">
          <Link href="/cvfdi" className="hover:text-[#13ec6d]">Inicio</Link>
          <span className="material-icons-outlined text-xs">chevron_right</span>
          <span>Diplomados</span>
          <span className="material-icons-outlined text-xs">chevron_right</span>
          <span className="text-[#0d1b13]">Gestión Social</span>
        </div>

        {/* Hero */}
        <div className="relative w-full rounded-2xl overflow-hidden mb-12 shadow-2xl">
          <div className="aspect-[21/9] w-full bg-cover bg-center flex flex-col justify-end p-8 md:p-12 relative" style={{ backgroundImage: "linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.2) 60%, rgba(0,0,0,0) 100%), url('https://lh3.googleusercontent.com/aida-public/AB6AXuC3ElxsqKaXKQBFIByeT6YEieGCrZG9_Z1IiRwtVJBP0HBgqwSwRQ09bE6njdeQFUFUqqm_zgEPSkX9ru2UFDVsMZKDFVoFdxK40F414wdksIidH8fI1z6MV6qL0ALCKHLYp_TRA_KdRNEa_qJOjuvz02yIPnI1qAWSFUiEAZI-osVCPweHxZnLlk4ERg5nTZmfyX1YdlXq4WXULyorqllDIOabXU3PIa4KVXvsDWkOlbrqN3rjFZyKWt5CcqVZ2rwDtYWG2mdp9k4')" }}>
            <div className="absolute top-8 left-8 flex gap-3">
              <span className="bg-[#13ec6d] px-3 py-1 rounded-full text-xs font-bold text-[#0d1b13] uppercase tracking-wider">Inscripciones Abiertas</span>
              <span className="bg-white/20 backdrop-blur-md border border-white/30 px-3 py-1 rounded-full text-xs font-bold text-white uppercase tracking-wider">120 Horas</span>
            </div>
            <div className="max-w-3xl">
              <h1 className="text-white text-4xl md:text-5xl font-black leading-tight mb-4 tracking-tight">Diplomado en Gestión Social</h1>
              <p className="text-white/90 text-lg md:text-xl font-light leading-relaxed">Formación integral para el liderazgo territorial y la transformación profunda de comunidades.</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left */}
          <div className="lg:col-span-2 space-y-12">
            {/* Competencias */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <span className="material-icons-outlined text-[#13ec6d] text-3xl">bolt</span>
                <h2 className="text-2xl font-bold">Lo que lograrás</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { icon: "group", titulo: "Liderazgo Colaborativo", desc: "Desarrollarás habilidades para coordinar equipos multidisciplinarios en entornos comunitarios diversos." },
                  { icon: "architecture", titulo: "Diseño de Proyectos", desc: "Aprenderás metodologías ágiles para la formulación, ejecución y evaluación de impacto social real." },
                  { icon: "public", titulo: "Análisis Territorial", desc: "Mapeo de actores y diagnóstico situacional para intervenciones pertinentes y sostenibles." },
                  { icon: "verified", titulo: "Ética Social", desc: "Fundamentos sólidos para una intervención basada en derechos humanos y justicia social." },
                ].map((c, i) => (
                  <div key={i} className="bg-white p-6 rounded-xl border border-[#e7f3ec] hover:border-[#13ec6d]/40 transition-colors">
                    <span className="material-icons-outlined text-[#13ec6d] mb-3 text-3xl">{c.icon}</span>
                    <h3 className="font-bold mb-2">{c.titulo}</h3>
                    <p className="text-sm text-[#4c9a6c] leading-relaxed">{c.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Impacto */}
            <section className="bg-[#13ec6d]/10 border border-[#13ec6d]/20 rounded-2xl p-8 relative overflow-hidden">
              <div className="relative z-10">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <span className="material-icons-outlined text-[#13ec6d]">language</span>
                  Impacto en tu Territorio
                </h2>
                <p className="text-[#0d1b13]/80 leading-relaxed text-lg max-w-2xl mb-6">
                  Este programa no es solo teoría; está diseñado para que cada módulo se traduzca en una mejora tangible para tu comunidad. Al finalizar, contarás con un proyecto de intervención listo para ser financiado y ejecutado en tu localidad.
                </p>
                <div className="flex items-center gap-4 text-sm font-bold">
                  <div className="flex items-center gap-1"><span className="material-icons-outlined text-[#13ec6d]">check_circle</span>+500 Comunidades Impactadas</div>
                  <div className="flex items-center gap-1"><span className="material-icons-outlined text-[#13ec6d]">check_circle</span>Red de Egresados Activa</div>
                </div>
              </div>
            </section>

            {/* Plan de Estudios */}
            <section>
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <span className="material-icons-outlined text-[#13ec6d] text-3xl">menu_book</span>
                  <h2 className="text-2xl font-bold">Plan de Estudios</h2>
                </div>
                <span className="text-sm font-medium text-[#4c9a6c]">5 Módulos • 12 Semanas</span>
              </div>
              <div className="space-y-4">
                {modulos.map((m, i) => (
                  <div key={i} className={`bg-white rounded-xl overflow-hidden transition-all duration-300 ${openMod === i ? "border-2 border-[#13ec6d] shadow-lg shadow-[#13ec6d]/5" : "border border-[#e7f3ec]"}`}>
                    <button onClick={() => setOpenMod(openMod === i ? -1 : i)} className={`w-full flex items-center justify-between p-6 text-left ${openMod === i ? "bg-[#13ec6d]/5" : ""}`}>
                      <div className="flex items-center gap-4">
                        <span className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold ${openMod === i ? "bg-[#13ec6d] text-[#0d1b13]" : "bg-[#13ec6d]/20 text-[#0d1b13]"}`}>{m.num}</span>
                        <div>
                          <h3 className="font-bold text-lg">{m.titulo}</h3>
                          <p className="text-xs text-[#4c9a6c]">{m.desc}</p>
                        </div>
                      </div>
                      <span className={`material-icons-outlined text-[#4c9a6c] transition-transform ${openMod === i ? "rotate-180 text-[#13ec6d]" : ""}`}>expand_more</span>
                    </button>
                    {openMod === i && m.contenido && (
                      <div className="p-6 border-t border-[#e7f3ec] space-y-4">
                        {m.contenido.map((c, j) => (
                          <div key={j} className="flex items-start gap-3">
                            <span className="material-icons-outlined text-[#13ec6d] text-sm mt-1">radio_button_checked</span>
                            <div>
                              <p className="text-sm font-medium">{c.titulo}</p>
                              <p className="text-xs text-[#4c9a6c]">{c.desc}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Right Sidebar */}
          <aside className="space-y-8">
            <div className="sticky top-28 space-y-8">
              {/* Enrollment */}
              <div className="bg-white border-2 border-[#e7f3ec] rounded-2xl p-8 shadow-xl">
                <div className="mb-6">
                  <div className="flex items-center gap-2 text-[#13ec6d] font-bold mb-1">
                    <span className="material-icons-outlined text-lg">workspace_premium</span>
                    <span className="text-sm tracking-wide uppercase">Beca Social</span>
                  </div>
                  <h3 className="text-3xl font-black">100% Cubierto</h3>
                  <p className="text-sm text-[#4c9a6c] mt-1 italic">Válido para líderes comunitarios registrados.</p>
                </div>
                <form className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold mb-1.5 uppercase tracking-wider">Nombre Completo</label>
                    <input className="w-full bg-[#f8fcfa] border border-[#e7f3ec] rounded-lg px-4 py-3 text-sm focus:ring-[#13ec6d] focus:border-[#13ec6d]" placeholder="Ej. Ana García" type="text" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold mb-1.5 uppercase tracking-wider">Correo Electrónico</label>
                    <input className="w-full bg-[#f8fcfa] border border-[#e7f3ec] rounded-lg px-4 py-3 text-sm focus:ring-[#13ec6d] focus:border-[#13ec6d]" placeholder="ana@ejemplo.com" type="email" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold mb-1.5 uppercase tracking-wider">Teléfono</label>
                    <input className="w-full bg-[#f8fcfa] border border-[#e7f3ec] rounded-lg px-4 py-3 text-sm focus:ring-[#13ec6d] focus:border-[#13ec6d]" placeholder="+57 300 000 0000" type="tel" />
                  </div>
                  <button className="w-full bg-[#13ec6d] text-[#0d1b13] font-bold py-4 rounded-xl shadow-lg shadow-[#13ec6d]/20 hover:shadow-[#13ec6d]/40 transition-all flex items-center justify-center gap-2 mt-4" type="submit">
                    <span className="material-icons-outlined">send</span>
                    Solicitar Información
                  </button>
                </form>
              </div>

              {/* Docente */}
              <div className="bg-white border border-[#e7f3ec] rounded-2xl p-6">
                <h4 className="text-sm font-bold mb-4 uppercase tracking-widest">Docente Principal</h4>
                <div className="flex items-center gap-4 mb-4">
                  <img className="w-16 h-16 rounded-full object-cover border-2 border-[#13ec6d]/20" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCAUFzzqUkt3c_FbndW2Br4jb3TaUqkzlLAw-SXL2RvoERg9-O-Bk_ZFnvrqdhppfZXz0Pb8qApt1NsM-8wKeFzWDclkrLeT6tLXX0fOY-tzhzd_b4SrhW5UL2ZVfxypkRyNXA_W4O93iBMxD9I8Lk2eE0VBhCiaUO86muQeN530q_J50XPAiaLKytaStFbKdjwByfudMkbxmWyjwtre88U9eMkZJexY7VHj2tY-alZddx80Kw4ULFu0JOsCLPwxjb9gyCl_P0puDE" alt="Docente" />
                  <div>
                    <h5 className="font-bold">Mtr. Elena Rodríguez</h5>
                    <p className="text-xs text-[#13ec6d] font-medium">Especialista en Desarrollo Territorial</p>
                  </div>
                </div>
                <p className="text-sm text-[#4c9a6c] leading-relaxed italic">"Mi propósito es brindarte las herramientas necesarias para que tu vocación de servicio se convierta en una gestión técnica y profesional de alto impacto."</p>
              </div>

              {/* Social Proof */}
              <div className="flex items-center justify-center gap-6 px-4">
                {[
                  { val: "2.4k", label: "Egresados" },
                  { val: "98%", label: "Satisfacción" },
                  { val: "A+", label: "Calidad" },
                ].map((s, i) => (
                  <div key={i} className="text-center">
                    <p className="text-2xl font-black">{s.val}</p>
                    <p className="text-[10px] uppercase font-bold text-[#4c9a6c]">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </main>

      <footer className="mt-20 border-t border-[#e7f3ec] bg-white py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-3 opacity-50">
            <div className="w-8 h-8 bg-[#0d1b13] rounded flex items-center justify-center">
              <span className="material-icons-outlined text-[#13ec6d]">hub</span>
            </div>
            <h2 className="text-lg font-bold">CVFDI</h2>
          </div>
          <p className="text-sm text-[#4c9a6c]">© 2026 Centro Virtual de Formación y Desarrollo Integral.</p>
        </div>
      </footer>
    </div>
  );
}
