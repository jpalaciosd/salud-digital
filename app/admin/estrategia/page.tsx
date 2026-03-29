"use client";

import { useAuth } from "@/lib/AuthContext";
import UserNav from "@/lib/UserNav";
import Link from "next/link";
import { useState, useEffect } from "react";

// ══════════════════════════════════════════════════════════════════════
// STRATEGIC PLAN — ISSI (Instituto Superior de Salud Integral)
// Designed for founder/CEO visibility and weekly execution tracking
// ══════════════════════════════════════════════════════════════════════

interface WeekPlan {
  week: number;
  dates: string;
  phase: string;
  theme: string;
  objectives: string[];
  actions: { task: string; owner: string; channel: string }[];
  kpis: { metric: string; target: number|string; unit: string }[];
}

const STRATEGIC_VISION = {
  mission: "Democratizar la educación en salud en Colombia a través de tecnología IA, haciendo accesible la formación certificada para profesionales y estudiantes del sector salud.",
  vision2026: "Ser la plataforma líder de educación virtual en salud en Colombia con +5,000 estudiantes activos y alianzas con instituciones de salud.",
  northStar: "Estudiantes que completan un curso y lo recomiendan",
  moat: "Tutor IA personalizado 24/7 (Aura) + tutorías con profesionales reales + certificación reconocida",
};

const OKRs = [
  {
    objective: "🚀 Crecimiento — Alcanzar masa crítica de usuarios",
    keyResults: [
      "500 usuarios registrados en 8 semanas",
      "60% de registrados se inscriben en al menos 1 curso",
      "30% de inscritos completan su primer módulo en la primera semana",
    ],
  },
  {
    objective: "🎓 Retención — Maximizar completación y certificación",
    keyResults: [
      "40% tasa de completación de cursos",
      "25% de completados obtienen certificado",
      "NPS > 70 (medido por calificación de tutorías ≥ 4/5)",
    ],
  },
  {
    objective: "👨‍⚕️ Oferta — Red de profesionales activos",
    keyResults: [
      "20 profesionales registrados en 8 semanas",
      "Tiempo promedio de asignación de tutoría < 24h",
      "Calificación promedio de tutorías ≥ 4.2/5",
    ],
  },
  {
    objective: "💰 Monetización — Validar modelo de ingresos",
    keyResults: [
      "Definir pricing de certificación (semana 4)",
      "Lanzar primer curso premium/pago (semana 6)",
      "Primeros 10 ingresos por certificación (semana 8)",
    ],
  },
];

const WEEKLY_PLAN: WeekPlan[] = [
  {
    week: 1,
    dates: "31 Mar — 6 Abr",
    phase: "🟢 Lanzamiento",
    theme: "Fundación y Primeros Usuarios",
    objectives: [
      "Validar flujo completo: registro → inscripción → Aura → progreso",
      "Conseguir los primeros 30 usuarios reales",
      "Activar 5 profesionales en la plataforma",
    ],
    actions: [
      { task: "Publicar en grupos de WhatsApp de estudiantes de salud (Cali, Bogotá)", owner: "Marketing", channel: "WhatsApp" },
      { task: "Crear contenido de lanzamiento: 3 reels mostrando Aura en acción", owner: "Marketing", channel: "Instagram/TikTok" },
      { task: "Enviar invitación personal a 20 profesionales de salud conocidos", owner: "CEO", channel: "WhatsApp directo" },
      { task: "Publicar en LinkedIn: 'Lanzamos ISSI — educación en salud con IA'", owner: "CEO", channel: "LinkedIn" },
      { task: "Test completo del flujo de certificación", owner: "Tech", channel: "Plataforma" },
      { task: "Configurar Google Analytics / pixel de seguimiento", owner: "Tech", channel: "Plataforma" },
    ],
    kpis: [
      { metric: "Usuarios registrados", target: 30, unit: "usuarios" },
      { metric: "Inscripciones a cursos", target: 20, unit: "inscripciones" },
      { metric: "Profesionales activos", target: 5, unit: "profesionales" },
      { metric: "Mensajes con Aura", target: 50, unit: "mensajes" },
    ],
  },
  {
    week: 2,
    dates: "7 — 13 Abr",
    phase: "🟢 Lanzamiento",
    theme: "Activación y Primer Feedback",
    objectives: [
      "Duplicar base de usuarios (30→60)",
      "Obtener primer feedback estructurado de 10 estudiantes",
      "Primera tutoría completada y calificada",
    ],
    actions: [
      { task: "Encuesta rápida a primeros usuarios (Google Forms): UX, Aura, contenido", owner: "Producto", channel: "WhatsApp" },
      { task: "Publicar testimonios de primeros usuarios (stories + posts)", owner: "Marketing", channel: "Instagram" },
      { task: "Contactar 3 universidades con programas de salud en Cali", owner: "CEO", channel: "Email/Presencial" },
      { task: "Crear landing de referidos: 'Invita a un colega, ambos ganan certificado gratis'", owner: "Tech", channel: "Plataforma" },
      { task: "Ajustar cursos según feedback (contenido, flujo Aura)", owner: "Contenido", channel: "Plataforma" },
      { task: "Email de bienvenida automatizado para nuevos registros", owner: "Tech", channel: "Email" },
    ],
    kpis: [
      { metric: "Usuarios registrados", target: 60, unit: "usuarios" },
      { metric: "Inscripciones a cursos", target: 45, unit: "inscripciones" },
      { metric: "Tutorías solicitadas", target: 5, unit: "tutorías" },
      { metric: "NPS / Feedback score", target: "≥ 4.0", unit: "/5" },
    ],
  },
  {
    week: 3,
    dates: "14 — 20 Abr",
    phase: "🟡 Tracción",
    theme: "Alianzas Institucionales",
    objectives: [
      "Cerrar primera alianza con universidad o clínica",
      "100 usuarios registrados",
      "Primeras 3 certificaciones emitidas",
    ],
    actions: [
      { task: "Presentar propuesta a 2 universidades: capacitación de estudiantes via ISSI", owner: "CEO", channel: "Presencial" },
      { task: "Contactar 3 clínicas/hospitales: 'Capacite su personal con ISSI'", owner: "Ventas", channel: "Email/Presencial" },
      { task: "Crear deck de ventas institucional (PDF + presentación)", owner: "Marketing", channel: "Canva/PDF" },
      { task: "Webinar gratuito: 'RCP para todos — demo en vivo con Aura'", owner: "Contenido", channel: "Zoom/YouTube" },
      { task: "Implementar sistema de certificados digitales descargables", owner: "Tech", channel: "Plataforma" },
      { task: "Crear página /empresas para B2B", owner: "Tech", channel: "Plataforma" },
    ],
    kpis: [
      { metric: "Usuarios registrados", target: 100, unit: "usuarios" },
      { metric: "Certificados emitidos", target: 3, unit: "certificados" },
      { metric: "Alianzas en conversación", target: 3, unit: "alianzas" },
      { metric: "Asistentes webinar", target: 30, unit: "personas" },
    ],
  },
  {
    week: 4,
    dates: "21 — 27 Abr",
    phase: "🟡 Tracción",
    theme: "Monetización y Contenido Premium",
    objectives: [
      "Definir modelo de precios (certificación paga + cursos premium)",
      "150 usuarios, 10 profesionales",
      "Lanzar programa de embajadores estudiantiles",
    ],
    actions: [
      { task: "Definir precios: Certificado $50K-100K COP, Curso premium $150K-300K COP", owner: "CEO/Finanzas", channel: "Interno" },
      { task: "Integrar pasarela de pagos (Wompi/MercadoPago)", owner: "Tech", channel: "Plataforma" },
      { task: "Reclutar 5 embajadores en universidades (comisión por referido)", owner: "Marketing", channel: "WhatsApp/Campus" },
      { task: "Crear curso premium piloto: 'ACLS Avanzado con Simulación'", owner: "Contenido", channel: "Plataforma" },
      { task: "Campaña de email: 'Completa tu curso y certifícate'", owner: "Marketing", channel: "Email" },
      { task: "Publicar caso de éxito: primer certificado emitido", owner: "Marketing", channel: "Redes sociales" },
    ],
    kpis: [
      { metric: "Usuarios registrados", target: 150, unit: "usuarios" },
      { metric: "Profesionales activos", target: 10, unit: "profesionales" },
      { metric: "Embajadores reclutados", target: 5, unit: "embajadores" },
      { metric: "Modelo de precios definido", target: "✅", unit: "" },
    ],
  },
  {
    week: 5,
    dates: "28 Abr — 4 May",
    phase: "🔵 Escalamiento",
    theme: "Escalar Adquisición",
    objectives: [
      "200 usuarios registrados",
      "Activar pauta digital (Meta Ads)",
      "Primera venta de certificación",
    ],
    actions: [
      { task: "Lanzar campaña Meta Ads: $200K-500K COP/semana, audiencia salud Colombia", owner: "Marketing", channel: "Meta Ads" },
      { task: "Crear funnel: Ad → Landing → Registro → Curso gratis → Upsell certificado", owner: "Marketing/Tech", channel: "Multi" },
      { task: "Publicar 5 reels educativos (tips de primeros auxilios, farmacología, RCP)", owner: "Contenido", channel: "Instagram/TikTok" },
      { task: "Optimizar SEO: blog posts sobre RCP, primeros auxilios en Colombia", owner: "Contenido", channel: "Blog/SEO" },
      { task: "Partnership con influencer de salud en Colombia", owner: "Marketing", channel: "Instagram" },
      { task: "Implementar notificaciones push para re-engagement", owner: "Tech", channel: "Plataforma" },
    ],
    kpis: [
      { metric: "Usuarios registrados", target: 200, unit: "usuarios" },
      { metric: "Costo por adquisición (CPA)", target: "< $5K", unit: "COP" },
      { metric: "Tasa conversión registro→inscripción", target: "60%", unit: "" },
      { metric: "Primera venta certificación", target: "✅", unit: "" },
    ],
  },
  {
    week: 6,
    dates: "5 — 11 May",
    phase: "🔵 Escalamiento",
    theme: "Producto Premium + B2B",
    objectives: [
      "300 usuarios, 15 profesionales",
      "Cerrar primer cliente B2B (universidad o clínica)",
      "5 ventas de certificación",
    ],
    actions: [
      { task: "Follow up a universidades y clínicas contactadas", owner: "Ventas", channel: "Email/Presencial" },
      { task: "Crear plan empresarial: paquete de 50-100 licencias con descuento", owner: "CEO", channel: "Propuesta" },
      { task: "Lanzar curso premium en la plataforma", owner: "Tech/Contenido", channel: "Plataforma" },
      { task: "Campaña retargeting: usuarios que no completaron inscripción", owner: "Marketing", channel: "Meta Ads" },
      { task: "Webinar #2: 'Farmacología práctica — aprende con IA'", owner: "Contenido", channel: "Zoom" },
      { task: "Implementar dashboard de progreso más visual para estudiantes", owner: "Tech", channel: "Plataforma" },
    ],
    kpis: [
      { metric: "Usuarios registrados", target: 300, unit: "usuarios" },
      { metric: "Profesionales activos", target: 15, unit: "profesionales" },
      { metric: "Ventas certificación", target: 5, unit: "ventas" },
      { metric: "Pipeline B2B", target: "1 cerrado", unit: "" },
    ],
  },
  {
    week: 7,
    dates: "12 — 18 May",
    phase: "🟣 Consolidación",
    theme: "Retención y Comunidad",
    objectives: [
      "400 usuarios, tasa completación > 35%",
      "Lanzar comunidad WhatsApp/Telegram de estudiantes ISSI",
      "10 ventas de certificación acumuladas",
    ],
    actions: [
      { task: "Crear grupo de comunidad ISSI (WhatsApp o Telegram)", owner: "Marketing", channel: "WhatsApp/Telegram" },
      { task: "Programa de fidelización: badges, logros, ranking de estudiantes", owner: "Tech", channel: "Plataforma" },
      { task: "Campaña de re-engagement: 'Vuelve a tu curso, te falta poco'", owner: "Marketing", channel: "Email/WhatsApp" },
      { task: "Crear 3 nuevos cursos basados en demanda de usuarios", owner: "Contenido", channel: "Plataforma" },
      { task: "Optimizar Aura: mejorar respuestas basado en feedback acumulado", owner: "Tech", channel: "Lambda" },
      { task: "Publicar métricas de impacto: 'X estudiantes capacitados en RCP'", owner: "Marketing", channel: "Redes" },
    ],
    kpis: [
      { metric: "Usuarios registrados", target: 400, unit: "usuarios" },
      { metric: "Tasa completación", target: "35%", unit: "" },
      { metric: "Ventas certificación (acum)", target: 10, unit: "ventas" },
      { metric: "Miembros comunidad", target: 50, unit: "miembros" },
    ],
  },
  {
    week: 8,
    dates: "19 — 25 May",
    phase: "🟣 Consolidación",
    theme: "Cierre de Ciclo + Planificación Q3",
    objectives: [
      "500 usuarios registrados (meta cumplida)",
      "Presentar resultados a posibles inversores/aliados",
      "Definir roadmap Q3 2026",
    ],
    actions: [
      { task: "Preparar deck de resultados: métricas, crecimiento, testimonios", owner: "CEO", channel: "Presentación" },
      { task: "Reunión con 2 posibles inversores o aceleradoras", owner: "CEO", channel: "Presencial/Zoom" },
      { task: "Análisis completo: qué funcionó, qué no, dónde optimizar", owner: "Equipo", channel: "Interno" },
      { task: "Planificar Q3: nuevos cursos, expansión a otras ciudades, app móvil", owner: "CEO/Producto", channel: "Interno" },
      { task: "Celebrar logros con el equipo y la comunidad", owner: "Todos", channel: "Evento" },
      { task: "Publicar caso de estudio: 'Cómo ISSI capacitó 500 profesionales con IA'", owner: "Marketing", channel: "LinkedIn/Blog" },
    ],
    kpis: [
      { metric: "Usuarios registrados", target: 500, unit: "usuarios" },
      { metric: "Ingresos por certificación", target: "$500K+", unit: "COP" },
      { metric: "Alianzas B2B cerradas", target: 2, unit: "alianzas" },
      { metric: "Deck de inversión listo", target: "✅", unit: "" },
    ],
  },
];

export default function EstrategiaPage() {
  const { user, loading: authLoading } = useAuth();
  const [expandedWeek, setExpandedWeek] = useState<number | null>(1);
  const [metrics, setMetrics] = useState<{ users: number; inscripciones: number; agendas: number; certificados: number; profesionales: number }>({ users: 0, inscripciones: 0, agendas: 0, certificados: 0, profesionales: 0 });

  useEffect(() => {
    fetch("/api/admin/metrics").then(r => r.ok ? r.json() : {}).then(data => {
      const users = data.users || [];
      const inscripciones = data.inscripciones || [];
      setMetrics({
        users: users.length,
        inscripciones: inscripciones.length,
        agendas: (data.agendas || []).length,
        certificados: inscripciones.filter((i: Record<string,unknown>) => i.certificadoFecha).length,
        profesionales: users.filter((u: Record<string,string>) => u.rol === "profesional").length,
      });
    });
  }, []);

  if (authLoading) return <div className="min-h-screen bg-[#0f172a] flex items-center justify-center"><div className="animate-spin h-10 w-10 border-4 border-[#c5a044] border-t-transparent rounded-full" /></div>;

  if (!user || (user as Record<string,string>).rol !== "admin") return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center text-white text-center">
      <div><p className="text-4xl mb-4">🔒</p><p className="text-xl font-bold">Acceso Restringido</p><Link href="/" className="mt-4 inline-block px-6 py-2 bg-[#c5a044] text-[#0f172a] rounded-lg font-bold">Volver</Link></div>
    </div>
  );

  // Determine current week based on real progress
  const currentWeekIdx = 0; // Start at week 1

  return (
    <div className="min-h-screen bg-[#0f172a] text-white">
      <UserNav />
      <div className="max-w-5xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-extrabold">Estrategia <span className="text-[#c5a044]">ISSI</span></h1>
            <p className="text-gray-400 mt-1">Plan de ejecución semanal — 8 semanas</p>
          </div>
          <Link href="/admin" className="px-4 py-2 bg-white/10 rounded-xl text-sm font-semibold hover:bg-white/20 transition flex items-center gap-2">
            <span className="material-icons-outlined text-lg">analytics</span> Métricas
          </Link>
        </div>

        {/* Mission & Vision */}
        <div className="bg-gradient-to-r from-[#c5a044]/10 to-[#eab308]/5 rounded-2xl p-6 border border-[#c5a044]/20 mb-8">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <p className="text-xs text-[#c5a044] font-bold uppercase tracking-wider mb-2">Misión</p>
              <p className="text-sm text-gray-300 leading-relaxed">{STRATEGIC_VISION.mission}</p>
            </div>
            <div>
              <p className="text-xs text-[#c5a044] font-bold uppercase tracking-wider mb-2">Visión 2026</p>
              <p className="text-sm text-gray-300 leading-relaxed">{STRATEGIC_VISION.vision2026}</p>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-6 mt-4 pt-4 border-t border-[#c5a044]/10">
            <div>
              <p className="text-xs text-[#c5a044] font-bold uppercase tracking-wider mb-2">⭐ North Star Metric</p>
              <p className="text-white font-semibold">{STRATEGIC_VISION.northStar}</p>
            </div>
            <div>
              <p className="text-xs text-[#c5a044] font-bold uppercase tracking-wider mb-2">🏰 Ventaja Competitiva</p>
              <p className="text-sm text-gray-300">{STRATEGIC_VISION.moat}</p>
            </div>
          </div>
        </div>

        {/* OKRs */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><span className="material-icons-outlined text-[#c5a044]">flag</span> OKRs — 8 Semanas</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {OKRs.map((okr, i) => (
              <div key={i} className="bg-white/5 rounded-2xl p-5 border border-white/10">
                <h3 className="font-bold text-sm mb-3">{okr.objective}</h3>
                <ul className="space-y-2">
                  {okr.keyResults.map((kr, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm text-gray-300">
                      <span className="text-[#c5a044] mt-0.5">◆</span>
                      <span>{kr}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Real-time progress vs targets */}
        <div className="bg-white/5 rounded-2xl p-6 border border-white/10 mb-8">
          <h2 className="font-bold mb-4 flex items-center gap-2"><span className="material-icons-outlined text-green-400">speed</span> Progreso Real vs Meta</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { label: "Usuarios", actual: metrics.users, target: 500, icon: "people" },
              { label: "Inscripciones", actual: metrics.inscripciones, target: 300, icon: "school" },
              { label: "Certificados", actual: metrics.certificados, target: 50, icon: "workspace_premium" },
              { label: "Profesionales", actual: metrics.profesionales, target: 20, icon: "assignment_ind" },
              { label: "Tutorías", actual: metrics.agendas, target: 30, icon: "event" },
            ].map((m, i) => {
              const pct = typeof m.target === "number" && m.target > 0 ? Math.min(100, Math.round(m.actual / m.target * 100)) : 0;
              return (
                <div key={i} className="text-center">
                  <span className="material-icons-outlined text-2xl text-gray-500">{m.icon}</span>
                  <p className="text-2xl font-extrabold mt-1">{m.actual}<span className="text-sm text-gray-500">/{m.target}</span></p>
                  <p className="text-xs text-gray-400">{m.label}</p>
                  <div className="h-1.5 bg-white/5 rounded-full mt-2 overflow-hidden">
                    <div className={`h-full rounded-full ${pct >= 100 ? "bg-green-500" : pct >= 50 ? "bg-[#c5a044]" : "bg-blue-500"}`} style={{width: `${pct}%`}} />
                  </div>
                  <p className="text-xs mt-1 font-bold" style={{color: pct >= 100 ? "#22c55e" : pct >= 50 ? "#c5a044" : "#3b82f6"}}>{pct}%</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Weekly Timeline */}
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><span className="material-icons-outlined text-[#c5a044]">calendar_month</span> Plan Semanal</h2>
        <div className="space-y-3">
          {WEEKLY_PLAN.map((week, idx) => {
            const isExpanded = expandedWeek === week.week;
            const isCurrent = idx === currentWeekIdx;
            return (
              <div key={week.week} className={`rounded-2xl border transition-all ${
                isCurrent ? "border-[#c5a044]/50 bg-[#c5a044]/5" : "border-white/10 bg-white/5"
              }`}>
                <button
                  onClick={() => setExpandedWeek(isExpanded ? null : week.week)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                      isCurrent ? "bg-[#c5a044] text-[#0f172a]" : "bg-white/10 text-gray-400"
                    }`}>S{week.week}</div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold">{week.theme}</span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-gray-400">{week.phase}</span>
                        {isCurrent && <span className="text-xs px-2 py-0.5 rounded-full bg-[#c5a044]/20 text-[#c5a044] font-bold">ACTUAL</span>}
                      </div>
                      <p className="text-xs text-gray-500">{week.dates}</p>
                    </div>
                  </div>
                  <span className={`material-icons-outlined text-gray-400 transition-transform ${isExpanded ? "rotate-180" : ""}`}>expand_more</span>
                </button>

                {isExpanded && (
                  <div className="px-5 pb-5 space-y-4">
                    {/* Objectives */}
                    <div>
                      <p className="text-xs text-[#c5a044] font-bold uppercase tracking-wider mb-2">🎯 Objetivos</p>
                      <ul className="space-y-1">
                        {week.objectives.map((o, i) => (
                          <li key={i} className="text-sm text-gray-300 flex items-start gap-2">
                            <span className="text-green-400 mt-0.5">○</span> {o}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Actions */}
                    <div>
                      <p className="text-xs text-[#c5a044] font-bold uppercase tracking-wider mb-2">📋 Acciones</p>
                      <div className="space-y-2">
                        {week.actions.map((a, i) => (
                          <div key={i} className="flex items-start gap-3 text-sm bg-white/5 rounded-lg p-3">
                            <input type="checkbox" className="mt-0.5 accent-[#c5a044]" />
                            <div className="flex-1">
                              <p className="text-gray-200">{a.task}</p>
                              <div className="flex gap-2 mt-1">
                                <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400">{a.owner}</span>
                                <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-400">{a.channel}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* KPIs */}
                    <div>
                      <p className="text-xs text-[#c5a044] font-bold uppercase tracking-wider mb-2">📊 Umbrales (KPIs)</p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {week.kpis.map((k, i) => (
                          <div key={i} className="bg-white/5 rounded-xl p-3 text-center">
                            <p className="text-lg font-bold text-[#c5a044]">{k.target}</p>
                            <p className="text-xs text-gray-400">{k.metric}</p>
                            {k.unit && <p className="text-xs text-gray-500">{k.unit}</p>}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer CTA */}
        <div className="mt-8 text-center">
          <p className="text-gray-500 text-sm">Plan estratégico generado por NIA — actualizado en tiempo real con métricas de la plataforma</p>
        </div>
      </div>
    </div>
  );
}
