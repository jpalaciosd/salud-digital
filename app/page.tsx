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
      <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-[#1d4ed8]/10">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/logo-issi.png" alt="ISSI" className="w-12 h-12 rounded-full" />
            <span className="text-xl font-bold tracking-tight uppercase">ISSI</span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-sm font-semibold hover:text-[#1d4ed8] transition-colors">Inicio</Link>
            <Link href="#servicios" className="text-sm font-semibold hover:text-[#1d4ed8] transition-colors">Servicios</Link>
            <Link href="/cursos" className="text-sm font-semibold hover:text-[#1d4ed8] transition-colors">Cursos</Link>
            <Link href="/agentes" className="text-sm font-semibold hover:text-[#1d4ed8] transition-colors">Agentes IA</Link>
            <Link href="#contacto" className="text-sm font-semibold hover:text-[#1d4ed8] transition-colors">Contacto</Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/login" className="px-6 py-2.5 rounded-full bg-[#1d4ed8] text-white font-bold text-sm hover:opacity-90 transition-all shadow-lg shadow-[#1d4ed8]/20">
              Iniciar Sesión
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden hero-gradient py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1d4ed8]/10 border border-[#1d4ed8]/20 text-[#0369a1] text-xs font-bold uppercase tracking-wider">
              <span className="material-icons-outlined text-sm">verified_user</span>
              Cuidado Primario en Colombia
            </div>
            <h1 className="text-5xl lg:text-7xl font-extrabold leading-tight">
              Salud Humana <br /><span className="text-[#1d4ed8]">Potenciada</span> por Tecnología
            </h1>
            <p className="text-lg text-slate-600 max-w-lg leading-relaxed">
              Transformamos la atención médica en Colombia a través de un modelo híbrido que prioriza la empatía humana y la precisión digital para pacientes crónicos.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/registro" className="px-8 py-4 rounded-xl bg-[#1d4ed8] text-white font-bold text-lg hover:scale-105 transition-transform flex items-center justify-center gap-2">
                Registrarme
                <span className="material-icons-outlined">arrow_forward</span>
              </Link>
              <Link href="/cursos" className="px-8 py-4 rounded-xl border-2 border-slate-200 font-bold text-lg hover:bg-slate-50 transition-colors text-center">
                Ver Cursos de Salud
              </Link>
            </div>
            <div className="flex items-center gap-4 pt-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <span className="material-icons-outlined text-[#1d4ed8] text-lg">verified</span>
                  <span className="material-icons-outlined text-[#1d4ed8] text-lg">lock</span>
                  <span className="material-icons-outlined text-[#1d4ed8] text-lg">shield</span>
                </div>
                <p className="text-sm font-medium text-slate-500">Datos protegidos con cifrado · Conforme a <span className="text-slate-900 font-bold">Ley 1581</span></p>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-[#1d4ed8]/20 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-[#1d4ed8]/30 rounded-full blur-3xl"></div>
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
              <img className="w-full aspect-[4/5] object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAp7lYYy9rZlBvzAN2qZnUIn9_YCiqMCU-uBxNpUVrrcb2n98bR-yFnjZaneYrNwD9AoESnmyuSUYTN95ILXfzSCwhZBlmzYWK0I0JapkCliNrtfFSPBkwxuiuurN31-5WVTzBJtqQSlokDch8ryOvMQkqnfLHqtOXPDoXJjQQk4d9eOrvaSW0q689gv72Io5Kgq9arAT-iupSyr0-ZA1HVi-7ZnBlF-UXdHLLexubIPpAucPMFUCitzZvZld4x4W-he-tHKb_B6PpQ" alt="Doctor con paciente" />
            </div>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="py-12 bg-white border-y border-[#1d4ed8]/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { icon: "school", num: "4", label: "Cursos disponibles" },
              { icon: "smart_toy", num: "2", label: "Agentes IA activos" },
              { icon: "lock", num: "100%", label: "Datos cifrados" },
              { icon: "video_call", num: "24/7", label: "Teleconsulta disponible" },
            ].map((item) => (
              <div key={item.label} className="flex flex-col items-center gap-1">
                <span className="material-icons-outlined text-[#1d4ed8] text-2xl">{item.icon}</span>
                <span className="text-2xl font-extrabold text-slate-900">{item.num}</span>
                <span className="text-xs text-slate-400 font-medium">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pilares */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl font-bold mb-4">Nuestros Pilares Fundamentales</h2>
          <p className="text-slate-500">Un enfoque integral que combina la calidez del trato humano con la eficiencia de las herramientas digitales más avanzadas.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { icon: "favorite", titulo: "Humanidad", desc: "Cuidado centrado en la persona. Entendemos que detrás de cada diagnóstico hay una historia y un ser humano que merece empatía." },
            { icon: "gavel", titulo: "Honestidad", desc: "Transparencia total en procesos médicos y costos. Comunicación clara y directa sobre su estado de salud y opciones de tratamiento." },
            { icon: "devices", titulo: "Tecnología", desc: "Monitoreo remoto de última generación y telemedicina accesible desde cualquier lugar de Colombia, 24/7." },
          ].map((item, i) => (
            <div key={i} className="p-8 rounded-2xl bg-white border border-slate-100 hover:border-[#1d4ed8]/50 transition-all group">
              <div className="w-14 h-14 bg-[#1d4ed8]/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-[#1d4ed8] transition-colors">
                <span className="material-icons-outlined text-[#1d4ed8] group-hover:text-white">{item.icon}</span>
              </div>
              <h3 className="text-xl font-bold mb-3">{item.titulo}</h3>
              <p className="text-slate-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Servicios Especializados */}
      <section id="servicios" className="py-24 bg-[white] text-white rounded-[3rem] mx-4 mb-24 overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <h2 className="text-4xl font-bold mb-12 leading-tight text-center">Servicios de Salud <span className="text-[#1d4ed8]">Especializados</span></h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { num: "01", titulo: "Teleconsulta Médica", desc: "Consultas por videollamada con profesionales de salud registrados, desde cualquier lugar de Colombia.", activo: true },
              { num: "02", titulo: "Triage IA por WhatsApp", desc: "Nuestro agente Dr. Nova evalúa tus síntomas, revisa tu historial y te conecta con el profesional adecuado.", activo: true },
              { num: "03", titulo: "Historia Clínica Digital", desc: "Tu historial médico, fórmulas y citas en un solo lugar, accesible para ti y tu médico tratante de forma segura.", activo: true },
              { num: "04", titulo: "Cursos de Salud con IA", desc: "Programas de formación guiados por Aura, nuestra mentora IA, con evaluación y certificado digital.", activo: true },
              { num: "05", titulo: "Gestión de Fórmulas Médicas", desc: "Prescripción digital de medicamentos por parte del médico, con detalle de dosis y frecuencia.", activo: true },
              { num: "06", titulo: "Monitoreo de Crónicos", desc: "Seguimiento continuo para pacientes con diabetes, hipertensión y enfermedades respiratorias.", activo: false },
            ].map((s, i) => (
              <div key={i} className="flex gap-4 items-start p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors relative">
                <div className="w-12 h-12 shrink-0 bg-[#1d4ed8] text-white rounded-lg flex items-center justify-center font-bold">{s.num}</div>
                <div>
                  <h4 className="font-bold text-xl mb-2 flex items-center gap-2">
                    {s.titulo}
                    {!s.activo && <span className="text-[10px] font-bold bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full uppercase">Próximamente</span>}
                  </h4>
                  <p className="text-slate-400">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sedes */}
      <section id="sedes" className="py-24 max-w-7xl mx-auto px-6">
        <div className="bg-white rounded-[2rem] p-8 lg:p-12 shadow-sm border border-slate-100 flex flex-col lg:flex-row gap-12">
          <div className="lg:w-1/3">
            <h2 className="text-3xl font-bold mb-6 leading-tight">Presencia en <br />toda Colombia</h2>
            <p className="text-slate-500 mb-8">Nuestra red de atención se extiende por las principales ciudades, con centros de toma de muestras y atención especializada.</p>
            <div className="space-y-4">
              {["Bogotá D.C.", "Medellín", "Cali", "Barranquilla"].map((city) => (
                <div key={city} className="flex items-center gap-3">
                  <span className="material-icons-outlined text-[#1d4ed8]">location_on</span>
                  <span className="font-semibold">{city}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="lg:w-2/3 h-96 lg:h-auto min-h-[400px] rounded-2xl overflow-hidden bg-slate-100 relative">
            <img className="absolute inset-0 w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuADzwhvQ8aDKiK5jpB0UOTOkaVfxu_73k8s3XmpdqgKGmONbP6lgfN7YJ7bnCrR89qCxqWE3Cz7ZivPwmBfqlgrjb0UZkuZwwXDhcYpBFpBiCal4KSHYGW7_OSL4brg-LbI42OpYa1CcVTm1QCZmqsoRm6ZLMxHuehbavo7sD330QmlWpTD3ONVK0798zpbvbCefOv3jT-isSUDQEOYatWnZ3Zch5qt20VSseoTP1aCc51jAaVZ7MSQhSvVA8236xxJlJVfNfI3qhcz" alt="Mapa Colombia" />
          </div>
        </div>
      </section>

      {/* Cursos Disponibles */}
      <section className="py-24 bg-[#f1f5f9]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-extrabold mb-4">Nuestros <span className="text-[#1d4ed8]">Cursos</span></h2>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto">Programas de formación en salud guiados por profesionales y asistidos por inteligencia artificial. Aprende a tu ritmo, desde cualquier lugar.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { emoji: "🩺", titulo: "Taller de Primeros Auxilios", instructor: "Dra. María López", modulos: 8, horas: 8, desc: "Técnicas esenciales de primeros auxilios para situaciones de emergencia." },
              { emoji: "🛡️", titulo: "Taller: Seguridad del Paciente", instructor: "Dr. Roberto Sánchez", modulos: 6, horas: 6, desc: "Protocolos de seguridad clínica y prevención de eventos adversos." },
              { emoji: "🧠", titulo: "Salud Mental y Manejo de Crisis", instructor: "Ps. Andrea Martínez", modulos: 4, horas: 6, desc: "Estrategias de regulación emocional, grounding y primeros auxilios psicológicos." },
              { emoji: "🩺", titulo: "Técnico de Enfermería en Salud Mental", instructor: "Enf. Jefe Carlos Mendoza", modulos: 4, horas: 8, desc: "Observación clínica, desescalada verbal, contención segura y autocuidado." },
            ].map((c, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 hover:border-[#1d4ed8]/50 hover:shadow-lg transition-all group">
                <div className="text-4xl mb-4">{c.emoji}</div>
                <h3 className="font-bold text-lg mb-1 group-hover:text-[#1d4ed8] transition-colors">{c.titulo}</h3>
                <p className="text-sm text-[#1d4ed8] font-medium mb-2">{c.instructor}</p>
                <p className="text-sm text-slate-500 mb-4 leading-relaxed">{c.desc}</p>
                <div className="flex items-center gap-3 text-xs text-slate-400 mb-4">
                  <span className="flex items-center gap-1"><span className="material-icons-outlined text-sm">menu_book</span>{c.modulos} módulos</span>
                  <span className="flex items-center gap-1"><span className="material-icons-outlined text-sm">schedule</span>{c.horas}h</span>
                </div>
                <Link href="/registro" className="block w-full text-center py-2.5 rounded-xl bg-[#1d4ed8]/10 text-[#1d4ed8] font-bold text-sm hover:bg-[#1d4ed8] hover:text-white transition-all">
                  Inscribirme
                </Link>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link href="/cursos" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-[#1d4ed8] text-white font-bold hover:opacity-90 transition">
              Ver todos los cursos
              <span className="material-icons-outlined">arrow_forward</span>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="contacto" className="py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-extrabold mb-6">¿Listo para transformar tu cuidado de salud?</h2>
          <p className="text-xl text-slate-500 mb-10">Únete a quienes ya gestionan su salud de manera inteligente y humana.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/registro" className="px-10 py-5 rounded-full bg-[#1d4ed8] text-white font-extrabold text-xl hover:shadow-2xl hover:shadow-[#1d4ed8]/40 transition-all">Registrarme Gratis</Link>
            <a href="https://wa.me/12763294935?text=Hola%2C%20quiero%20información" target="_blank" rel="noopener noreferrer" className="px-10 py-5 rounded-full bg-slate-800 text-white font-extrabold text-xl hover:bg-slate-700 transition-all">💬 Hablar con Asesor IA</a>
          </div>
        </div>
      </section>

      {/* AI Agents Section */}
      <section className="py-20 bg-gradient-to-br from-[#0f172a] via-[#1e3a8a] to-[#0c4a6e]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full mb-6">
              <span className="material-icons-outlined text-sky-200 text-lg">smart_toy</span>
              <span className="text-sm text-white">Inteligencia Artificial</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
              Nuestros <span className="text-sky-200">Agentes IA</span>
            </h2>
            <p className="text-lg text-white/90 max-w-2xl mx-auto">
              Asistentes inteligentes que te acompañan en tu formación y bienestar de salud, disponibles 24/7.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Aura */}
            <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-8 hover:border-[#1d4ed8]/30 transition-all duration-300 group hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-500/10">
              <div className="flex items-center gap-4 mb-5">
                <div className="relative shrink-0 w-16 h-16">
                  <div className="absolute -inset-1 rounded-xl bg-[#1d4ed8]/20 blur-lg animate-pulse" style={{animationDuration:"3s"}} />
                  <div className="absolute -inset-0.5 rounded-xl border border-[#1d4ed8]/30 animate-pulse" style={{animationDuration:"2s"}} />
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden border-2 border-[#1d4ed8]/40 shadow-lg shadow-blue-500/20" style={{animation:"breathe 4s ease-in-out infinite"}}>
                    <img src="/agents/aura.png" alt="Aura" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent" style={{animation:"shimmer 5s ease-in-out infinite"}} />
                  </div>
                  <div className="absolute -top-1 -right-1 w-1.5 h-1.5 rounded-full bg-blue-400" style={{animation:"sparkle 3s ease-in-out infinite", boxShadow:"0 0 4px rgba(29,78,216,0.5)"}} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    Aura
                    <span className="px-2 py-0.5 bg-blue-400/20 text-blue-300 text-[10px] font-bold rounded-full uppercase">Activo</span>
                  </h3>
                  <p className="text-sm text-sky-200">Agente Académico</p>
                </div>
              </div>
              <p className="text-sm text-white/90 mb-6 leading-relaxed">
                Tu mentora virtual. Te guía paso a paso por cada módulo, evalúa tu comprensión y registra tu progreso automáticamente.
              </p>
              <a href="https://wa.me/12763294935?text=Hola%20Aura" target="_blank" rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#1d4ed8] text-white font-bold text-sm hover:opacity-90 transition">
                <span className="material-icons-outlined text-lg">chat</span>
                Hablar con Aura
              </a>
            </div>

            {/* Dr. Nova */}
            <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-8 hover:border-sky-400/30 transition-all duration-300 group hover:-translate-y-1 hover:shadow-xl hover:shadow-sky-500/10">
              <div className="flex items-center gap-4 mb-5">
                <div className="relative shrink-0 w-16 h-16">
                  <div className="absolute -inset-1 rounded-xl bg-sky-400/20 blur-lg animate-pulse" style={{animationDuration:"3s",animationDelay:"1s"}} />
                  <div className="absolute -inset-0.5 rounded-xl border border-sky-400/30 animate-pulse" style={{animationDuration:"2s",animationDelay:"0.5s"}} />
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden border-2 border-sky-400/40 shadow-lg shadow-sky-500/20" style={{animation:"breathe 4s ease-in-out infinite",animationDelay:"1s"}}>
                    <img src="/agents/medico.png" alt="Dr. Nova" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent" style={{animation:"shimmer 5s ease-in-out infinite",animationDelay:"2s"}} />
                  </div>
                  <div className="absolute -top-1 -right-1 w-1.5 h-1.5 rounded-full bg-sky-400" style={{animation:"sparkle 3s ease-in-out infinite",animationDelay:"1.5s",boxShadow:"0 0 4px rgba(14,165,233,0.5)"}} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    Dr. Nova
                    <span className="px-2 py-0.5 bg-blue-400/20 text-blue-300 text-[10px] font-bold rounded-full uppercase">Activo</span>
                  </h3>
                  <p className="text-sm text-sky-200">Agente Médico — Triage IA</p>
                </div>
              </div>
              <p className="text-sm text-white/90 mb-6 leading-relaxed">
                Tu asistente de salud. Evalúa síntomas, consulta tu historial clínico, recuerda tus medicamentos y te conecta con el profesional indicado.
              </p>
              <a
                href="https://wa.me/17433306127?text=Hola%20Dr.%20Nova"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-sky-500 text-white font-bold text-sm hover:opacity-90 transition"
              >
                <span className="material-icons-outlined text-lg">medical_services</span>
                Hablar con Dr. Nova
              </a>
            </div>
          </div>

          <div className="text-center mt-10">
            <Link href="/agentes" className="inline-flex items-center gap-2 text-sky-200 font-bold text-sm hover:underline hover:text-white">
              Ver más sobre nuestros agentes
              <span className="material-icons-outlined text-lg">arrow_forward</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-50 border-t border-slate-200 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-2">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 bg-[#1d4ed8] rounded-md flex items-center justify-center">
                  <span className="material-icons-outlined text-white text-sm">health_and_safety</span>
                </div>
                <span className="text-lg font-bold tracking-tight uppercase">Salud<span className="text-[#1d4ed8]">Digital</span></span>
              </div>
              <p className="text-slate-500 max-w-sm mb-6">Plataforma de salud digital en Colombia. Teleconsultas, formación con IA y gestión clínica en un solo lugar.</p>
            </div>
            <div>
              <h5 className="font-bold mb-6">Plataforma</h5>
              <ul className="space-y-4 text-slate-500">
                <li><Link className="hover:text-[#1d4ed8]" href="/cursos">Cursos</Link></li>
                <li><Link className="hover:text-[#1d4ed8]" href="/agentes">Agentes IA</Link></li>
                <li><Link className="hover:text-[#1d4ed8]" href="/registro">Registrarse</Link></li>
                <li><Link className="hover:text-[#1d4ed8]" href="/login">Iniciar Sesión</Link></li>
              </ul>
            </div>
            <div>
              <h5 className="font-bold mb-6">Contacto</h5>
              <ul className="space-y-4 text-slate-500">
                <li><a className="hover:text-[#1d4ed8]" href="https://wa.me/12763294935?text=Hola" target="_blank" rel="noopener noreferrer">WhatsApp Aura</a></li>
                <li><a className="hover:text-[#1d4ed8]" href="https://wa.me/17433306127?text=Hola" target="_blank" rel="noopener noreferrer">WhatsApp Dr. Nova</a></li>
                <li><a className="hover:text-[#1d4ed8]" href="mailto:contacto@saluddigital.co">contacto@saluddigital.co</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-slate-200 text-center">
            <p className="text-sm text-slate-500">© 2026 ISSI — Instituto Superior de Salud Integral. Todos los derechos reservados.</p>
            <p className="text-xs text-slate-400 mt-1">Powered by <span className="font-semibold text-[#1d4ed8]">AINovaX</span></p>
          </div>
        </div>
      </footer>
    </div>
  );
}
