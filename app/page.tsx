"use client";
import Link from "next/link";
import { useAuth } from "@/lib/AuthContext";
import UserNav from "@/lib/UserNav";

const animStyles = `
@keyframes breathe { 0%,100%{transform:scale(1)} 50%{transform:scale(1.03)} }
@keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
@keyframes pulse-glow { 0%,100%{box-shadow:0 0 20px rgba(197,160,68,0.2)} 50%{box-shadow:0 0 40px rgba(197,160,68,0.4)} }
`;

export default function Home() {
  const { user } = useAuth();
  return (
    <div className="min-h-screen bg-[#fafaf7]">
      <style dangerouslySetInnerHTML={{ __html: animStyles }} />
      {user ? (
        <UserNav />
      ) : (
        <header className="sticky top-0 z-50 w-full bg-[#0f2847]/95 backdrop-blur-md border-b border-white/10">
          <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src="/logo-issi.png" alt="ISSI" className="w-12 h-12 rounded-full" />
              <span className="text-xl font-bold tracking-tight uppercase text-white">ISSI</span>
            </div>
            <nav className="hidden md:flex items-center gap-8">
              <a href="#plataforma" className="text-sm font-semibold text-white/80 hover:text-[#c5a044] transition-colors">Plataforma</a>
              <a href="#modulos" className="text-sm font-semibold text-white/80 hover:text-[#c5a044] transition-colors">Módulos</a>
              <a href="#planes" className="text-sm font-semibold text-white/80 hover:text-[#c5a044] transition-colors">Planes</a>
              <a href="#educacion" className="text-sm font-semibold text-white/80 hover:text-[#c5a044] transition-colors">Educación</a>
              <a href="#contacto" className="text-sm font-semibold text-white/80 hover:text-[#c5a044] transition-colors">Contacto</a>
            </nav>
            <div className="flex items-center gap-3">
              <Link href="/login" className="px-5 py-2 text-sm font-semibold text-white/80 hover:text-white transition">Ingresar</Link>
              <Link href="/registro" className="px-6 py-2.5 rounded-full bg-[#c5a044] text-[#0f2847] font-bold text-sm hover:bg-[#d4af37] transition-all shadow-lg">
                Solicitar Demo
              </Link>
            </div>
          </div>
        </header>
      )}

      {/* HERO — Telemedicina */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0a1628] via-[#0f2847] to-[#132d4f] text-white py-24 lg:py-36">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-[#c5a044] rounded-full blur-[120px]" />
          <div className="absolute bottom-10 right-20 w-96 h-96 bg-[#c5a044] rounded-full blur-[150px]" />
        </div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#c5a044]/15 border border-[#c5a044]/30 text-[#c5a044] text-xs font-bold uppercase tracking-wider">
                <span className="material-icons-outlined text-sm">local_hospital</span>
                Ecosistema de Telemedicina SaaS
              </div>
              <h1 className="text-5xl lg:text-6xl font-extrabold leading-tight">
                Telemedicina <span className="text-[#c5a044]">inteligente</span> para IPS y consultorios en Colombia
              </h1>
              <p className="text-xl text-white/70 max-w-lg leading-relaxed">
                Historia clínica electrónica, teleconsulta, fórmulas digitales, AIEPI, paraclínicos y más — todo en una sola plataforma conforme a la normativa colombiana.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/registro" className="px-8 py-4 rounded-xl bg-[#c5a044] text-[#0a1628] font-bold text-lg hover:bg-[#d4af37] transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#c5a044]/20">
                  Comenzar Gratis
                  <span className="material-icons-outlined">arrow_forward</span>
                </Link>
                <Link href="/clinico" className="px-8 py-4 rounded-xl border-2 border-white/20 text-white font-bold text-lg hover:bg-white/10 transition-all text-center">
                  Ver Centro Clínico
                </Link>
              </div>
              <div className="flex items-center gap-6 pt-4 text-sm text-white/50">
                <span className="flex items-center gap-1"><span className="material-icons-outlined text-[#c5a044] text-base">verified</span> Res. 2654/2019</span>
                <span className="flex items-center gap-1"><span className="material-icons-outlined text-[#c5a044] text-base">lock</span> Ley 1581/2012</span>
                <span className="flex items-center gap-1"><span className="material-icons-outlined text-[#c5a044] text-base">shield</span> RIPS compatible</span>
              </div>
            </div>
            <div className="hidden lg:flex items-center justify-center">
              <div className="relative" style={{animation:"breathe 4s ease-in-out infinite"}}>
                <div className="absolute -inset-4 bg-[#c5a044]/10 rounded-3xl blur-2xl" style={{animation:"pulse-glow 3s ease-in-out infinite"}} />
                <div className="relative bg-white/5 backdrop-blur border border-white/10 rounded-3xl p-8 space-y-4 w-80">
                  <div className="flex items-center gap-3 mb-6">
                    <img src="/logo-issi.png" alt="ISSI" className="w-10 h-10 rounded-full" />
                    <div>
                      <p className="font-bold text-sm">Centro Clínico ISSI</p>
                      <p className="text-[10px] text-white/50">12 módulos activos</p>
                    </div>
                  </div>
                  {[
                    { icon: "📋", label: "Historia Clínica", status: "Activo", color: "bg-green-500" },
                    { icon: "🩺", label: "Teleconsulta", status: "En línea", color: "bg-green-500" },
                    { icon: "💊", label: "Fórmula Médica", status: "Activo", color: "bg-green-500" },
                    { icon: "🧒", label: "AIEPI Pediátrico", status: "Activo", color: "bg-green-500" },
                    { icon: "🔬", label: "Paraclínicos", status: "Activo", color: "bg-green-500" },
                  ].map((m) => (
                    <div key={m.label} className="flex items-center gap-3 p-2.5 rounded-xl bg-white/5 border border-white/5">
                      <span className="text-lg">{m.icon}</span>
                      <span className="text-xs font-medium flex-1">{m.label}</span>
                      <span className={`w-1.5 h-1.5 rounded-full ${m.color}`} />
                      <span className="text-[10px] text-white/40">{m.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Numbers */}
      <section className="py-12 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 text-center">
            {[
              { num: "12", label: "Módulos clínicos", icon: "dashboard" },
              { num: "4", label: "PDFs generables", icon: "picture_as_pdf" },
              { num: "110+", label: "Códigos CIE-10", icon: "medical_information" },
              { num: "26", label: "Exámenes paraclínicos", icon: "science" },
              { num: "100%", label: "Normativa colombiana", icon: "gavel" },
            ].map((s) => (
              <div key={s.label} className="flex flex-col items-center gap-1">
                <span className="material-icons-outlined text-[#c5a044] text-xl">{s.icon}</span>
                <span className="text-2xl font-extrabold text-[#0f2847]">{s.num}</span>
                <span className="text-[10px] text-slate-400 font-medium">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ¿Para quién? */}
      <section id="plataforma" className="py-24 max-w-7xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl font-bold mb-4">Una plataforma para cada <span className="text-[#c5a044]">actor del sistema de salud</span></h2>
          <p className="text-slate-500">Multi-tenant desde el día uno. Cada IPS, consultorio o clínica opera con datos aislados y roles configurables.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { icon: "🏥", title: "IPS y Clínicas", desc: "Gestione múltiples sedes, profesionales y pacientes con aislamiento total de datos. Dashboard administrativo con métricas en tiempo real.", features: ["Multi-sede", "Roles granulares", "Auditoría completa", "Reportes RIPS"] },
            { icon: "⚕️", title: "Médicos y Especialistas", desc: "Historia clínica completa, fórmulas digitales, incapacidades, paraclínicos y AIEPI — todo desde su celular o computador.", features: ["HCE con CIE-10", "Teleconsulta", "PDF descargables", "Agenda inteligente"] },
            { icon: "👤", title: "Pacientes", desc: "Acceso a sus consultas, consentimiento informado digital, historial clínico y agendamiento en línea.", features: ["Agendar consultas", "Ver historial", "Consentimiento digital", "Notificaciones"] },
          ].map((item) => (
            <div key={item.title} className="p-8 rounded-2xl bg-white border border-slate-100 hover:border-[#c5a044]/50 hover:shadow-xl transition-all group">
              <div className="text-4xl mb-4">{item.icon}</div>
              <h3 className="text-xl font-bold mb-3">{item.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed mb-4">{item.desc}</p>
              <ul className="space-y-2">
                {item.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-slate-600">
                    <span className="material-icons-outlined text-[#c5a044] text-sm">check_circle</span>
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Módulos Clínicos — HERO section */}
      <section id="modulos" className="py-24 bg-gradient-to-br from-[#0a1628] to-[#0f2847] text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold mb-4">Todo lo que necesita su <span className="text-[#c5a044]">práctica clínica</span></h2>
            <p className="text-white/60 max-w-2xl mx-auto">12 módulos integrados que cubren el ciclo completo de atención: desde el agendamiento hasta la auditoría.</p>
          </div>

          {/* Main modules — 2x3 grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {[
              { icon: "📋", title: "Historia Clínica Electrónica", desc: "Wizard de 8 pasos: motivo, antecedentes, revisión por sistemas, examen físico, signos vitales, diagnóstico CIE-10 con autocompletado, plan de manejo y seguimiento. Genera PDF firmado.", tag: "Res. 1995/1999", color: "border-[#c5a044]/30" },
              { icon: "🩺", title: "Teleconsulta", desc: "Sala virtual con chat en tiempo real, notas clínicas privadas, controles de audio/video, timer de consulta y acceso directo a HCE, fórmulas y paraclínicos.", tag: "Res. 2654/2019", color: "border-blue-500/30" },
              { icon: "💊", title: "Fórmula Médica Digital", desc: "Prescripción con múltiples medicamentos, dosis, frecuencia, vía de administración y duración. Genera PDF con firma del profesional.", tag: "Decreto 2200/2005", color: "border-purple-500/30" },
              { icon: "🧒", title: "AIEPI Pediátrico", desc: "Evaluación integrada de enfermedades prevalentes de la infancia. Wizard de 10 pasos con clasificación automática por semáforo (rojo/amarillo/verde).", tag: "OMS/OPS", color: "border-green-500/30" },
              { icon: "🔬", title: "Órdenes de Paraclínicos", desc: "Catálogo de 26 exámenes comunes (hematología, química, imagenología, serología). Búsqueda rápida, agrupación por categoría y PDF descargable.", tag: "Laboratorio", color: "border-cyan-500/30" },
              { icon: "🏥", title: "Incapacidades Médicas", desc: "Certificados digitales con CIE-10, tipo (enfermedad general, accidente de trabajo, maternidad/paternidad), cálculo automático de fechas y PDF.", tag: "Certificado", color: "border-orange-500/30" },
            ].map((m) => (
              <div key={m.title} className={`p-6 rounded-2xl bg-white/5 border ${m.color} hover:bg-white/10 transition-all group`}>
                <div className="flex items-start justify-between mb-4">
                  <span className="text-3xl">{m.icon}</span>
                  <span className="px-2 py-0.5 bg-white/10 rounded text-[10px] font-bold text-[#c5a044]">{m.tag}</span>
                </div>
                <h3 className="font-bold text-lg mb-2 group-hover:text-[#c5a044] transition-colors">{m.title}</h3>
                <p className="text-sm text-white/60 leading-relaxed">{m.desc}</p>
              </div>
            ))}
          </div>

          {/* Supporting modules — smaller grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { icon: "✅", title: "Consentimiento", desc: "Informado digital" },
              { icon: "👥", title: "Mis Pacientes", desc: "Historial consolidado" },
              { icon: "📅", title: "Agenda Clínica", desc: "State machine" },
              { icon: "🔍", title: "Auditoría", desc: "Trazabilidad total" },
              { icon: "🏢", title: "Onboarding", desc: "Registro de IPS" },
              { icon: "🔔", title: "Notificaciones", desc: "Alertas automáticas" },
            ].map((m) => (
              <div key={m.title} className="p-4 rounded-xl bg-white/5 border border-white/5 text-center hover:border-[#c5a044]/30 transition-all">
                <span className="text-2xl">{m.icon}</span>
                <p className="text-xs font-bold mt-2">{m.title}</p>
                <p className="text-[10px] text-white/40">{m.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Flujo Clínico */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl font-bold mb-4">Flujo clínico <span className="text-[#c5a044]">completo y conectado</span></h2>
          <p className="text-slate-500">Cada módulo pasa el ID de consulta para trazabilidad total. De la agenda al PDF, todo conectado.</p>
        </div>
        <div className="flex flex-wrap justify-center gap-3 items-center">
          {[
            { step: "1", label: "Agendar", icon: "📅" },
            { step: "→", label: "", icon: "" },
            { step: "2", label: "Consentimiento", icon: "✅" },
            { step: "→", label: "", icon: "" },
            { step: "3", label: "Teleconsulta", icon: "🩺" },
            { step: "→", label: "", icon: "" },
            { step: "4", label: "HCE + CIE-10", icon: "📋" },
            { step: "→", label: "", icon: "" },
            { step: "5", label: "Fórmula / Labs", icon: "💊" },
            { step: "→", label: "", icon: "" },
            { step: "6", label: "PDF + Auditoría", icon: "📄" },
          ].map((s, i) => (
            s.label ? (
              <div key={i} className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-white border border-slate-100 shadow-sm w-32">
                <span className="text-2xl">{s.icon}</span>
                <span className="text-[#c5a044] text-xs font-bold">Paso {s.step}</span>
                <span className="text-xs font-semibold text-slate-700 text-center">{s.label}</span>
              </div>
            ) : (
              <span key={i} className="text-[#c5a044] text-xl font-bold hidden sm:block">→</span>
            )
          ))}
        </div>
      </section>

      {/* Normativa */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Diseñado para la <span className="text-[#c5a044]">normativa colombiana</span></h2>
            <p className="text-slate-500">Cada módulo cumple con la regulación vigente del sistema de salud colombiano.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { code: "Res. 1995/1999", title: "Historia Clínica", desc: "Estándares de HCE, confidencialidad, custodia y retención de datos clínicos." },
              { code: "Res. 2654/2019", title: "Telemedicina", desc: "Tipos de teleconsulta, consentimiento informado, limitaciones de examen virtual." },
              { code: "Decreto 2200/2005", title: "Prescripción", desc: "Requisitos de la fórmula médica: identificación, medicamentos, firma profesional." },
              { code: "Ley 1581/2012", title: "Datos Personales", desc: "Protección de datos sensibles de salud, autorización y tratamiento responsable." },
            ].map((n) => (
              <div key={n.code} className="p-6 rounded-2xl border border-slate-100 hover:border-[#c5a044]/30 transition-all">
                <span className="inline-block px-3 py-1 bg-[#0f2847] text-[#c5a044] text-xs font-bold rounded-full mb-4">{n.code}</span>
                <h3 className="font-bold text-lg mb-2">{n.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{n.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Planes SaaS */}
      <section id="planes" className="py-24 bg-gradient-to-br from-[#0a1628] to-[#0f2847] text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold mb-4">Planes que se adaptan a <span className="text-[#c5a044]">su práctica</span></h2>
            <p className="text-white/60">Sin contratos largos. Escale cuando lo necesite.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { name: "Básico", price: "$150.000", period: "/mes", users: "Hasta 5 usuarios", consults: "50 consultas/mes", features: ["HCE + CIE-10", "Fórmulas digitales", "1 sede", "Soporte email"], cta: "Comenzar", popular: false },
              { name: "Profesional", price: "$450.000", period: "/mes", users: "Hasta 20 usuarios", consults: "300 consultas/mes", features: ["Todo lo Básico", "Teleconsulta", "AIEPI + Paraclínicos", "Multi-sede", "Soporte prioritario"], cta: "Solicitar Demo", popular: true },
              { name: "Enterprise", price: "$1.200.000", period: "/mes", users: "Usuarios ilimitados", consults: "Consultas ilimitadas", features: ["Todo lo Profesional", "API dedicada", "Integraciones ERP/EPS", "SLA 99.9%", "Soporte 24/7"], cta: "Contactar Ventas", popular: false },
            ].map((plan) => (
              <div key={plan.name} className={`p-8 rounded-2xl border ${plan.popular ? "bg-[#c5a044]/10 border-[#c5a044]/50 scale-105" : "bg-white/5 border-white/10"} relative`}>
                {plan.popular && <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-[#c5a044] text-[#0f2847] text-xs font-bold rounded-full">Más popular</span>}
                <h3 className="text-xl font-bold mb-1">{plan.name}</h3>
                <p className="text-3xl font-extrabold text-[#c5a044] mb-0">{plan.price}<span className="text-sm font-normal text-white/40">{plan.period}</span></p>
                <p className="text-xs text-white/50 mb-1">{plan.users}</p>
                <p className="text-xs text-white/50 mb-6">{plan.consults}</p>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-white/80">
                      <span className="material-icons-outlined text-[#c5a044] text-sm">check</span>{f}
                    </li>
                  ))}
                </ul>
                <Link href="/registro" className={`block w-full py-3 rounded-xl font-bold text-sm text-center transition ${plan.popular ? "bg-[#c5a044] text-[#0f2847] hover:bg-[#d4af37]" : "border border-white/20 text-white hover:bg-white/10"}`}>
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
          <p className="text-center text-white/30 text-xs mt-8">Precios en COP. IVA no incluido. Planes personalizados disponibles.</p>
        </div>
      </section>

      {/* Educación como PLUS */}
      <section id="educacion" className="py-20 bg-[#f8f6f1]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#c5a044]/10 border border-[#c5a044]/20 text-[#c5a044] text-xs font-bold uppercase tracking-wider mb-6">
                <span className="material-icons-outlined text-sm">school</span>
                Valor Agregado
              </div>
              <h2 className="text-3xl font-bold mb-4">Formación continua <span className="text-[#c5a044]">integrada</span></h2>
              <p className="text-slate-500 mb-6 leading-relaxed">
                Lo que ningún competidor ofrece: un catálogo de 12 cursos de formación en salud integrados directamente en la plataforma. Sus profesionales se certifican sin salir del ecosistema.
              </p>
              <div className="grid grid-cols-2 gap-4 mb-8">
                {[
                  { icon: "auto_stories", text: "12 cursos disponibles" },
                  { icon: "smart_toy", text: "Asistente IA por WhatsApp" },
                  { icon: "workspace_premium", text: "Certificación digital" },
                  { icon: "schedule", text: "100% virtual y flexible" },
                ].map((f) => (
                  <div key={f.text} className="flex items-start gap-2 p-3 rounded-xl bg-white border border-slate-100">
                    <span className="material-icons-outlined text-[#c5a044] text-lg">{f.icon}</span>
                    <span className="text-sm font-medium text-slate-700">{f.text}</span>
                  </div>
                ))}
              </div>
              <div className="flex gap-3">
                <Link href="/cursos" className="px-6 py-3 rounded-xl bg-[#0f2847] text-white font-bold text-sm hover:opacity-90 transition flex items-center gap-2">
                  Ver Catálogo de Cursos
                  <span className="material-icons-outlined text-lg">arrow_forward</span>
                </Link>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { emoji: "🩺", title: "Primeros Auxilios", horas: "40h" },
                { emoji: "❤️", title: "RCP Avanzado", horas: "60h" },
                { emoji: "🧠", title: "Salud Mental", horas: "40h" },
                { emoji: "💊", title: "Farmacología", horas: "60h" },
                { emoji: "🛡️", title: "Seguridad Paciente", horas: "40h" },
                { emoji: "🧓", title: "Adulto Mayor", horas: "60h" },
              ].map((c) => (
                <div key={c.title} className="p-4 rounded-2xl bg-white border border-slate-100 text-center hover:border-[#c5a044]/30 transition-all">
                  <span className="text-3xl">{c.emoji}</span>
                  <p className="text-sm font-bold mt-2 text-slate-700">{c.title}</p>
                  <p className="text-[10px] text-slate-400">{c.horas}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="contacto" className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-extrabold mb-6">Transforme su práctica clínica <span className="text-[#c5a044]">hoy</span></h2>
          <p className="text-xl text-slate-500 mb-10">Únase a las IPS y consultorios que ya digitalizaron su operación con ISSI.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/registro" className="px-10 py-5 rounded-full bg-[#0f2847] text-white font-extrabold text-xl hover:shadow-2xl hover:shadow-[#0f2847]/40 transition-all">Solicitar Demo Gratis</Link>
            <a href="https://wa.me/573146501052?text=Hola%2C%20quiero%20información%20sobre%20ISSI%20Telemedicina" target="_blank" rel="noopener noreferrer" className="px-10 py-5 rounded-full bg-[#c5a044] text-[#0a1628] font-extrabold text-xl hover:bg-[#d4af37] transition-all flex items-center justify-center gap-2">
              <span className="material-icons-outlined">chat</span>
              WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0a1628] text-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <img src="/logo-issi.png" alt="ISSI" className="w-10 h-10 rounded-full" />
                <span className="text-lg font-bold tracking-tight uppercase">ISSI</span>
              </div>
              <p className="text-white/50 text-sm max-w-sm">Instituto Superior de Salud Integral — Ecosistema de telemedicina SaaS para IPS y consultorios en Colombia.</p>
            </div>
            <div>
              <h5 className="font-bold mb-4 text-[#c5a044]">Plataforma</h5>
              <ul className="space-y-3 text-white/50 text-sm">
                <li><Link className="hover:text-[#c5a044]" href="/clinico">Centro Clínico</Link></li>
                <li><Link className="hover:text-[#c5a044]" href="/clinico/hce">Historia Clínica</Link></li>
                <li><Link className="hover:text-[#c5a044]" href="/clinico/agenda">Agenda</Link></li>
                <li><Link className="hover:text-[#c5a044]" href="/clinico/formula">Fórmulas</Link></li>
              </ul>
            </div>
            <div>
              <h5 className="font-bold mb-4 text-[#c5a044]">Educación</h5>
              <ul className="space-y-3 text-white/50 text-sm">
                <li><Link className="hover:text-[#c5a044]" href="/cursos">Catálogo de Cursos</Link></li>
                <li><Link className="hover:text-[#c5a044]" href="/registro">Registrarse</Link></li>
                <li><Link className="hover:text-[#c5a044]" href="/login">Iniciar Sesión</Link></li>
              </ul>
            </div>
            <div>
              <h5 className="font-bold mb-4 text-[#c5a044]">Contacto</h5>
              <ul className="space-y-3 text-white/50 text-sm">
                <li><a className="hover:text-[#c5a044]" href="https://wa.me/573146501052" target="_blank" rel="noopener noreferrer">+57 314 650 1052</a></li>
                <li><a className="hover:text-[#c5a044]" href="mailto:contacto@issi.edu.co">contacto@issi.edu.co</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-white/30">© 2026 ISSI — Instituto Superior de Salud Integral. Todos los derechos reservados.</p>
            <p className="text-xs text-white/30">Res. 1995/1999 · Res. 2654/2019 · Decreto 2200/2005 · Ley 1581/2012</p>
            <p className="text-xs text-white/20">Powered by <span className="font-semibold text-[#c5a044]/50">AINovaX</span></p>
          </div>
        </div>
      </footer>
    </div>
  );
}
