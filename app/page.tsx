"use client";
import Link from "next/link";

export default function Home() {
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
            <Link href="#servicios" className="text-sm font-semibold hover:text-[#13ec5b] transition-colors">Servicios</Link>
            <Link href="/cursos" className="text-sm font-semibold hover:text-[#13ec5b] transition-colors">Cursos</Link>
            <Link href="#sedes" className="text-sm font-semibold hover:text-[#13ec5b] transition-colors">Sedes</Link>
            <Link href="#contacto" className="text-sm font-semibold hover:text-[#13ec5b] transition-colors">Contacto</Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="px-6 py-2.5 rounded-full bg-[#13ec5b] text-[#102216] font-bold text-sm hover:opacity-90 transition-all shadow-lg shadow-[#13ec5b]/20">
              Iniciar Sesión
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden hero-gradient py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#13ec5b]/10 border border-[#13ec5b]/20 text-[#0f766e] text-xs font-bold uppercase tracking-wider">
              <span className="material-icons-outlined text-sm">verified_user</span>
              Cuidado Primario en Colombia
            </div>
            <h1 className="text-5xl lg:text-7xl font-extrabold leading-tight">
              Salud Humana <br /><span className="text-[#13ec5b]">Potenciada</span> por Tecnología
            </h1>
            <p className="text-lg text-slate-600 max-w-lg leading-relaxed">
              Transformamos la atención médica en Colombia a través de un modelo híbrido que prioriza la empatía humana y la precisión digital para pacientes crónicos.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="px-8 py-4 rounded-xl bg-[#13ec5b] text-[#102216] font-bold text-lg hover:scale-105 transition-transform flex items-center justify-center gap-2">
                Agendar Consulta
                <span className="material-icons-outlined">arrow_forward</span>
              </button>
              <Link href="/cursos" className="px-8 py-4 rounded-xl border-2 border-slate-200 font-bold text-lg hover:bg-slate-50 transition-colors text-center">
                Ver Cursos de Salud
              </Link>
            </div>
            <div className="flex items-center gap-4 pt-4">
              <div className="flex -space-x-3">
                <img className="w-12 h-12 rounded-full border-4 border-white object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDPUr-l9qM9ZtY052_yT1Ha9XW-cw7Kd-pYoWiLTfUmWSHjuMka2tXcJd_boMsb1T5bId1rnuCmNzi8JsBQhuAnR3MW8YS-lFiuHNCjz0ssxf88vLfXD59VKZ8_PVoB7E9c-iDH4gM7IvHOT_4P_qwjoXP7IM4439Yyx8QY-UP3WRqbpyt1orA0FCfvflOVrMLmms1MSpxvKPHH06sGoTPJswI8q5bWe5cb2pCAFGhhhKcMvxUPWdl57_iuepZp4nl9rb-Ha3RJQOV7" alt="Doctor 1" />
                <img className="w-12 h-12 rounded-full border-4 border-white object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAE1x55JaAYhEy0Y2Wgt-JHSiP1BxrfhvkumHA-XifJkMVEJ5Br-FBqGQ4TR-onN24kYYu_AL2LjBiYrQVyb_MFCn2Oh_9fACop5XAfFTMcu60nrlT4RDlNgTE5mwQPd5gKx4Q0fEkV3gn-08KwAF7NMbu5fQitnD84ISotnOOtmAa0gEmKtivi9bgCSchCTBPxV2R9wZQKrOn3ArUD7r5fXnAv49jv3X27TIqqgRn3LCXXnHvh6YGewEdJ2VQb42wdyaMgnweZrtQ9" alt="Doctor 2" />
                <img className="w-12 h-12 rounded-full border-4 border-white object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC1Wbg59TiIuZW-5SE39YuWH2KcOI57QdClMmb3Mi3oXDhC4IKUMrR3pNS14IdU7pLinKoW6ZlOgsxlqK66adj5wEXaUnOPQKjL4nFA02NGiVZTx8TCHVW3Ck3KEY7OgW5ocxbpksyb9KuqopTCv_G_9yGvw4DIIOdYo-4hKXPzzYct7VoWycGzsEs8wZCs7NvIjbxwRes4n27xY_-wCaX51hWK9kzga2eLbusvUnjhnoRMA06WUNE6RaNag5g5aOMxfoRFRALYxRvx" alt="Doctor 3" />
              </div>
              <p className="text-sm font-medium text-slate-500">Más de <span className="text-slate-900 font-bold">50,000</span> pacientes atendidos</p>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-[#13ec5b]/20 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-[#13ec5b]/30 rounded-full blur-3xl"></div>
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
              <img className="w-full aspect-[4/5] object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAp7lYYy9rZlBvzAN2qZnUIn9_YCiqMCU-uBxNpUVrrcb2n98bR-yFnjZaneYrNwD9AoESnmyuSUYTN95ILXfzSCwhZBlmzYWK0I0JapkCliNrtfFSPBkwxuiuurN31-5WVTzBJtqQSlokDch8ryOvMQkqnfLHqtOXPDoXJjQQk4d9eOrvaSW0q689gv72Io5Kgq9arAT-iupSyr0-ZA1HVi-7ZnBlF-UXdHLLexubIPpAucPMFUCitzZvZld4x4W-he-tHKb_B6PpQ" alt="Doctor con paciente" />
            </div>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="py-12 bg-white border-y border-[#13ec5b]/5">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-8">Respaldados por las instituciones de salud líderes en Colombia</p>
          <div className="flex flex-wrap justify-center items-center gap-12 opacity-50 grayscale hover:grayscale-0 transition-all">
            {["EPS SURA", "SANITAS", "MINSALUD", "FUNDACIÓN SC", "COLMÉDICA"].map((name) => (
              <div key={name} className="text-2xl font-black text-slate-400">{name}</div>
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
            <div key={i} className="p-8 rounded-2xl bg-white border border-slate-100 hover:border-[#13ec5b]/50 transition-all group">
              <div className="w-14 h-14 bg-[#13ec5b]/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-[#13ec5b] transition-colors">
                <span className="material-icons-outlined text-[#13ec5b] group-hover:text-[#102216]">{item.icon}</span>
              </div>
              <h3 className="text-xl font-bold mb-3">{item.titulo}</h3>
              <p className="text-slate-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Servicios Especializados */}
      <section id="servicios" className="py-24 bg-[#102216] text-white rounded-[3rem] mx-4 mb-24 overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <h2 className="text-4xl font-bold mb-12 leading-tight text-center">Servicios de Salud <span className="text-[#13ec5b]">Especializados</span></h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { num: "01", titulo: "Medicina General Digital", desc: "Atención primaria inmediata para síntomas comunes y prevención, disponible vía chat o video." },
              { num: "02", titulo: "Monitoreo de Crónicos", desc: "Seguimiento constante para diabetes, hipertensión y enfermedades respiratorias con dispositivos IoT." },
              { num: "03", titulo: "Gestión de Medicamentos", desc: "Renovación de fórmulas y envío de medicamentos a domicilio en todo el territorio nacional." },
              { num: "04", titulo: "Triage IA por WhatsApp", desc: "Nuestro agente de IA realiza un triage inicial y te redirige al profesional adecuado según tu necesidad." },
              { num: "05", titulo: "Video Consulta", desc: "Consultas especializadas por video con médicos certificados, desde la comodidad de tu hogar." },
              { num: "06", titulo: "Cursos de Salud", desc: "Plataforma educativa con cursos especializados en salud, impartidos por profesionales y asistidos por IA." },
            ].map((s, i) => (
              <div key={i} className="flex gap-4 items-start p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                <div className="w-12 h-12 shrink-0 bg-[#13ec5b] text-[#102216] rounded-lg flex items-center justify-center font-bold">{s.num}</div>
                <div>
                  <h4 className="font-bold text-xl mb-2">{s.titulo}</h4>
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
                  <span className="material-icons-outlined text-[#13ec5b]">location_on</span>
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

      {/* CTA */}
      <section id="contacto" className="py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-extrabold mb-6">¿Listo para transformar tu cuidado de salud?</h2>
          <p className="text-xl text-slate-500 mb-10">Únete a miles de colombianos que ya gestionan su salud de manera inteligente y humana.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-10 py-5 rounded-full bg-[#13ec5b] text-[#102216] font-extrabold text-xl hover:shadow-2xl hover:shadow-[#13ec5b]/40 transition-all">Registrarme Gratis</button>
            <a href="https://wa.me/12763294935" className="px-10 py-5 rounded-full bg-[#102216] text-white font-extrabold text-xl hover:bg-slate-800 transition-all">💬 Hablar con Asesor IA</a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-50 border-t border-slate-200 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-2">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 bg-[#13ec5b] rounded-md flex items-center justify-center">
                  <span className="material-icons-outlined text-[#102216] text-sm">health_and_safety</span>
                </div>
                <span className="text-lg font-bold tracking-tight uppercase">Salud<span className="text-[#13ec5b]">Digital</span></span>
              </div>
              <p className="text-slate-500 max-w-sm mb-6">Proveedor líder de servicios de salud digital en Colombia. Autorizado por el Ministerio de Salud y Protección Social.</p>
            </div>
            <div>
              <h5 className="font-bold mb-6">Compañía</h5>
              <ul className="space-y-4 text-slate-500">
                <li><a className="hover:text-[#13ec5b]" href="#">Sobre Nosotros</a></li>
                <li><a className="hover:text-[#13ec5b]" href="#">Carreras</a></li>
                <li><a className="hover:text-[#13ec5b]" href="#">Blog de Salud</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-bold mb-6">Legal</h5>
              <ul className="space-y-4 text-slate-500">
                <li><a className="hover:text-[#13ec5b]" href="#">Términos de Servicio</a></li>
                <li><a className="hover:text-[#13ec5b]" href="#">Política de Privacidad</a></li>
                <li><a className="hover:text-[#13ec5b]" href="#">PQRS</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-slate-200 text-center">
            <p className="text-sm text-slate-500">© 2026 SaludDigital Colombia. Todos los derechos reservados.</p>
            <p className="text-xs text-slate-400 mt-1">Powered by <span className="font-semibold text-[#13ec5b]">AINovaX</span></p>
          </div>
        </div>
      </footer>
    </div>
  );
}
