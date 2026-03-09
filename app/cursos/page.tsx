"use client";
import Link from "next/link";
import { useAuth } from "@/lib/AuthContext";
import UserNav from "@/lib/UserNav";

const cursos = [
  { id: 1, titulo: "Primeros Auxilios Básicos", desc: "Aprende técnicas esenciales de primeros auxilios para responder ante emergencias médicas comunes.", modulos: 12, duracion: "24 horas", nivel: "Básico", instructor: "Dra. María López", img: "🩺", precio: "Gratis", tag: "Popular" },
  { id: 2, titulo: "Nutrición y Dieta Saludable", desc: "Descubre los fundamentos de una alimentación balanceada y cómo diseñar planes nutricionales.", modulos: 8, duracion: "16 horas", nivel: "Básico", instructor: "Dr. Andrés Gómez", img: "🥗", precio: "$120.000", tag: "" },
  { id: 3, titulo: "Manejo del Estrés y Ansiedad", desc: "Técnicas probadas para gestionar el estrés y mejorar tu bienestar emocional en el día a día.", modulos: 10, duracion: "20 horas", nivel: "Intermedio", instructor: "Dra. Laura Martínez", img: "🧘", precio: "$89.000", tag: "Nuevo" },
  { id: 4, titulo: "Cuidado del Paciente Crónico", desc: "Formación completa sobre el manejo y acompañamiento de pacientes con enfermedades crónicas.", modulos: 6, duracion: "12 horas", nivel: "Avanzado", instructor: "Dr. Alejandro Posada", img: "❤️", precio: "$150.000", tag: "" },
  { id: 5, titulo: "Salud Mental y Bienestar", desc: "Comprende los aspectos fundamentales de la salud mental y aprende estrategias de autocuidado.", modulos: 9, duracion: "18 horas", nivel: "Básico", instructor: "Dra. Carolina Vélez", img: "🧠", precio: "Gratis", tag: "Popular" },
  { id: 6, titulo: "Prevención de Enfermedades", desc: "Conoce las principales estrategias de prevención y detección temprana de enfermedades comunes.", modulos: 7, duracion: "14 horas", nivel: "Básico", instructor: "Dr. Felipe Ríos", img: "🛡️", precio: "$75.000", tag: "" },
  { id: 7, titulo: "Farmacología Básica", desc: "Introducción a los principios farmacológicos y el uso responsable de medicamentos.", modulos: 10, duracion: "20 horas", nivel: "Intermedio", instructor: "Dra. Patricia Sánchez", img: "💊", precio: "$130.000", tag: "" },
  { id: 8, titulo: "Atención Prehospitalaria", desc: "Protocolos y procedimientos para la atención de emergencias antes de llegar al hospital.", modulos: 15, duracion: "30 horas", nivel: "Avanzado", instructor: "Dr. Ricardo Morales", img: "🚑", precio: "$200.000", tag: "Certificado" },
  { id: 9, titulo: "Salud Pública y Epidemiología", desc: "Fundamentos de salud pública, epidemiología y estrategias de control de enfermedades.", modulos: 11, duracion: "22 horas", nivel: "Intermedio", instructor: "Dra. Ana Rodríguez", img: "📊", precio: "$110.000", tag: "" },
];

export default function Cursos() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-[#13ec5b]/10">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-[#13ec5b] rounded-lg flex items-center justify-center">
              <span className="material-icons-outlined text-[#102216]">health_and_safety</span>
            </div>
            <span className="text-xl font-bold tracking-tight uppercase">Salud<span className="text-[#13ec5b]">Digital</span></span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-sm font-semibold hover:text-[#13ec5b] transition-colors">Inicio</Link>
            <Link href="/cursos" className="text-sm font-semibold text-[#13ec5b]">Cursos</Link>
            <Link href="/dashboard" className="text-sm font-semibold hover:text-[#13ec5b] transition-colors">Dashboard</Link>
          </nav>
          <Link href="/dashboard" className="px-6 py-2.5 rounded-full bg-[#13ec5b] text-[#102216] font-bold text-sm hover:opacity-90 transition-all shadow-lg shadow-[#13ec5b]/20">
            Mi Portal
          </Link>
        </div>
      </header>

      {/* Hero Cursos */}
      <section className="py-16 px-6" style={{ background: 'linear-gradient(135deg, #102216 0%, #1a3a2a 100%)' }}>
        <div className="max-w-7xl mx-auto text-center text-white">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#13ec5b]/20 text-[#13ec5b] text-xs font-bold uppercase tracking-wider mb-6">
            <span className="material-icons-outlined text-sm">school</span>
            Plataforma Educativa
          </div>
          <h1 className="text-4xl lg:text-5xl font-extrabold mb-4">Cursos de Salud <span className="text-[#13ec5b]">Especializados</span></h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-8">Aprende de profesionales certificados con el apoyo de nuestro tutor IA por WhatsApp. Certificados avalados por instituciones de salud.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="https://wa.me/12763294935?text=Hola! Quiero información sobre los cursos de salud" className="px-8 py-4 rounded-xl bg-[#13ec5b] text-[#102216] font-bold text-lg hover:scale-105 transition-transform flex items-center justify-center gap-2">
              💬 Tutor IA por WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { valor: "9+", label: "Cursos disponibles" },
            { valor: "2,500+", label: "Estudiantes activos" },
            { valor: "15+", label: "Instructores certificados" },
            { valor: "95%", label: "Tasa de satisfacción" },
          ].map((stat, i) => (
            <div key={i}>
              <p className="text-3xl font-extrabold text-[#13ec5b]">{stat.valor}</p>
              <p className="text-sm text-slate-500">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Grid de Cursos */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {cursos.map((curso) => (
              <div key={curso.id} className="bg-white p-6 rounded-2xl border border-slate-100 hover:border-[#13ec5b]/50 hover:shadow-lg transition-all group">
                <div className="flex justify-between items-start mb-4">
                  <span className="text-5xl">{curso.img}</span>
                  {curso.tag && (
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      curso.tag === "Popular" ? "bg-amber-100 text-amber-700" :
                      curso.tag === "Nuevo" ? "bg-blue-100 text-blue-700" :
                      "bg-emerald-100 text-emerald-700"
                    }`}>{curso.tag}</span>
                  )}
                </div>
                <h3 className="text-xl font-bold mb-2">{curso.titulo}</h3>
                <p className="text-sm text-slate-500 mb-4 leading-relaxed">{curso.desc}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="text-xs bg-[#f6f8f6] px-2 py-1 rounded-lg text-slate-600">📚 {curso.modulos} módulos</span>
                  <span className="text-xs bg-[#f6f8f6] px-2 py-1 rounded-lg text-slate-600">⏱️ {curso.duracion}</span>
                  <span className="text-xs bg-[#f6f8f6] px-2 py-1 rounded-lg text-slate-600">📊 {curso.nivel}</span>
                </div>
                <p className="text-xs text-slate-400 mb-4">👨‍⚕️ {curso.instructor}</p>
                <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                  <span className={`text-lg font-extrabold ${curso.precio === "Gratis" ? "text-[#13ec5b]" : "text-[#102216]"}`}>{curso.precio}</span>
                  <button className="px-6 py-2 rounded-lg bg-[#13ec5b] text-[#102216] font-bold text-sm hover:opacity-90 transition-all">
                    {curso.precio === "Gratis" ? "Inscribirme" : "Comprar"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA WhatsApp Tutor */}
      <section className="py-16 px-6 bg-[#102216]">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl font-bold mb-4">🤖 Aprende con nuestro Tutor IA</h2>
          <p className="text-lg text-slate-400 mb-8">Nuestro agente de IA por WhatsApp te acompaña en tu aprendizaje: resuelve dudas, explica temas y evalúa tu progreso en tiempo real.</p>
          <a href="https://wa.me/12763294935?text=Hola! Quiero empezar a aprender con el Tutor IA" className="inline-block px-10 py-5 rounded-full bg-[#13ec5b] text-[#102216] font-extrabold text-xl hover:shadow-2xl hover:shadow-[#13ec5b]/40 transition-all">
            💬 Conectar con Tutor IA
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-50 border-t border-slate-200 py-12">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-sm text-slate-500">© 2026 SaludDigital Colombia. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
