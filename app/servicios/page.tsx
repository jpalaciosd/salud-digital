"use client";
import Link from "next/link";

export default function Servicios() {
  return (
    <div className="min-h-screen bg-[#fafaf7]" style={{ fontFamily: "'Manrope', sans-serif" }}>
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <img src="/logo-issi.png" alt="ISSI" className="w-10 h-10 rounded-full" />
            <span className="text-xl font-bold tracking-tight uppercase">ISSI</span>
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-sm font-semibold hover:text-[#c5a044] transition-colors">Inicio</Link>
            <Link href="/cursos" className="text-sm font-semibold hover:text-[#c5a044] transition-colors">Cursos</Link>
            <Link href="/login" className="text-sm font-semibold hover:text-[#c5a044] transition-colors">Iniciar Sesión</Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="py-20 bg-gradient-to-br from-[#0a1628] to-[#0f2847] text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6">Nuestros <span className="text-[#c5a044]">Servicios Educativos</span></h1>
          <p className="text-lg text-white/80 max-w-2xl mx-auto">Formación virtual en salud con metodología innovadora, asistida por inteligencia artificial.</p>
        </div>
      </section>

      {/* Servicios */}
      <section className="py-20 max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { icon: "school", titulo: "Cursos Virtuales en Salud", desc: "Programas de formación estructurados por módulos, con contenido teórico y práctico para profesionales y técnicos del área de la salud.", activo: true },
            { icon: "smart_toy", titulo: "Tutoría con IA (Aura)", desc: "Aprendizaje guiado por nuestra mentora virtual Aura a través de WhatsApp: enseñanza, evaluación y seguimiento de progreso automatizado.", activo: true },
            { icon: "workspace_premium", titulo: "Certificación Oficial", desc: "Al completar cada programa, recibe un certificado digital avalado por el Instituto Superior de Salud Integral.", activo: true },
            { icon: "groups", titulo: "Práctica Intensiva de Campo", desc: "Talleres presenciales con simulación de escenarios reales: CPR, DEA, vendajes, control de hemorragias y más.", activo: true },
            { icon: "video_call", titulo: "Teleconsulta Médica", desc: "Consultas por videollamada con profesionales de salud registrados. Próximamente disponible.", activo: false },
            { icon: "monitor_heart", titulo: "Monitoreo de Pacientes", desc: "Seguimiento continuo para pacientes con condiciones crónicas. En desarrollo.", activo: false },
          ].map((s, i) => (
            <div key={i} className={`p-8 rounded-2xl border ${s.activo ? "bg-white border-slate-100 hover:border-[#c5a044]/50" : "bg-slate-50 border-slate-100 opacity-60"} transition-all`}>
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 ${s.activo ? "bg-[#0f2847]/10" : "bg-slate-200"}`}>
                <span className={`material-icons-outlined ${s.activo ? "text-[#c5a044]" : "text-slate-400"}`}>{s.icon}</span>
              </div>
              <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                {s.titulo}
                {!s.activo && <span className="text-[10px] font-bold bg-amber-100 text-amber-600 px-2 py-0.5 rounded-full uppercase">Próximamente</span>}
              </h3>
              <p className="text-slate-500 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-[#0f2847] text-white text-center">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-3xl font-extrabold mb-4">¿Listo para comenzar?</h2>
          <p className="text-white/70 mb-8">Inscríbete ahora y empieza tu formación en salud con el respaldo de la IA.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/registro" className="px-8 py-4 rounded-xl bg-[#c5a044] text-[#0a1628] font-extrabold hover:bg-[#d4af37] transition-all">Inscribirme</Link>
            <Link href="/cursos" className="px-8 py-4 rounded-xl border-2 border-white/20 font-bold hover:bg-white/10 transition-all">Ver Cursos</Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-50 border-t border-slate-200 py-8">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-sm text-slate-500">© 2026 ISSI — Instituto Superior de Salud Integral. Todos los derechos reservados.</p>
          <p className="text-xs text-slate-400 mt-1">Powered by <span className="font-semibold text-[#c5a044]">AINovaX</span></p>
        </div>
      </footer>
    </div>
  );
}
