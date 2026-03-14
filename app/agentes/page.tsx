"use client";
import Link from "next/link";
import Image from "next/image";

const agentes = [
  {
    nombre: "Aura",
    rol: "Agente Académico",
    descripcion:
      "Tu mentora virtual de IFIAS. Aura te guía paso a paso por cada módulo de tu programa académico, enseña los temas con ejemplos prácticos, evalúa tu comprensión con preguntas de aplicación y registra tu progreso automáticamente en la plataforma.",
    avatar: "/agents/aura.png",
    color: "#1d4ed8",
    bgGradient: "from-blue-50 to-sky-50",
    borderColor: "border-blue-200",
    capacidades: [
      "Enseñanza personalizada tema por tema",
      "Evaluaciones prácticas de comprensión",
      "Progreso sincronizado con la plataforma",
      "Disponible 24/7 por WhatsApp",
      "Adaptación al ritmo del estudiante",
    ],
    canal: "WhatsApp",
    canalIcon: "chat",
    canalLink: "https://wa.me/12763294935?text=Hola%20Aura",
    estado: "Activo",
  },
  {
    nombre: "Dr. Nova",
    rol: "Agente Médico — Triage IA",
    descripcion:
      "Tu asistente de salud inteligente. Dr. Nova evalúa tus síntomas mediante una conversación guiada, consulta tu historia clínica y fórmulas activas, te recuerda tus medicamentos y te orienta hacia el profesional adecuado o agenda tu cita automáticamente.",
    avatar: "/agents/medico.png",
    color: "#0ea5e9",
    bgGradient: "from-sky-50 to-blue-50",
    borderColor: "border-sky-200",
    capacidades: [
      "Triage inteligente de síntomas",
      "Acceso a tu historia clínica y fórmulas",
      "Recordatorio de medicamentos",
      "Derivación al especialista adecuado",
      "Agendamiento automático de citas",
    ],
    canal: "WhatsApp",
    canalIcon: "medical_services",
    canalLink: "https://wa.me/17433306127?text=Hola%20Dr.%20Nova",
    estado: "Activo",
  },
];

export default function AgentesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e3a8a] to-[#0c4a6e]">
      {/* Header */}
      <header className="border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#1d4ed8] rounded-lg flex items-center justify-center">
              <span className="material-symbols-outlined text-white text-lg">cardiology</span>
            </div>
            <span className="text-lg font-bold text-white">
              Salud<span className="text-[#1d4ed8]">Digital</span>
            </span>
          </Link>
          <div className="flex gap-3">
            <Link href="/login" className="px-4 py-2 text-sm text-white/70 hover:text-white transition">
              Iniciar Sesión
            </Link>
            <Link href="/registro" className="px-4 py-2 bg-[#1d4ed8] text-white rounded-xl text-sm font-bold hover:bg-[#2563eb] transition">
              Registrarse
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 pt-16 pb-12 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full mb-6">
          <span className="material-symbols-outlined text-[#1d4ed8] text-lg">smart_toy</span>
          <span className="text-sm text-white/80">Inteligencia Artificial al servicio de tu salud</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Conoce a nuestros <span className="text-[#1d4ed8]">Agentes IA</span>
        </h1>
        <p className="text-lg text-white/60 max-w-2xl mx-auto">
          Dos asistentes inteligentes que te acompañan en tu formación académica y en tu bienestar de salud, disponibles 24/7 por WhatsApp.
        </p>
      </section>

      {/* Agents */}
      <section className="max-w-6xl mx-auto px-4 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {agentes.map((agente) => (
            <div
              key={agente.nombre}
              className="bg-white rounded-3xl overflow-hidden shadow-2xl shadow-black/20"
            >
              {/* Top section with avatar */}
              <div className={`bg-gradient-to-br ${agente.bgGradient} p-8 pb-6 relative`}>
                <div className="flex items-start gap-5">
                  <div className="w-24 h-24 md:w-28 md:h-28 rounded-2xl overflow-hidden border-4 border-white shadow-lg shrink-0">
                    <Image
                      src={agente.avatar}
                      alt={agente.nombre}
                      width={112}
                      height={112}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="pt-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h2 className="text-2xl md:text-3xl font-bold text-slate-900">{agente.nombre}</h2>
                      <span
                        className={`px-2.5 py-0.5 text-[10px] font-bold rounded-full uppercase ${
                          agente.estado === "Activo"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {agente.estado}
                      </span>
                    </div>
                    <p className="text-sm font-semibold" style={{ color: agente.color }}>
                      {agente.rol}
                    </p>
                    <p className="text-sm text-slate-600 mt-2 leading-relaxed">{agente.descripcion}</p>
                  </div>
                </div>
              </div>

              {/* Capabilities */}
              <div className="p-8 pt-6">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
                  Capacidades
                </h3>
                <div className="space-y-3">
                  {agente.capacidades.map((cap, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div
                        className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                        style={{ backgroundColor: agente.color + "15" }}
                      >
                        <span
                          className="material-symbols-outlined text-sm"
                          style={{ color: agente.color }}
                        >
                          check
                        </span>
                      </div>
                      <span className="text-sm text-slate-700">{cap}</span>
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <div className="mt-8">
                  {agente.estado === "Activo" ? (
                    <a
                      href={agente.canalLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-white text-sm transition hover:opacity-90"
                      style={{ backgroundColor: agente.color }}
                    >
                      <span className="material-symbols-outlined text-lg">{agente.canalIcon}</span>
                      Hablar con {agente.nombre} por WhatsApp
                    </a>
                  ) : (
                    <button
                      disabled
                      className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-white/60 text-sm bg-slate-300 cursor-not-allowed"
                    >
                      <span className="material-symbols-outlined text-lg">schedule</span>
                      Próximamente disponible
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* How it works */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            ¿Cómo <span className="text-[#1d4ed8]">funciona</span>?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                step: "1",
                icon: "person_add",
                title: "Regístrate",
                desc: "Crea tu cuenta en la plataforma con tu número de WhatsApp.",
              },
              {
                step: "2",
                icon: "school",
                title: "Inscríbete en un curso",
                desc: "Elige tu programa desde el dashboard y queda inscrito.",
              },
              {
                step: "3",
                icon: "chat",
                title: "Escribe al agente",
                desc: "Envía un mensaje por WhatsApp y el agente te guía automáticamente.",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center"
              >
                <div className="w-12 h-12 bg-[#1d4ed8]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="material-symbols-outlined text-[#1d4ed8] text-2xl">
                    {item.icon}
                  </span>
                </div>
                <div className="inline-flex items-center justify-center w-7 h-7 bg-[#1d4ed8] rounded-full text-white font-bold text-xs mb-3">
                  {item.step}
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                <p className="text-sm text-white/60">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-16 text-center">
          <p className="text-white/30 text-xs">
            © 2026 SaludDigital — Powered by{" "}
            <span className="font-semibold text-[#1d4ed8]">AINovaX</span>
          </p>
        </div>
      </section>
    </div>
  );
}
