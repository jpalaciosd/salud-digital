"use client";
import Link from "next/link";

const programas = [
  { tag: "Liderazgo", tagColor: "bg-[#1A5276] text-white", titulo: "Gestión Social", desc: "Capacítate para liderar proyectos de intervención comunitaria con herramientas modernas de planificación y monitoreo de impacto.", horas: "120 horas", cert: "Certificado Oficial", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuC-DP6OnhKXaX2rJIeGZFeJj-9XDfHN7ojt_y0iTqHt8Yfz3i41JXv3oKZeQkLhWBpqqYSMi8JyxNRMiM92WHj3XXOsgWiNTDKiB3H20hscC17TzVBLfWT5kQDda729JUVzgA_lE7UNAJ0GyZ24hMPuOr7NyvC_XNxqRENWE1LwRJkXIxutnXiibmuOJvf_xIn6wGcPVbEJMu5_hjNYtVswePJpJjudu4gS0E6vi_czogCztPkj0tYm9swuqoPquWB_6sPa-Gy67gU" },
  { tag: "Bienestar", tagColor: "bg-[#27AE60] text-white", titulo: "Salud Comunitaria", desc: "Enfoque integral en la promoción de la salud y prevención de enfermedades desde una perspectiva social y participativa.", horas: "90 horas", cert: "Prácticas Virtuales", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAFiEo3B4qHHdj8eFaEGAQtiRHFlISQeJRyqVxr9YnI6KT2ZOYLHxZmYTK7TbgwjLTi5B_Aw1czrS2TARm7GWqlE4lWdYVGDsMuT7-7awHDMWOq-OCr6ot-PyEhJdsrp1hOodqOtYi2DCP8x1UzkkgtawSFrNEd6RRDmaTMdFZuJaqfP-2-VEbdWSkBAZqAgPH-dHyc1oH9z7kr11Y92g5vh2QWCJ1OECCQzQqa_oVCvAzjcMocSdcUJYJCE3QHOCki2XaYhMONTd0" },
  { tag: "Ecología", tagColor: "bg-[#13ec6d] text-[#1A5276]", titulo: "Desarrollo Sostenible", desc: "Implementa soluciones que equilibren el crecimiento económico, la inclusión social y la protección ambiental.", horas: "150 horas", cert: "Global Impact", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAnT74rWy955ZVWg7XgsuJlqH_eeZaBMi5Wn1hk5FVWvS4jvrblrk9wgjqDl5_eez6_7DbjiLG0sLmduuZWTh-qFPydj7nf6Z_uHm3SxC2hdd0aWFMUUbOKSkhglbOWJH_5-ADKrs60J9t--7GL53pcw0x6b1Z9T8_tae4F3DZlPfB4cmAAxi47723bszdExL1rxmN5WmfCMqGRWIR-NDSz6G3_mACqs1HgxA0pwmAuAXD2UQnmNIZpY3pWyZVUlWeK3v1gu3NkkdE" },
];

export default function CVFDI() {
  return (
    <div className="min-h-screen bg-[#f6f8f7] text-[#0d1b13]" style={{ fontFamily: "'Manrope', sans-serif" }}>
      {/* Nav */}
      <nav className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-md border-b border-[#e7f3ec] px-4 md:px-10 lg:px-40 py-3">
        <div className="max-w-[1280px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#1A5276] rounded-lg flex items-center justify-center">
              <span className="material-icons-outlined text-white text-sm">school</span>
            </div>
            <h2 className="text-[#1A5276] text-2xl font-extrabold tracking-tight">CVFDI</h2>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <div className="flex items-center gap-6">
              <a className="text-sm font-medium hover:text-[#27AE60] transition-colors" href="#">Nosotros</a>
              <a className="text-sm font-medium hover:text-[#27AE60] transition-colors" href="#">Programas</a>
              <a className="text-sm font-medium hover:text-[#27AE60] transition-colors" href="#">Modelo</a>
              <a className="text-sm font-medium hover:text-[#27AE60] transition-colors" href="#">Contacto</a>
            </div>
            <div className="flex gap-3">
              <button className="bg-[#13ec6d] hover:bg-[#13ec6d]/90 text-[#1A5276] px-6 py-2 rounded-lg text-sm font-bold transition-all shadow-sm">Inscribirme</button>
              <Link href="/estudiante" className="bg-[#e7f3ec] hover:bg-[#d6e9dd] text-[#1A5276] px-6 py-2 rounded-lg text-sm font-bold transition-all">Login</Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-[1280px] mx-auto">
        {/* Hero */}
        <section className="px-4 py-12 md:py-20 flex flex-col lg:flex-row items-center gap-12">
          <div className="flex-1 flex flex-col gap-6 lg:max-w-[50%]">
            <span className="inline-block px-3 py-1 bg-[#13ec6d]/20 text-[#27AE60] text-xs font-bold uppercase tracking-wider rounded-full w-fit">
              Educación para el Futuro
            </span>
            <h1 className="text-[#1A5276] text-4xl md:text-6xl font-extrabold leading-[1.1] tracking-tight">
              Formación Integral para la <span className="text-[#27AE60]">Transformación</span> Social
            </h1>
            <p className="text-lg text-slate-600 leading-relaxed max-w-xl">
              Empoderando comunidades a través de la educación virtual de calidad. Únete a la plataforma líder en impacto social y desarrollo sostenible.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <button className="bg-[#13ec6d] hover:bg-[#13ec6d]/90 text-[#1A5276] px-8 py-4 rounded-xl text-base font-bold transition-all shadow-md flex items-center gap-2">
                Ver Programas <span className="material-icons-outlined">arrow_forward</span>
              </button>
              <button className="bg-white border-2 border-[#1A5276]/10 hover:border-[#1A5276]/30 text-[#1A5276] px-8 py-4 rounded-xl text-base font-bold transition-all">Inscribirme</button>
            </div>
          </div>
          <div className="flex-1 w-full">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-[#13ec6d] to-[#1A5276] rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
              <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl bg-slate-200">
                <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC44hriU_MTOCLhIorCAW6ahBrTOKB6rqQc0GenUh9LjrroN5OtBhRjjTAbaduG839-hF8TdflmgWir65pKGNZ_Qbx0D8C_KrNgdNaDkAXP1alverwlhWHvOWUbAZdNO0v2tdtkAtma4whK86YTowvUF4_ouv11qqdhvcrg2YoCQyNyKISm4OK5nt1mx4Sz9FzfjnlImlHILPI4yadBK1h75ND5tCqK0m8zRkhQDib5a3avto7kjA62wzw9R7H32D-k85cu5kpiT1o" alt="Estudiantes colaborando" />
              </div>
            </div>
          </div>
        </section>

        {/* Misión y Visión */}
        <section className="px-4 py-16 bg-white rounded-3xl mx-4 mb-20 shadow-sm border border-[#e7f3ec]">
          <div className="text-center mb-12">
            <h2 className="text-[#1A5276] text-3xl font-bold mb-4">Nuestro Propósito</h2>
            <div className="h-1.5 w-20 bg-[#13ec6d] mx-auto rounded-full"></div>
          </div>
          <div className="grid md:grid-cols-2 gap-8 px-4 lg:px-20">
            {[
              { icon: "group", titulo: "Misión", desc: "Fomentar el desarrollo integral mediante formación virtual accesible y de alto impacto social, conectando el conocimiento con las necesidades reales de nuestras comunidades para generar un cambio positivo y duradero." },
              { icon: "visibility", titulo: "Visión", desc: "Ser la institución referente en transformación social y educativa en la región para 2030, reconocida por nuestra innovación pedagógica y por la calidad humana y profesional de nuestros egresados en el campo social." },
            ].map((item, i) => (
              <div key={i} className="group p-8 rounded-2xl bg-[#f6f8f7] border border-slate-100 hover:border-[#13ec6d] transition-all duration-300">
                <div className="w-14 h-14 bg-[#13ec6d]/20 text-[#27AE60] rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <span className="material-icons-outlined text-3xl">{item.icon}</span>
                </div>
                <h3 className="text-[#1A5276] text-2xl font-bold mb-4">{item.titulo}</h3>
                <p className="text-slate-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Programas */}
        <section className="px-4 py-16">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div className="max-w-xl">
              <h2 className="text-[#1A5276] text-3xl font-bold mb-4">Programas Destacados</h2>
              <p className="text-slate-600">Explora nuestras rutas formativas diseñadas por expertos en gestión y desarrollo social.</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {programas.map((p, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-md border border-slate-100 flex flex-col group hover:-translate-y-2 transition-all">
                <div className="h-48 overflow-hidden relative">
                  <div className={`absolute top-4 left-4 z-10 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-tighter ${p.tagColor}`}>{p.tag}</div>
                  <img className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" src={p.img} alt={p.titulo} />
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <h4 className="text-[#1A5276] text-xl font-bold mb-3">{p.titulo}</h4>
                  <p className="text-slate-600 text-sm mb-6 flex-1">{p.desc}</p>
                  <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <div className="flex items-center gap-2 text-slate-500 text-xs">
                      <span className="material-icons-outlined text-sm">schedule</span>{p.horas}
                    </div>
                    <div className="flex items-center gap-2 text-slate-500 text-xs">
                      <span className="material-icons-outlined text-sm">stars</span>{p.cert}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Modelo Educativo */}
        <section className="px-4 py-20 bg-[#1A5276] rounded-[3rem] mx-4 my-20 text-white overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#13ec6d]/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
          <div className="relative z-10 flex flex-col items-center">
            <div className="text-center max-w-2xl mb-16">
              <h2 className="text-4xl font-bold mb-6">Nuestro Modelo Educativo</h2>
              <p className="text-slate-300">Basado en el enfoque <span className="text-[#13ec6d] font-semibold italic">constructivista</span>, donde el estudiante es el centro de su propio proceso de aprendizaje.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 w-full px-4 lg:px-12">
              {[
                { num: "1", titulo: "Observación", desc: "Analizamos realidades sociales locales." },
                { num: "2", titulo: "Conceptualización", desc: "Construimos teoría desde la práctica." },
                { num: "3", titulo: "Acción", desc: "Intervención directa en territorio." },
                { num: "4", titulo: "Reflexión", desc: "Evaluamos el impacto generado." },
              ].map((step, i) => (
                <div key={i} className="flex flex-col items-center text-center p-6 rounded-2xl bg-white/5 border border-white/10">
                  <div className="w-16 h-16 bg-[#13ec6d] text-[#1A5276] rounded-full flex items-center justify-center mb-4 text-2xl font-black">{step.num}</div>
                  <h5 className="text-lg font-bold mb-2">{step.titulo}</h5>
                  <p className="text-sm text-slate-400">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="px-4 py-20 text-center">
          <h2 className="text-[#1A5276] text-4xl font-bold mb-8">¿Listo para transformar realidades?</h2>
          <div className="flex flex-wrap justify-center gap-6">
            <button className="bg-[#13ec6d] hover:bg-[#13ec6d]/90 text-[#1A5276] px-10 py-5 rounded-2xl text-lg font-bold shadow-lg transition-transform hover:scale-105">Inscribirme Ahora</button>
            <a href="https://wa.me/12763294935" className="bg-slate-100 hover:bg-slate-200 text-[#1A5276] px-10 py-5 rounded-2xl text-lg font-bold border border-slate-200 flex items-center gap-3">
              <span className="material-icons-outlined">chat</span>Hablar con Asesor
            </a>
          </div>
          <p className="mt-8 text-slate-500 italic">Más de 5,000 graduados ya están impactando sus comunidades.</p>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-50 border-t border-[#e7f3ec] pt-20 pb-10">
        <div className="max-w-[1280px] mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-[#1A5276] rounded flex items-center justify-center">
                <span className="material-icons-outlined text-white text-xs">school</span>
              </div>
              <h2 className="text-[#1A5276] text-xl font-extrabold tracking-tight">CVFDI</h2>
            </div>
            <p className="text-sm text-slate-500 leading-relaxed">Centro Virtual de Formación para el Desarrollo Integral. Educando para la paz y la transformación social desde el 2015.</p>
          </div>
          <div>
            <h6 className="font-bold mb-6 text-[#1A5276]">Institución</h6>
            <ul className="space-y-4 text-sm text-slate-600">
              <li><a className="hover:text-[#13ec6d]" href="#">Sobre Nosotros</a></li>
              <li><a className="hover:text-[#13ec6d]" href="#">Gobierno Corporativo</a></li>
              <li><a className="hover:text-[#13ec6d]" href="#">Impacto Social</a></li>
            </ul>
          </div>
          <div>
            <h6 className="font-bold mb-6 text-[#1A5276]">Educación</h6>
            <ul className="space-y-4 text-sm text-slate-600">
              <li><a className="hover:text-[#13ec6d]" href="#">Diplomados</a></li>
              <li><a className="hover:text-[#13ec6d]" href="#">Cursos Cortos</a></li>
              <li><a className="hover:text-[#13ec6d]" href="#">Seminarios</a></li>
            </ul>
          </div>
          <div>
            <h6 className="font-bold mb-6 text-[#1A5276]">Newsletter</h6>
            <p className="text-sm text-slate-500 mb-4">Recibe actualizaciones sobre nuevos programas.</p>
            <div className="flex gap-2">
              <input className="flex-1 px-4 py-2 rounded-lg border border-slate-200 text-sm" placeholder="tu@email.com" type="email" />
              <button className="bg-[#13ec6d] text-[#1A5276] px-4 py-2 rounded-lg font-bold text-sm">Ok</button>
            </div>
          </div>
        </div>
        <div className="max-w-[1280px] mx-auto px-4 mt-20 pt-8 border-t border-slate-200 text-center text-xs text-slate-400 uppercase tracking-widest">
          <span>© 2026 CVFDI - Todos los derechos reservados.</span>
        </div>
      </footer>
    </div>
  );
}
