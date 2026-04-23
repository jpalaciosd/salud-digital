"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/lib/AuthContext";
import UserNav from "@/lib/UserNav";
import Link from "next/link";

interface Stats {
  consultas: number; hce: number; formulas: number;
  aiepi: number; consentimientos: number;
}

const MODULES_MEDICO = [
  { href: "/clinico/agenda", icon: "🩺", title: "Agenda Clínica", desc: "Gestionar consultas médicas", color: "border-blue-500/30 bg-blue-500/5" },
  { href: "/clinico/hce", icon: "📋", title: "Historia Clínica (HCE)", desc: "Crear registro clínico con CIE-10", color: "border-[#c5a044]/30 bg-[#c5a044]/5" },
  { href: "/clinico/formula", icon: "💊", title: "Fórmula Médica", desc: "Prescripción digital (Decreto 2200)", color: "border-purple-500/30 bg-purple-500/5" },
  { href: "/clinico/aiepi", icon: "🧒", title: "AIEPI Pediátrico", desc: "Evaluación integrada del niño", color: "border-green-500/30 bg-green-500/5" },
  { href: "/clinico/consentimiento", icon: "✅", title: "Consentimiento Informado", desc: "Res. 2654/2019 · Ley 1581/2012", color: "border-teal-500/30 bg-teal-500/5" },
];

const MODULES_ADMIN = [
  { href: "/clinico/auditor", icon: "🔍", title: "Panel de Auditoría", desc: "Trazabilidad completa del sistema", color: "border-red-500/30 bg-red-500/5" },
  { href: "/clinico/onboarding", icon: "🏢", title: "Registrar Organización", desc: "Configurar IPS / Consultorio", color: "border-indigo-500/30 bg-indigo-500/5" },
];

const MODULES_PACIENTE = [
  { href: "/clinico/agenda", icon: "📅", title: "Mis Consultas", desc: "Agendar y ver consultas", color: "border-blue-500/30 bg-blue-500/5" },
  { href: "/clinico/consentimiento", icon: "✅", title: "Consentimiento", desc: "Aceptar antes de teleconsulta", color: "border-teal-500/30 bg-teal-500/5" },
];

export default function ClinicoHub() {
  const { user, loading } = useAuth();
  const [stats, setStats] = useState<Stats>({ consultas: 0, hce: 0, formulas: 0, aiepi: 0, consentimientos: 0 });

  const rol = (user as Record<string, string>)?.rol || "paciente";
  const isMedical = ["medico", "profesional"].includes(rol);
  const isAdmin = ["admin", "super_admin", "auditor"].includes(rol);

  useEffect(() => {
    if (loading || !user) return;
    // Load stats in parallel
    Promise.allSettled([
      fetch("/api/clinico/consultas").then((r) => r.json()),
      fetch("/api/clinico/hce").then((r) => r.json()),
      fetch("/api/clinico/formulas").then((r) => r.json()),
    ]).then(([consultas, hce, formulas]) => {
      setStats({
        consultas: consultas.status === "fulfilled" ? (consultas.value.consultas?.length || 0) : 0,
        hce: hce.status === "fulfilled" ? (hce.value.registros?.length || 0) : 0,
        formulas: formulas.status === "fulfilled" ? (formulas.value.formulas?.length || 0) : 0,
        aiepi: 0,
        consentimientos: 0,
      });
    });
  }, [user, loading]);

  if (loading) return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
      <div className="animate-spin h-10 w-10 border-4 border-[#c5a044] border-t-transparent rounded-full" />
    </div>
  );

  const modules = [
    ...(isMedical || isAdmin ? MODULES_MEDICO : MODULES_PACIENTE),
    ...(isAdmin ? MODULES_ADMIN : []),
  ];

  return (
    <div className="min-h-screen bg-[#0f172a] text-white">
      <UserNav />
      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#c5a044]/30 to-[#0f2847] flex items-center justify-center text-3xl mx-auto mb-4">🏥</div>
          <h1 className="text-2xl font-bold">Centro Clínico ISSI</h1>
          <p className="text-gray-400 text-sm mt-1">Ecosistema de telemedicina · Resolución 2654/2019</p>
          <p className="text-xs text-gray-500 mt-1">Rol: <span className="text-[#c5a044]">{rol}</span> · {user?.nombre} {user?.apellido}</p>
        </div>

        {/* Quick stats */}
        {(isMedical || isAdmin) && (
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-center">
              <p className="text-xl font-bold text-[#c5a044]">{stats.consultas}</p>
              <p className="text-[10px] text-gray-400">Consultas</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-center">
              <p className="text-xl font-bold">{stats.hce}</p>
              <p className="text-[10px] text-gray-400">HCE</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-center">
              <p className="text-xl font-bold">{stats.formulas}</p>
              <p className="text-[10px] text-gray-400">Fórmulas</p>
            </div>
          </div>
        )}

        {/* Modules grid */}
        <div className="space-y-3">
          {modules.map((m) => (
            <Link key={m.href} href={m.href}
              className={`block p-4 rounded-2xl border transition-all hover:scale-[1.01] active:scale-[0.99] ${m.color}`}>
              <div className="flex items-center gap-4">
                <span className="text-3xl">{m.icon}</span>
                <div>
                  <h3 className="font-bold text-sm">{m.title}</h3>
                  <p className="text-xs text-gray-400">{m.desc}</p>
                </div>
                <span className="ml-auto text-gray-500">→</span>
              </div>
            </Link>
          ))}
        </div>

        {/* Education bridge */}
        <div className="mt-8 bg-gradient-to-r from-[#0f2847] to-[#c5a044]/10 border border-[#c5a044]/20 rounded-2xl p-5">
          <h3 className="font-bold text-sm text-[#c5a044] mb-2">🎓 Formación Continua</h3>
          <p className="text-xs text-gray-400 mb-3">Completa cursos ISSI para habilitar módulos clínicos avanzados y obtener certificaciones que respaldan tu práctica.</p>
          <Link href="/cursos" className="inline-block px-4 py-2 bg-[#c5a044] text-[#0f172a] rounded-xl text-xs font-bold">
            Ver catálogo de cursos →
          </Link>
        </div>

        {/* Compliance footer */}
        <div className="mt-6 text-center text-[10px] text-gray-600 space-y-1">
          <p>Resolución 1995/1999 (HCE) · Resolución 2654/2019 (Telemedicina)</p>
          <p>Ley 1581/2012 (Datos Personales) · Decreto 2200/2005 (Prescripción)</p>
          <p>ISSI — Instituto Superior de Salud Integral</p>
        </div>
      </div>
    </div>
  );
}
