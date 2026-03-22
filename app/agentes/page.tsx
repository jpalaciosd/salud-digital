"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef } from "react";

const agentes = [
  {
    nombre: "Aura",
    rol: "Agente Académico",
    descripcion:
      "Tu mentora virtual de IFIAS. Aura te guía paso a paso por cada módulo de tu programa académico, enseña los temas con ejemplos prácticos, evalúa tu comprensión con preguntas de aplicación y registra tu progreso automáticamente en la plataforma.",
    avatar: "/agents/aura.png",
    color: "#1d4ed8",
    glowColor: "rgba(29,78,216,0.4)",
    ringColor: "rgba(29,78,216,0.3)",
    capacidades: [
      "Enseñanza personalizada tema por tema",
      "Evaluaciones prácticas de comprensión",
      "Progreso sincronizado con la plataforma",
      "Disponible 24/7 por WhatsApp",
      "Adaptación al ritmo del estudiante",
    ],
    canalLink: "https://wa.me/12763294935?text=Hola%20Aura",
    canalIcon: "chat",
    estado: "Activo",
  },
  {
    nombre: "Dr. Nova",
    rol: "Agente Médico — Triage IA",
    descripcion:
      "Tu asistente de salud inteligente. Dr. Nova evalúa tus síntomas mediante una conversación guiada, consulta tu historia clínica y fórmulas activas, te recuerda tus medicamentos y te orienta hacia el profesional adecuado o agenda tu cita automáticamente.",
    avatar: "/agents/medico.png",
    color: "#0ea5e9",
    glowColor: "rgba(14,165,233,0.4)",
    ringColor: "rgba(14,165,233,0.3)",
    capacidades: [
      "Triage inteligente de síntomas",
      "Acceso a tu historia clínica y fórmulas",
      "Recordatorio de medicamentos",
      "Derivación al especialista adecuado",
      "Agendamiento automático de citas",
    ],
    canalLink: "https://wa.me/17433306127?text=Hola%20Dr.%20Nova",
    canalIcon: "medical_services",
    estado: "Activo",
  },
];

function AvatarCard({ agente }: { agente: typeof agentes[0] }) {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -8;
      const rotateY = ((x - centerX) / centerX) * 8;
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02,1.02,1.02)`;
    };

    const handleMouseLeave = () => {
      card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)";
    };

    card.addEventListener("mousemove", handleMouseMove);
    card.addEventListener("mouseleave", handleMouseLeave);
    return () => {
      card.removeEventListener("mousemove", handleMouseMove);
      card.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <div
      ref={cardRef}
      className="group bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden transition-all duration-300 ease-out hover:border-white/20 hover:shadow-2xl"
      style={{ transformStyle: "preserve-3d" }}
    >
      {/* Avatar section */}
      <div className="relative p-8 pb-4 flex flex-col items-center">
        {/* Animated avatar container */}
        <div className="relative w-40 h-40 md:w-48 md:h-48">
          {/* Orbiting sparkles — always active */}
          <div className="absolute inset-0 animate-orbit" style={{ animationDuration: "10s" }}>
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: agente.color, boxShadow: `0 0 8px ${agente.glowColor}` }} />
          </div>
          <div className="absolute inset-0 animate-orbit animation-delay-3000" style={{ animationDuration: "14s" }}>
            <div className="w-1.5 h-1.5 rounded-full bg-white/60" style={{ boxShadow: `0 0 6px white` }} />
          </div>
          <div className="absolute inset-0 animate-orbit animation-delay-1500" style={{ animationDuration: "18s", animationDirection: "reverse" }}>
            <div className="w-1 h-1 rounded-full" style={{ backgroundColor: agente.color, boxShadow: `0 0 4px ${agente.glowColor}` }} />
          </div>

          {/* Pulsating glow — always active */}
          <div
            className="absolute -inset-3 rounded-full blur-2xl animate-glow-pulse"
            style={{ backgroundColor: agente.glowColor }}
          />

          {/* Heartbeat ring — always active */}
          <div
            className="absolute -inset-2 rounded-full animate-heartbeat-ring"
            style={{ border: `2px solid ${agente.ringColor}`, "--ring-color": agente.glowColor } as React.CSSProperties}
          />
          <div
            className="absolute -inset-5 rounded-full animate-heartbeat-ring animation-delay-1000"
            style={{ border: `1px solid ${agente.ringColor}`, "--ring-color": agente.glowColor } as React.CSSProperties}
          />

          {/* Sparkle dots — always active */}
          <div className="absolute -top-1 right-2 w-2 h-2 rounded-full animate-sparkle" style={{ backgroundColor: agente.color, boxShadow: `0 0 6px ${agente.glowColor}` }} />
          <div className="absolute bottom-2 -left-1 w-1.5 h-1.5 rounded-full animate-sparkle animation-delay-1000" style={{ backgroundColor: agente.color, boxShadow: `0 0 4px ${agente.glowColor}` }} />
          <div className="absolute top-4 -right-2 w-1 h-1 rounded-full animate-sparkle animation-delay-2000" style={{ backgroundColor: "white", boxShadow: "0 0 4px white" }} />

          {/* Avatar image with breathing + float */}
          <div className="absolute inset-0 rounded-full overflow-hidden border-4 border-white/20 group-hover:border-white/50 transition-all duration-500 shadow-2xl animate-breathe" style={{ animationDuration: "4s" }}>
            <div className="w-full h-full animate-float" style={{ animationDuration: "6s" }}>
              <Image
                src={agente.avatar}
                alt={agente.nombre}
                width={192}
                height={192}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              {/* Shimmer effect — always active */}
              <div className="absolute inset-0 overflow-hidden rounded-full">
                <div
                  className="absolute -inset-full w-[200%] h-full bg-gradient-to-r from-transparent via-white/15 to-transparent animate-shimmer"
                  style={{ animationDuration: "5s" }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Status indicator */}
        <div className="mt-4 flex items-center gap-2">
          <div className="relative flex items-center justify-center">
            <div className="w-2.5 h-2.5 rounded-full bg-green-400 animate-pulse" />
            <div className="absolute w-2.5 h-2.5 rounded-full bg-green-400 animate-ping" />
          </div>
          <span className="text-[11px] font-bold text-green-400 uppercase tracking-wider">{agente.estado}</span>
        </div>

        {/* Name and role */}
        <h2 className="text-3xl font-bold text-white mt-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-sky-200 transition-all duration-500">
          {agente.nombre}
        </h2>
        <p className="text-sm font-semibold mt-1" style={{ color: agente.color }}>
          {agente.rol}
        </p>
        <p className="text-sm text-white/60 mt-3 text-center leading-relaxed max-w-sm">
          {agente.descripcion}
        </p>
      </div>

      {/* Capabilities with stagger animation */}
      <div className="px-8 pt-2 pb-4">
        <h3 className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mb-3 text-center">
          Capacidades
        </h3>
        <div className="space-y-2">
          {agente.capacidades.map((cap, i) => (
            <div
              key={i}
              className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-white/[0.03] group-hover:bg-white/[0.06] transition-all duration-300 group-hover:translate-x-1"
              style={{ transitionDelay: `${i * 60}ms` }}
            >
              <div
                className="w-5 h-5 rounded-md flex items-center justify-center shrink-0 opacity-60 group-hover:opacity-100 transition-opacity duration-300"
                style={{ backgroundColor: agente.color + "20" }}
              >
                <span className="material-symbols-outlined text-xs" style={{ color: agente.color }}>
                  check
                </span>
              </div>
              <span className="text-sm text-white/70 group-hover:text-white/90 transition-colors duration-300">{cap}</span>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="px-8 pb-8 pt-4">
        <a
          href={agente.canalLink}
          target="_blank"
          rel="noopener noreferrer"
          className="relative w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-white text-sm overflow-hidden group/btn transition-all duration-300 hover:shadow-lg"
          style={{ backgroundColor: agente.color }}
        >
          <div className="absolute inset-0 bg-white/0 group-hover/btn:bg-white/10 transition-colors duration-300" />
          <span className="absolute -inset-1 rounded-2xl opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500 blur-xl" style={{ backgroundColor: agente.glowColor }} />
          <span className="material-symbols-outlined text-lg relative z-10">{agente.canalIcon}</span>
          <span className="relative z-10">Hablar con {agente.nombre} por WhatsApp</span>
        </a>
      </div>
    </div>
  );
}

export default function AgentesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e3a8a] to-[#0c4a6e] relative overflow-hidden">
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-blob" />
        <div className="absolute top-40 right-20 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl animate-blob animation-delay-4000" />
      </div>

      {/* Custom animations */}
      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        @keyframes breathe {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.03); }
        }
        @keyframes ping-slow {
          0% { transform: scale(1); opacity: 0.5; }
          100% { transform: scale(1.8); opacity: 0; }
        }
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        @keyframes shimmer {
          0% { transform: translateX(-150%) rotate(25deg); }
          100% { transform: translateX(150%) rotate(25deg); }
        }
        @keyframes heartbeat-ring {
          0% { transform: scale(1); opacity: 0.6; box-shadow: 0 0 0 0 var(--ring-color); }
          50% { transform: scale(1.05); opacity: 0.3; box-shadow: 0 0 20px 10px var(--ring-color); }
          100% { transform: scale(1); opacity: 0.6; box-shadow: 0 0 0 0 var(--ring-color); }
        }
        @keyframes sparkle {
          0%, 100% { opacity: 0; transform: scale(0) rotate(0deg); }
          50% { opacity: 1; transform: scale(1) rotate(180deg); }
        }
        @keyframes orbit {
          0% { transform: rotate(0deg) translateX(80px) rotate(0deg); }
          100% { transform: rotate(360deg) translateX(80px) rotate(-360deg); }
        }
        @keyframes glow-pulse {
          0%, 100% { opacity: 0.3; transform: scale(0.95); }
          50% { opacity: 0.6; transform: scale(1.05); }
        }
        .animate-float { animation: float 4s ease-in-out infinite; }
        .animate-breathe { animation: breathe 4s ease-in-out infinite; }
        .animate-ping-slow { animation: ping-slow 2s cubic-bezier(0, 0, 0.2, 1) infinite; }
        .animate-blob { animation: blob 8s infinite; }
        .animate-shimmer { animation: shimmer 4s ease-in-out infinite; }
        .animate-heartbeat-ring { animation: heartbeat-ring 3s ease-in-out infinite; }
        .animate-sparkle { animation: sparkle 3s ease-in-out infinite; }
        .animate-orbit { animation: orbit 12s linear infinite; }
        .animate-glow-pulse { animation: glow-pulse 3s ease-in-out infinite; }
        .animation-delay-500 { animation-delay: 0.5s; }
        .animation-delay-1000 { animation-delay: 1s; }
        .animation-delay-1500 { animation-delay: 1.5s; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-3000 { animation-delay: 3s; }
        .animation-delay-4000 { animation-delay: 4s; }
      `}</style>

      {/* Header */}
      <header className="border-b border-white/10 relative z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#1d4ed8] rounded-lg flex items-center justify-center">
              <span className="material-symbols-outlined text-white text-lg">cardiology</span>
            </div>
            <span className="text-lg font-bold text-white">
              Salud<span className="text-sky-300">Digital</span>
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
      <section className="max-w-6xl mx-auto px-4 pt-16 pb-12 text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full mb-6 backdrop-blur-sm">
          <span className="material-symbols-outlined text-sky-300 text-lg">smart_toy</span>
          <span className="text-sm text-white/80">Inteligencia Artificial al servicio de tu salud</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Conoce a nuestros <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-sky-300">Agentes IA</span>
        </h1>
        <p className="text-lg text-white/60 max-w-2xl mx-auto">
          Asistentes inteligentes que te acompañan en tu formación académica y bienestar de salud. Pasa el cursor sobre ellos.
        </p>
      </section>

      {/* Agents */}
      <section className="max-w-5xl mx-auto px-4 pb-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {agentes.map((agente) => (
            <AvatarCard key={agente.nombre} agente={agente} />
          ))}
        </div>

        {/* How it works */}
        <div className="mt-24">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            ¿Cómo <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-sky-300">funciona</span>?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { step: "1", icon: "person_add", title: "Regístrate", desc: "Crea tu cuenta en la plataforma con tu número de WhatsApp." },
              { step: "2", icon: "school", title: "Inscríbete en un curso", desc: "Elige tu programa desde el dashboard y queda inscrito." },
              { step: "3", icon: "chat", title: "Escribe al agente", desc: "Envía un mensaje por WhatsApp y el agente te guía automáticamente." },
            ].map((item) => (
              <div key={item.step} className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center backdrop-blur-sm hover:bg-white/10 transition-all duration-300 hover:-translate-y-1">
                <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="material-symbols-outlined text-sky-300 text-2xl">{item.icon}</span>
                </div>
                <div className="inline-flex items-center justify-center w-7 h-7 bg-[#1d4ed8] rounded-full text-white font-bold text-xs mb-3">{item.step}</div>
                <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                <p className="text-sm text-white/60">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 text-center">
          <p className="text-white/30 text-xs">
            © 2026 SaludDigital — Powered by <span className="font-semibold text-[#1d4ed8]">AINovaX</span>
          </p>
        </div>
      </section>
    </div>
  );
}
