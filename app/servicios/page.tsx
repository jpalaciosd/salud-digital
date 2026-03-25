"use client";
import Link from "next/link";
import { useState } from "react";

const servicios = [
  { icon: "medical_services", titulo: "Medicina General Virtual", desc: "Consulta médica virtual para condiciones de baja complejidad, recetas digitales y órdenes médicas inmediatas.", tag: "24/7", tagColor: "bg-blue-100 text-blue-700", categoria: "Telemedicina" },
  { icon: "psychology", titulo: "Salud Mental", desc: "Apoyo psicológico y tele-consultas psiquiátricas con un enfoque humano y confidencial para tu bienestar emocional.", tag: "", tagColor: "", categoria: "Salud Mental" },
  { icon: "restaurant", titulo: "Nutrición y Dietética", desc: "Planes de alimentación personalizados y seguimiento metabólico para mejorar tu calidad de vida y salud integral.", tag: "", tagColor: "", categoria: "Telemedicina" },
  { icon: "fitness_center", titulo: "Rehabilitación Física", desc: "Sesiones de fisioterapia virtual y ejercicios guiados para la recuperación de movilidad y manejo del dolor.", tag: "", tagColor: "", categoria: "Telemedicina" },
  { icon: "monitor_heart", titulo: "Monitoreo Crónico", desc: "Seguimiento 24/7 para pacientes con hipertensión, diabetes y otras condiciones crónicas mediante dispositivos conectados.", tag: "Especializado", tagColor: "bg-green-100 text-green-700", categoria: "Crónicos" },
];

const filtros = ["Todos", "Telemedicina", "Crónicos", "Salud Mental"];

export default function Servicios() {
  const [filtro, setFiltro] = useState("Todos");
  const [busqueda, setBusqueda] = useState("");

  const serviciosFiltrados = servicios.filter((s) => {
    const matchFiltro = filtro === "Todos" || s.categoria === filtro;
    const matchBusqueda = s.titulo.toLowerCase().includes(busqueda.toLowerCase()) || s.desc.toLowerCase().includes(busqueda.toLowerCase());
    return matchFiltro && matchBusqueda;
  });

  return (
    <div className="min-h-screen">
      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-[#1d4ed8]/10">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/logo-issi.png" alt="ISSI" className="w-12 h-12 rounded-full" />
            <span className="text-xl font-bold tracking-tight">ISSI</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-sm font-semibold hover:text-[#1d4ed8] transition-colors">Inicio</Link>
            <Link href="/servicios" className="text-sm font-semibold text-[#1d4ed8]">Servicios</Link>
            <Link href="/cursos" className="text-sm font-semibold hover:text-[#1d4ed8] transition-colors">Cursos</Link>
            <Link href="/dashboard" className="text-sm font-semibold hover:text-[#1d4ed8] transition-colors">Mi Portal</Link>
            <Link href="/dashboard" className="px-5 py-2.5 bg-[#1d4ed8] text-black font-bold rounded-lg hover:shadow-lg hover:shadow-[#1d4ed8]/20 transition-all">Pedir Cita</Link>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <header className="max-w-3xl mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#1d4ed8]/10 border border-[#1d4ed8]/20 rounded-full mb-6">
            <span className="w-2 h-2 bg-[#1d4ed8] rounded-full animate-pulse"></span>
            <span className="text-xs font-bold uppercase tracking-wider text-[#1d4ed8]">Atención Integral en Colombia</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight">
            Nuestras <span className="text-[#1d4ed8]">Especialidades</span> y Servicios Médicos
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed">
            Brindamos atención primaria y seguimiento a pacientes crónicos con tecnología de vanguardia. Accede a consultas virtuales con los mejores especialistas desde cualquier lugar.
          </p>
        </header>

        {/* Search & Filters */}
        <div className="flex flex-col md:flex-row items-center gap-4 mb-12">
          <div className="relative w-full md:w-96">
            <span className="material-icons-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">search</span>
            <input
              className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#1d4ed8] focus:border-transparent outline-none transition-all"
              placeholder="Buscar especialidad o síntoma..."
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>
          <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
            {filtros.map((f) => (
              <button
                key={f}
                onClick={() => setFiltro(f)}
                className={`px-6 py-3 whitespace-nowrap font-semibold rounded-xl transition-colors ${
                  filtro === f
                    ? "bg-[#1d4ed8] text-black font-bold"
                    : "bg-white border border-slate-200 hover:border-[#1d4ed8]"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Service Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {serviciosFiltrados.map((s, i) => (
            <div key={i} className="group bg-white p-8 rounded-xl border border-slate-200 hover:border-[#1d4ed8]/50 hover:shadow-2xl hover:shadow-[#1d4ed8]/5 transition-all flex flex-col">
              <div className="w-14 h-14 bg-[#1d4ed8]/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <span className="material-icons-outlined text-[#1d4ed8] text-3xl">{s.icon}</span>
              </div>
              <div className="flex-grow">
                <div className="flex items-center gap-2 mb-3">
                  <h3 className="text-xl font-bold">{s.titulo}</h3>
                  {s.tag && <span className={`px-2 py-0.5 text-[10px] font-bold rounded uppercase ${s.tagColor}`}>{s.tag}</span>}
                </div>
                <p className="text-slate-600 mb-6">{s.desc}</p>
              </div>
              <button className="inline-flex items-center text-sm font-bold text-black bg-[#1d4ed8] px-6 py-3 rounded-lg hover:bg-[#1d4ed8]/90 transition-colors w-fit">
                Saber más
                <span className="material-icons-outlined text-sm ml-2">arrow_forward</span>
              </button>
            </div>
          ))}

          {/* CTA Card */}
          <div className="bg-gradient-to-br from-[#1d4ed8] to-blue-700 p-8 rounded-xl border-none shadow-xl flex flex-col justify-between overflow-hidden relative group">
            <div className="absolute -right-8 -bottom-8 opacity-10 group-hover:scale-110 transition-transform duration-500">
              <span className="material-icons-outlined text-[160px] text-white">support_agent</span>
            </div>
            <div className="relative z-10">
              <h3 className="text-2xl font-bold text-black mb-4 leading-tight">¿No encuentras lo que buscas?</h3>
              <p className="text-black/80 font-medium mb-8">Nuestro equipo de soporte médico está listo para guiarte hacia el especialista adecuado para tu caso.</p>
            </div>
            <a href="https://wa.me/12763294935" className="relative z-10 w-full py-4 bg-black text-white font-bold rounded-lg hover:bg-slate-900 transition-colors flex items-center justify-center gap-2">
              <span className="material-icons-outlined text-xl">chat</span>
              Hablar con un asesor
            </a>
          </div>
        </div>

        {/* How it works */}
        <section className="mt-24 bg-white rounded-3xl p-8 md:p-12 border border-slate-200 flex flex-col lg:flex-row items-center gap-12">
          <div className="w-full lg:w-1/2">
            <div className="aspect-video rounded-2xl overflow-hidden shadow-2xl relative">
              <img alt="Doctor virtual" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAqiK3lZWzOeqqqnl6I8djZ2R9ReAFdtbvYFBHPRp-lAL_ahVyOb84MhU7V6970k_wG2TV4NYTK_u5JPSBQKq3faYQ1Z99w8rBfmpDZarMP32L1wEOcTzUGgb1vwfqhwII-bVuUzN6wu10ucA7Mt3iaboiF3oHnV64rKBqqaGKsG9OCrFp_o9JN2r637wxvRs7YzXV801NNu-BF0N1PzURSmRF1-dpU18vMi7GwP4SB91xIDE5h5SXg_Q9XVnQ97P-Owj1YkZtp1Ly4" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-8">
                <div className="flex items-center gap-4">
                  <div className="flex -space-x-3">
                    <div className="w-10 h-10 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center">
                      <span className="material-icons-outlined text-xs text-slate-500">person</span>
                    </div>
                    <div className="w-10 h-10 rounded-full border-2 border-white bg-slate-300 flex items-center justify-center">
                      <span className="material-icons-outlined text-xs text-slate-500">person</span>
                    </div>
                    <div className="w-10 h-10 rounded-full border-2 border-white bg-[#1d4ed8] flex items-center justify-center">
                      <span className="text-[10px] font-bold">+10k</span>
                    </div>
                  </div>
                  <span className="text-white text-sm font-semibold">Más de 10,000 pacientes confían en nosotros</span>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full lg:w-1/2">
            <h2 className="text-3xl font-bold mb-6">Acceso Digital a tu Salud, Sin Complicaciones</h2>
            <div className="space-y-6">
              {[
                { num: "1", titulo: "Elige tu Especialidad", desc: "Selecciona el servicio que necesitas de nuestro catálogo integral." },
                { num: "2", titulo: "Agenda en Segundos", desc: "Reserva tu cita virtual en el horario que más te convenga, sin filas." },
                { num: "3", titulo: "Atención Personalizada", desc: "Recibe tu consulta y sigue tu tratamiento a través de nuestra plataforma." },
              ].map((step, i) => (
                <div key={i} className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#1d4ed8]/20 text-[#1d4ed8] flex items-center justify-center font-bold">{step.num}</div>
                  <div>
                    <h4 className="font-bold text-lg">{step.titulo}</h4>
                    <p className="text-slate-600">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-24 bg-white border-t border-slate-200 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <img src="/logo-issi.png" alt="ISSI" className="w-8 h-8 rounded-full" />
                <span className="text-lg font-bold tracking-tight">ISSI</span>
              </div>
              <p className="text-sm text-slate-500 leading-relaxed">Líderes en telemedicina y seguimiento crónico en Colombia.</p>
            </div>
            <div>
              <h5 className="font-bold mb-6">Servicios</h5>
              <ul className="space-y-4 text-sm text-slate-500">
                <li><a className="hover:text-[#1d4ed8]" href="#">Medicina General</a></li>
                <li><a className="hover:text-[#1d4ed8]" href="#">Psicología</a></li>
                <li><a className="hover:text-[#1d4ed8]" href="#">Nutrición</a></li>
                <li><a className="hover:text-[#1d4ed8]" href="#">Monitoreo Crónico</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-bold mb-6">Plataforma</h5>
              <ul className="space-y-4 text-sm text-slate-500">
                <li><a className="hover:text-[#1d4ed8]" href="#">Cómo Funciona</a></li>
                <li><a className="hover:text-[#1d4ed8]" href="#">Seguridad de Datos</a></li>
                <li><a className="hover:text-[#1d4ed8]" href="#">Soporte Técnico</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-bold mb-6">Contacto</h5>
              <ul className="space-y-4 text-sm text-slate-500">
                <li className="flex items-center gap-2"><span className="material-icons-outlined text-[#1d4ed8] text-sm">phone</span>+57 601 123 4567</li>
                <li className="flex items-center gap-2"><span className="material-icons-outlined text-[#1d4ed8] text-sm">email</span>contacto@issi.edu.co</li>
                <li className="flex items-center gap-2"><span className="material-icons-outlined text-[#1d4ed8] text-sm">location_on</span>Bogotá, Colombia</li>
              </ul>
            </div>
          </div>
          <div className="mt-16 pt-8 border-t border-slate-100 text-center text-xs text-slate-400">
            <p>© 2026 ISSI — Instituto Superior de Salud Integral. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
