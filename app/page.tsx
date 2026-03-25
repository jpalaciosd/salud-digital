"use client";
import Link from "next/link";

const animStyles = `
@keyframes breathe { 0%,100%{transform:scale(1)} 50%{transform:scale(1.03)} }
@keyframes shimmer { 0%{transform:translateX(-150%) rotate(25deg)} 100%{transform:translateX(150%) rotate(25deg)} }
@keyframes sparkle { 0%,100%{opacity:0;transform:scale(0) rotate(0deg)} 50%{opacity:1;transform:scale(1) rotate(180deg)} }
`;

export default function Home() {
  return (
    <div className="min-h-screen">
      <style dangerouslySetInnerHTML={{ __html: animStyles }} />
      {/* Header */}
      <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-[#0f2847]/10">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/logo-issi.png" alt="ISSI" className="w-12 h-12 rounded-full" />
            <span className="text-xl font-bold tracking-tight uppercase">ISSI</span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-sm font-semibold hover:text-[#c5a044] transition-colors">Inicio</Link>
            <Link href="#metodologia" className="text-sm font-semibold hover:text-[#c5a044] transition-colors">Metodología</Link>
            <Link href="/cursos" className="text-sm font-semibold hover:text-[#c5a044] transition-colors">Cursos</Link>
            <Link href="#contacto" className="text-sm font-semibold hover:text-[#c5a044] transition-colors">Contacto</Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/login" className="px-6 py-2.5 rounded-full bg-[#0f2847] text-white font-bold text-sm hover:opacity-90 transition-all shadow-lg shadow-[#0f2847]/20">
              Iniciar Sesión
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden hero-gradient py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0f2847]/10 border border-[#0f2847]/20 text-[#0f2847] text-xs font-bold uppercase tracking-wider">
              <span className="material-icons-outlined text-sm">school</span>
              Centro de Estudios en Modalidad Virtual
            </div>
            <h1 className="text-5xl lg:text-7xl font-extrabold leading-tight">
              Formación en Salud <br /><span className="text-[#c5a044]">Potenciada</span> por Tecnología
            </h1>
            <p className="text-lg text-slate-600 max-w-lg leading-relaxed">
              Programas de formación virtual con certificación, guiados por inteligencia artificial. Aprende a tu ritmo, desde cualquier lugar de Colombia.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/registro" className="px-8 py-4 rounded-xl bg-[#0f2847] text-white font-bold text-lg hover:scale-105 transition-transform flex items-center justify-center gap-2">
                Inscribirme Ahora
                <span className="material-icons-outlined">arrow_forward</span>
              </Link>
              <Link href="/cursos" className="px-8 py-4 rounded-xl border-2 border-slate-200 font-bold text-lg hover:bg-slate-50 transition-colors text-center">
                Ver Cursos Disponibles
              </Link>
            </div>
            <div className="flex items-center gap-4 pt-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <span className="material-icons-outlined text-[#c5a044] text-lg">verified</span>
                  <span className="material-icons-outlined text-[#c5a044] text-lg">lock</span>
                  <span className="material-icons-outlined text-[#c5a044] text-lg">shield</span>
                </div>
                <p className="text-sm font-medium text-slate-500">Datos protegidos con cifrado · Conforme a <span className="text-slate-900 font-bold">Ley 1581</span></p>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-[#0f2847]/20 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-[#c5a044]/20 rounded-full blur-3xl"></div>
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
              <img className="w-full aspect-[4/5] object-cover" src="/promo-primeros-auxilios.jpg" alt="Formación en salud ISSI" />
            </div>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="py-12 bg-white border-y border-[#c5a044]/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { icon: "school", num: "4", label: "Cursos disponibles" },
              { icon: "smart_toy", num: "1", label: "Agente IA activo" },
              { icon: "lock", num: "100%", label: "Datos cifrados" },
              { icon: "workspace_premium", num: "✓", label: "Certificación oficial" },
            ].map((item) => (
              <div key={item.label} className="flex flex-col items-center gap-1">
                <span className="material-icons-outlined text-[#c5a044] text-2xl">{item.icon}</span>
                <span className="text-2xl font-extrabold text-slate-900">{item.num}</span>
                <span className="text-xs text-slate-400 font-medium">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pilares / Metodología */}
      <section id="metodologia" className="py-24 max-w-7xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl font-bold mb-4">Nuestra Metodología de Aprendizaje</h2>
          <p className="text-slate-500">Un modelo educativo que combina la guía de profesionales de salud con la eficiencia de la inteligencia artificial.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { icon: "auto_stories", titulo: "Aprendizaje Guiado por IA", desc: "Nuestra asistente Aura te guía módulo a módulo por WhatsApp, evalúa tu comprensión y adapta el ritmo a tus necesidades." },
            { icon: "workspace_premium", titulo: "Certificación Oficial", desc: "Al completar cada curso recibes un certificado digital avalado por el Instituto Superior de Salud Integral." },
            { icon: "schedule", titulo: "100% Virtual y Flexible", desc: "Estudia desde cualquier lugar de Colombia, a tu propio ritmo. Todo el contenido disponible 24/7 desde tu celular." },
          ].map((item, i) => (
            <div key={i} className="p-8 rounded-2xl bg-white border border-slate-100 hover:border-[#c5a044]/50 transition-all group">
              <div className="w-14 h-14 bg-[#0f2847]/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-[#0f2847] transition-colors">
                <span className="material-icons-outlined text-[#c5a044] group-hover:text-white">{item.icon}</span>
              </div>
              <h3 className="text-xl font-bold mb-3">{item.titulo}</h3>
              <p className="text-slate-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Cómo Funciona */}
      <section className="py-24 bg-gradient-to-br from-[#0a1628] to-[#0f2847] text-white">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold mb-4 text-center">¿Cómo <span className="text-[#c5a044]">Funciona</span>?</h2>
          <p className="text-white/70 text-center max-w-2xl mx-auto mb-16">Tu camino de formación en 4 pasos simples</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { num: "01", icon: "person_add", titulo: "Regístrate", desc: "Crea tu cuenta gratuita en la plataforma en menos de 2 minutos." },
              { num: "02", icon: "menu_book", titulo: "Elige tu Curso", desc: "Selecciona entre nuestros programas de formación en salud." },
              { num: "03", icon: "chat", titulo: "Aprende con Aura", desc: "Inicia tu curso por WhatsApp. Aura te enseña, evalúa y registra tu avance." },
              { num: "04", icon: "emoji_events", titulo: "Certifícate", desc: "Al completar todos los módulos, obtén tu certificado digital oficial." },
            ].map((s, i) => (
              <div key={i} className="text-center p-6">
                <div className="w-16 h-16 mx-auto mb-4 bg-[#c5a044]/15 rounded-2xl flex items-center justify-center">
                  <span className="material-icons-outlined text-[#c5a044] text-3xl">{s.icon}</span>
                </div>
                <div className="text-[#c5a044] text-xs font-bold mb-2">{s.num}</div>
                <h4 className="font-bold text-lg mb-2">{s.titulo}</h4>
                <p className="text-white/70 text-sm">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Banner Promo — Primeros Auxilios */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 lg:py-0">
          <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-[#c5a044]/30 lg:grid lg:grid-cols-2 lg:min-h-[520px]">
            <div className="relative h-72 sm:h-96 lg:h-auto">
              <img src="/promo-primeros-auxilios.jpg" alt="Curso de Primeros Auxilios Profesionales — ISSI" className="absolute inset-0 w-full h-full object-cover object-top" />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#0a1628]/90 hidden lg:block" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a1628]/95 via-[#0a1628]/40 to-transparent lg:hidden" />
            </div>
            <div className="relative bg-gradient-to-br from-[#0a1628] to-[#0f2847] p-8 sm:p-10 lg:p-14 flex flex-col justify-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#c5a044]/15 border border-[#c5a044]/30 text-[#c5a044] text-xs font-bold uppercase tracking-wider mb-6 w-fit">
                <span className="material-icons-outlined text-sm">local_fire_department</span>
                Inscripciones Abiertas
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-4">
                Curso de Primeros<br />Auxilios <span className="text-[#c5a044]">Profesionales</span>
              </h2>
              <p className="text-white/80 text-base sm:text-lg mb-8 leading-relaxed max-w-md">
                Certificación oficial con práctica intensiva en CPR avanzado, DEA, control de hemorragias y escenarios reales.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  { icon: "verified", text: "Certificación Oficial e Internacional" },
                  { icon: "schedule", text: "Horarios Flexibles" },
                  { icon: "groups", text: "Instructores Calificados" },
                  { icon: "medical_services", text: "Práctica Intensiva de Campo" },
                ].map((item) => (
                  <li key={item.text} className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-[#c5a044]/15 flex items-center justify-center shrink-0">
                      <span className="material-icons-outlined text-[#c5a044] text-sm">{item.icon}</span>
                    </span>
                    <span className="text-white/90 text-sm font-medium">{item.text}</span>
                  </li>
                ))}
              </ul>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link href="/registro" className="px-8 py-4 rounded-xl bg-[#c5a044] text-[#0a1628] font-extrabold text-base hover:bg-[#d4af37] transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#c5a044]/20">
                  ¡Aparta tu Cupo!
                  <span className="material-icons-outlined">arrow_forward</span>
                </Link>
                <a href="https://wa.me/573146501052?text=Hola%2C%20quiero%20info%20del%20curso%20de%20Primeros%20Auxilios" target="_blank" rel="noopener noreferrer"
                  className="px-8 py-4 rounded-xl border-2 border-white/20 text-white font-bold text-base hover:bg-white/10 transition-all flex items-center justify-center gap-2">
                  <span className="material-icons-outlined text-lg">chat</span>
                  +57 314 650 1052
                </a>
              </div>
              <p className="text-[#c5a044]/70 text-xs mt-6 font-semibold uppercase tracking-wider">⚡ Últimas fechas disponibles</p>
            </div>
          </div>
        </div>
      </section>

      {/* Cursos Disponibles */}
      <section className="py-24 bg-[#f1f5f9]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-extrabold mb-4">Nuestros <span className="text-[#c5a044]">Cursos</span></h2>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto">Programas de formación en salud guiados por profesionales y asistidos por inteligencia artificial. Aprende a tu ritmo, desde cualquier lugar.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { emoji: "🩺", titulo: "Taller de Primeros Auxilios", instructor: "Dra. María López", modulos: 8, horas: 8, desc: "Técnicas esenciales de primeros auxilios para situaciones de emergencia." },
              { emoji: "🛡️", titulo: "Taller: Seguridad del Paciente", instructor: "Dr. Roberto Sánchez", modulos: 6, horas: 6, desc: "Protocolos de seguridad clínica y prevención de eventos adversos." },
              { emoji: "🧠", titulo: "Salud Mental y Manejo de Crisis", instructor: "Ps. Andrea Martínez", modulos: 4, horas: 6, desc: "Estrategias de regulación emocional, grounding y primeros auxilios psicológicos." },
              { emoji: "🩺", titulo: "Curso de Enfermería en Salud Mental", instructor: "Enf. Jefe Carlos Mendoza", modulos: 4, horas: 8, desc: "Observación clínica, desescalada verbal, contención segura y autocuidado." },
            ].map((c, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 hover:border-[#c5a044]/50 hover:shadow-lg transition-all group">
                <div className="text-4xl mb-4">{c.emoji}</div>
                <h3 className="font-bold text-lg mb-1 group-hover:text-[#c5a044] transition-colors">{c.titulo}</h3>
                <p className="text-sm text-[#c5a044] font-medium mb-2">{c.instructor}</p>
                <p className="text-sm text-slate-500 mb-4 leading-relaxed">{c.desc}</p>
                <div className="flex items-center gap-3 text-xs text-slate-400 mb-4">
                  <span className="flex items-center gap-1"><span className="material-icons-outlined text-sm">menu_book</span>{c.modulos} módulos</span>
                  <span className="flex items-center gap-1"><span className="material-icons-outlined text-sm">schedule</span>{c.horas}h</span>
                </div>
                <Link href="/registro" className="block w-full text-center py-2.5 rounded-xl bg-[#0f2847]/10 text-[#c5a044] font-bold text-sm hover:bg-[#c5a044] hover:text-white transition-all">
                  Inscribirme
                </Link>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link href="/cursos" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-[#0f2847] text-white font-bold hover:opacity-90 transition">
              Ver todos los cursos
              <span className="material-icons-outlined">arrow_forward</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Agente IA — Solo Aura */}
      <section className="py-20 bg-gradient-to-br from-[#0f172a] via-[#1e3a8a] to-[#0c4a6e]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full mb-6">
              <span className="material-icons-outlined text-[#c5a044] text-lg">smart_toy</span>
              <span className="text-sm text-white">Inteligencia Artificial</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
              Conoce a <span className="text-[#c5a044]">Aura</span>
            </h2>
            <p className="text-lg text-white/90 max-w-2xl mx-auto">
              Tu mentora virtual, disponible 24/7 por WhatsApp para guiarte en tu formación.
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-8 hover:border-[#c5a044]/30 transition-all duration-300 group hover:-translate-y-1 hover:shadow-xl">
              <div className="flex items-center gap-4 mb-5">
                <div className="relative shrink-0 w-16 h-16">
                  <div className="absolute -inset-1 rounded-xl bg-[#c5a044]/20 blur-lg animate-pulse" style={{animationDuration:"3s"}} />
                  <div className="absolute -inset-0.5 rounded-xl border border-[#c5a044]/30 animate-pulse" style={{animationDuration:"2s"}} />
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden border-2 border-[#c5a044]/40 shadow-lg" style={{animation:"breathe 4s ease-in-out infinite"}}>
                    <img src="/agents/aura.png" alt="Aura" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent" style={{animation:"shimmer 5s ease-in-out infinite"}} />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    Aura
                    <span className="px-2 py-0.5 bg-[#c5a044]/20 text-[#c5a044] text-[10px] font-bold rounded-full uppercase">Activo</span>
                  </h3>
                  <p className="text-sm text-[#c5a044]">Agente Académico — Mentora IA</p>
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4 mb-6">
                {[
                  { icon: "auto_stories", text: "Te enseña tema por tema de forma estructurada" },
                  { icon: "quiz", text: "Evalúa tu comprensión con preguntas" },
                  { icon: "trending_up", text: "Registra tu progreso automáticamente" },
                  { icon: "schedule", text: "Disponible 24/7 por WhatsApp" },
                ].map((f) => (
                  <div key={f.text} className="flex items-start gap-2">
                    <span className="material-icons-outlined text-[#c5a044] text-lg mt-0.5">{f.icon}</span>
                    <span className="text-white/80 text-sm">{f.text}</span>
                  </div>
                ))}
              </div>
              <a href="https://wa.me/12763294935?text=Hola%20Aura" target="_blank" rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#c5a044] text-[#0a1628] font-bold text-sm hover:bg-[#d4af37] transition">
                <span className="material-icons-outlined text-lg">chat</span>
                Hablar con Aura por WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="contacto" className="py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-extrabold mb-6">¿Listo para formarte en salud?</h2>
          <p className="text-xl text-slate-500 mb-10">Únete a quienes ya se están certificando con el respaldo de la inteligencia artificial.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/registro" className="px-10 py-5 rounded-full bg-[#0f2847] text-white font-extrabold text-xl hover:shadow-2xl hover:shadow-[#0f2847]/40 transition-all">Inscribirme Gratis</Link>
            <a href="https://wa.me/573146501052?text=Hola%2C%20quiero%20información%20sobre%20los%20cursos" target="_blank" rel="noopener noreferrer" className="px-10 py-5 rounded-full bg-[#c5a044] text-[#0a1628] font-extrabold text-xl hover:bg-[#d4af37] transition-all">💬 Más Información</a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-50 border-t border-slate-200 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-12 mb-16">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <img src="/logo-issi.png" alt="ISSI" className="w-10 h-10 rounded-full" />
                <span className="text-lg font-bold tracking-tight uppercase">ISSI</span>
              </div>
              <p className="text-slate-500 max-w-sm mb-6">Instituto Superior de Salud Integral — Centro de estudios en modalidad virtual. Formación en salud con inteligencia artificial.</p>
            </div>
            <div>
              <h5 className="font-bold mb-6">Plataforma</h5>
              <ul className="space-y-4 text-slate-500">
                <li><Link className="hover:text-[#c5a044]" href="/cursos">Cursos</Link></li>
                <li><Link className="hover:text-[#c5a044]" href="/registro">Registrarse</Link></li>
                <li><Link className="hover:text-[#c5a044]" href="/login">Iniciar Sesión</Link></li>
              </ul>
            </div>
            <div>
              <h5 className="font-bold mb-6">Contacto</h5>
              <ul className="space-y-4 text-slate-500">
                <li><a className="hover:text-[#c5a044]" href="https://wa.me/573146501052?text=Hola" target="_blank" rel="noopener noreferrer">+57 314 650 1052</a></li>
                <li><a className="hover:text-[#c5a044]" href="https://wa.me/12763294935?text=Hola" target="_blank" rel="noopener noreferrer">WhatsApp Aura (IA)</a></li>
                <li><a className="hover:text-[#c5a044]" href="mailto:contacto@issi.edu.co">contacto@issi.edu.co</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-slate-200 text-center">
            <p className="text-sm text-slate-500">© 2026 ISSI — Instituto Superior de Salud Integral. Todos los derechos reservados.</p>
            <p className="text-xs text-slate-400 mt-1">Powered by <span className="font-semibold text-[#c5a044]">AINovaX</span></p>
          </div>
        </div>
      </footer>
    </div>
  );
}
