"use client";

import { useAuth } from "@/lib/AuthContext";
import UserNav from "@/lib/UserNav";
import Link from "next/link";
import { useState, useEffect } from "react";

interface UserData { id: string; email: string; nombre: string; apellido: string; rol: string; createdAt: string; telefono?: string; }
interface InscripcionData { id: string; userId: string; cursoId: string; cursoTitulo: string; estado: string; completedItems: string[]; evaluacionNota: number|null; evaluacionAprobada: boolean; certificadoFecha: string|null; createdAt: string; }
interface AgendaData { id: string; estudianteNombre: string; cursoNombre: string; estado: string; profesionalNombre: string|null; calificacion: number|null; modalidad: string; createdAt: string; }
interface CursoData { id: string; titulo: string; totalModulos?: number; duracionHoras: number; }
interface PagoData {
  id: string;
  userId: string;
  userNombre: string;
  userEmail: string;
  cursoId: string;
  cursoTitulo: string;
  montoEsperado: number;
  imagenUrl: string;
  estado: "pendiente_ia" | "aprobado_auto" | "revision_manual" | "aprobado_manual" | "rechazado" | "canjeado";
  codigoCanje: string | null;
  motivoRechazo?: string;
  iaData?: { confianza: number; monto?: number; titular?: string; last4?: string };
  createdAt: string;
}
interface PromoData {
  id: string;
  descripcion: string;
  porcentaje: number;
  validoDesde: string;
  validoHasta: string | null;
  usosMaximos: number | null;
  usosActuales: number;
  unoPorUsuario: boolean;
  activo: boolean;
  createdBy: string;
  createdAt: string;
}

export default function AdminPage() {
  const { user, loading: authLoading } = useAuth();
  const [users, setUsers] = useState<UserData[]>([]);
  const [inscripciones, setInscrips] = useState<InscripcionData[]>([]);
  const [agendas, setAgendas] = useState<AgendaData[]>([]);
  const [cursos, setCursos] = useState<CursoData[]>([]);
  const [pagos, setPagos] = useState<PagoData[]>([]);
  const [promos, setPromos] = useState<PromoData[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"overview"|"users"|"cursos"|"agendas"|"pagos"|"promos"|"growth">("overview");

  const recargarPromos = () => {
    fetch("/api/admin/promos")
      .then(r => r.ok ? r.json() : {})
      .then(data => setPromos(data.promos || []));
  };

  const recargar = () => {
    fetch("/api/admin/metrics")
      .then(r => r.ok ? r.json() : {})
      .then(data => {
        setUsers(data.users || []);
        setInscrips(data.inscripciones || []);
        setAgendas(data.agendas || []);
        setCursos(data.cursos || []);
        setPagos(data.pagos || []);
      });
    recargarPromos();
  };

  useEffect(() => {
    if (authLoading) return;
    Promise.all([
      fetch("/api/admin/metrics").then(r => r.ok ? r.json() : {}),
      fetch("/api/admin/promos").then(r => r.ok ? r.json() : {}),
    ]).then(([data, promoData]) => {
      setUsers(data.users || []);
      setInscrips(data.inscripciones || []);
      setAgendas(data.agendas || []);
      setCursos(data.cursos || []);
      setPagos(data.pagos || []);
      setPromos(promoData.promos || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [authLoading]);

  if (authLoading || loading) return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
      <div className="animate-spin h-10 w-10 border-4 border-[#c5a044] border-t-transparent rounded-full" />
    </div>
  );

  if (!user || (user as Record<string,string>).rol !== "admin") return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center text-white">
      <div className="text-center">
        <p className="text-4xl mb-4">🔒</p>
        <p className="text-xl font-bold mb-2">Acceso Restringido</p>
        <p className="text-gray-400">Solo administradores pueden ver este panel.</p>
        <Link href="/dashboard" className="mt-4 inline-block px-6 py-2 bg-[#c5a044] text-[#0f172a] rounded-lg font-bold">Ir al Dashboard</Link>
      </div>
    </div>
  );

  // ── Compute Metrics ──
  const totalUsers = users.length;
  const estudiantes = users.filter(u => u.rol === "estudiante");
  const profesionales = users.filter(u => u.rol === "profesional");
  const totalInscripciones = inscripciones.length;
  const insActivas = inscripciones.filter(i => i.estado === "activa");
  const insCompletadas = inscripciones.filter(i => i.estado === "completada");
  const certificados = inscripciones.filter(i => i.certificadoFecha);
  const totalAgendas = agendas.length;
  const agendasCompletadas = agendas.filter(a => a.estado === "completada");
  const agendasPendientes = agendas.filter(a => a.estado === "pendiente");
  const calificaciones = agendas.filter(a => a.calificacion).map(a => a.calificacion as number);
  const promCalif = calificaciones.length ? (calificaciones.reduce((s,c) => s+c, 0) / calificaciones.length).toFixed(1) : "—";

  // Course popularity
  const cursoInscritos: Record<string, number> = {};
  inscripciones.forEach(i => { cursoInscritos[i.cursoTitulo || i.cursoId] = (cursoInscritos[i.cursoTitulo || i.cursoId] || 0) + 1; });
  const cursoRanking = Object.entries(cursoInscritos).sort((a,b) => b[1] - a[1]);

  // Role distribution
  const rolCount: Record<string, number> = {};
  users.forEach(u => { rolCount[u.rol] = (rolCount[u.rol] || 0) + 1; });

  // Registrations over time (last 30 days)
  const now = new Date();
  const days30 = Array.from({length: 30}, (_, i) => {
    const d = new Date(now); d.setDate(d.getDate() - 29 + i);
    return d.toISOString().slice(0, 10);
  });
  const regByDay: Record<string, number> = {};
  users.forEach(u => { const d = (u.createdAt || "").slice(0, 10); regByDay[d] = (regByDay[d] || 0) + 1; });
  const maxReg = Math.max(1, ...days30.map(d => regByDay[d] || 0));

  // Inscripciones over time
  const inscByDay: Record<string, number> = {};
  inscripciones.forEach(i => { const d = (i.createdAt || "").slice(0, 10); inscByDay[d] = (inscByDay[d] || 0) + 1; });
  const maxInsc = Math.max(1, ...days30.map(d => inscByDay[d] || 0));

  // ── Pagos metrics ──
  const pagosRevisionManual = pagos.filter(p => p.estado === "revision_manual");
  const pagosAprobados = pagos.filter(p => p.estado === "aprobado_auto" || p.estado === "aprobado_manual" || p.estado === "canjeado");
  const pagosRechazados = pagos.filter(p => p.estado === "rechazado");
  const ingresosTotales = pagosAprobados.reduce((s, p) => s + (p.montoEsperado || 0), 0);
  const tasaAutoAprobacion = pagos.length > 0
    ? Math.round((pagos.filter(p => p.estado === "aprobado_auto" || p.estado === "canjeado").length / pagos.length) * 100)
    : 0;

  const decidirPago = async (pagoId: string, decision: "aprobar" | "rechazar", motivo?: string) => {
    const res = await fetch(`/api/admin/pagos/${pagoId}/decidir`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ decision, motivo }),
    });
    if (res.ok) recargar();
  };

  const tabs = [
    { id: "overview", label: "Resumen", icon: "dashboard" },
    { id: "users", label: "Usuarios", icon: "people" },
    { id: "cursos", label: "Cursos", icon: "school" },
    { id: "agendas", label: "Tutorías", icon: "event" },
    { id: "pagos", label: "Pagos", icon: "payments" },
    { id: "promos", label: "Promos", icon: "local_offer" },
    { id: "growth", label: "Crecimiento", icon: "trending_up" },
  ];

  // ── Promo metrics ──
  const promosActivos = promos.filter(p => p.activo);
  const usosTotales = promos.reduce((s, p) => s + (p.usosActuales || 0), 0);
  const descuentosTotales = pagos.reduce((s, p) => s + ((p as PagoData & { descuentoAplicado?: number }).descuentoAplicado || 0), 0);

  const togglePromo = async (id: string, activo: boolean) => {
    const res = await fetch(`/api/admin/promos/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ activo }),
    });
    if (res.ok) recargarPromos();
  };

  const eliminarPromo = async (id: string) => {
    if (!window.confirm(`¿Eliminar el código ${id}? No se puede deshacer.`)) return;
    const res = await fetch(`/api/admin/promos/${id}`, { method: "DELETE" });
    if (res.ok) recargarPromos();
  };

  const crearPromo = async (form: HTMLFormElement) => {
    const fd = new FormData(form);
    const body = {
      codigo: String(fd.get("codigo") || "").trim(),
      descripcion: String(fd.get("descripcion") || ""),
      porcentaje: Number(fd.get("porcentaje") || 0),
      validoDesde: fd.get("validoDesde") ? new Date(String(fd.get("validoDesde"))).toISOString() : new Date().toISOString(),
      validoHasta: fd.get("validoHasta") ? new Date(String(fd.get("validoHasta"))).toISOString() : null,
      usosMaximos: fd.get("usosMaximos") ? Number(fd.get("usosMaximos")) : null,
      unoPorUsuario: fd.get("unoPorUsuario") === "on",
    };
    const res = await fetch("/api/admin/promos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (!res.ok) {
      window.alert(data.error || "Error al crear");
      return;
    }
    form.reset();
    recargarPromos();
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-white">
      <UserNav />

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold">Panel de Control <span className="text-[#c5a044]">ISSI</span></h1>
          <p className="text-gray-400 mt-1">Métricas en tiempo real del ecosistema educativo</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id as typeof tab)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition ${
                tab === t.id ? "bg-[#c5a044] text-[#0f172a]" : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
              }`}>
              <span className="material-icons-outlined text-lg">{t.icon}</span>{t.label}
            </button>
          ))}
        </div>

        {/* ═══ OVERVIEW ═══ */}
        {tab === "overview" && (
          <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <KPI icon="people" label="Usuarios Totales" value={totalUsers} color="blue" />
              <KPI icon="school" label="Inscripciones" value={totalInscripciones} color="green" />
              <KPI icon="workspace_premium" label="Certificados" value={certificados.length} color="gold" />
              <KPI icon="event" label="Tutorías" value={totalAgendas} color="purple" />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Roles */}
              <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                <h3 className="font-bold mb-4 flex items-center gap-2"><span className="material-icons-outlined text-[#c5a044]">pie_chart</span> Distribución de Roles</h3>
                <div className="space-y-3">
                  {Object.entries(rolCount).map(([rol, count]) => (
                    <div key={rol}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="capitalize">{rol === "estudiante" ? "👩‍🎓 Estudiantes" : rol === "profesional" ? "👨‍⚕️ Profesionales" : rol === "admin" ? "👑 Admins" : `📋 ${rol}`}</span>
                        <span className="text-gray-400">{count} ({totalUsers ? Math.round(count/totalUsers*100) : 0}%)</span>
                      </div>
                      <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-[#c5a044] to-[#eab308] rounded-full transition-all" style={{width: `${totalUsers ? (count/totalUsers*100) : 0}%`}} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Popular Courses */}
              <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                <h3 className="font-bold mb-4 flex items-center gap-2"><span className="material-icons-outlined text-[#c5a044]">trending_up</span> Cursos más Populares</h3>
                {cursoRanking.length === 0 ? <p className="text-gray-500 text-sm">Sin datos</p> : (
                  <div className="space-y-3">
                    {cursoRanking.slice(0, 7).map(([nombre, count], i) => (
                      <div key={nombre} className="flex items-center gap-3">
                        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${i === 0 ? "bg-[#c5a044] text-[#0f172a]" : "bg-white/10 text-gray-400"}`}>{i+1}</span>
                        <span className="flex-1 text-sm truncate">{nombre}</span>
                        <span className="text-sm text-gray-400">{count} inscr.</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Funnel */}
            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
              <h3 className="font-bold mb-4 flex items-center gap-2"><span className="material-icons-outlined text-[#c5a044]">filter_alt</span> Embudo de Conversión</h3>
              <div className="flex items-end gap-4 justify-center h-40">
                {[
                  { label: "Registrados", val: totalUsers, color: "from-blue-500 to-blue-600" },
                  { label: "Inscritos", val: totalInscripciones, color: "from-cyan-500 to-cyan-600" },
                  { label: "Activos", val: insActivas.length, color: "from-green-500 to-green-600" },
                  { label: "Completados", val: insCompletadas.length, color: "from-amber-500 to-amber-600" },
                  { label: "Certificados", val: certificados.length, color: "from-[#c5a044] to-[#eab308]" },
                ].map((step, i) => {
                  const h = totalUsers ? Math.max(10, (step.val / Math.max(totalUsers, 1)) * 100) : 10;
                  return (
                    <div key={i} className="flex flex-col items-center gap-2 flex-1">
                      <span className="text-lg font-bold">{step.val}</span>
                      <div className={`w-full rounded-t-lg bg-gradient-to-t ${step.color}`} style={{height: `${h}%`, minHeight: "16px"}} />
                      <span className="text-xs text-gray-400 text-center">{step.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Tutorias metrics */}
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-white/5 rounded-2xl p-5 border border-white/10 text-center">
                <p className="text-3xl font-bold text-green-400">{agendasCompletadas.length}</p>
                <p className="text-sm text-gray-400 mt-1">Tutorías Completadas</p>
              </div>
              <div className="bg-white/5 rounded-2xl p-5 border border-white/10 text-center">
                <p className="text-3xl font-bold text-yellow-400">{agendasPendientes.length}</p>
                <p className="text-sm text-gray-400 mt-1">Esperando Profesional</p>
              </div>
              <div className="bg-white/5 rounded-2xl p-5 border border-white/10 text-center">
                <p className="text-3xl font-bold text-[#c5a044]">⭐ {promCalif}</p>
                <p className="text-sm text-gray-400 mt-1">Calificación Promedio</p>
              </div>
            </div>
          </div>
        )}

        {/* ═══ USERS ═══ */}
        {tab === "users" && (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4 mb-4">
              <KPI icon="people" label="Total" value={totalUsers} color="blue" />
              <KPI icon="school" label="Estudiantes" value={estudiantes.length} color="green" />
              <KPI icon="assignment_ind" label="Profesionales" value={profesionales.length} color="purple" />
            </div>
            <div className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/10 text-left">
                      <th className="px-4 py-3 font-semibold text-gray-400">Nombre</th>
                      <th className="px-4 py-3 font-semibold text-gray-400">Email</th>
                      <th className="px-4 py-3 font-semibold text-gray-400">Rol</th>
                      <th className="px-4 py-3 font-semibold text-gray-400">Registro</th>
                      <th className="px-4 py-3 font-semibold text-gray-400">Inscripciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map(u => {
                      const userInscs = inscripciones.filter(i => i.userId === u.id);
                      return (
                        <tr key={u.id} className="border-b border-white/5 hover:bg-white/5 transition">
                          <td className="px-4 py-3 font-medium">{u.nombre} {u.apellido}</td>
                          <td className="px-4 py-3 text-gray-400">{u.email}</td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                              u.rol === "admin" ? "bg-[#c5a044]/20 text-[#c5a044]" :
                              u.rol === "profesional" ? "bg-purple-500/20 text-purple-400" :
                              "bg-blue-500/20 text-blue-400"
                            }`}>{u.rol}</span>
                          </td>
                          <td className="px-4 py-3 text-gray-400">{u.createdAt?.slice(0,10) || "—"}</td>
                          <td className="px-4 py-3 text-center">{userInscs.length}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ═══ CURSOS ═══ */}
        {tab === "cursos" && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <KPI icon="school" label="Cursos Activos" value={cursos.length} color="blue" />
              <KPI icon="how_to_reg" label="Total Inscripciones" value={totalInscripciones} color="green" />
              <KPI icon="check_circle" label="Completadas" value={insCompletadas.length} color="gold" />
              <KPI icon="percent" label="Tasa Completación" value={`${totalInscripciones ? Math.round(insCompletadas.length/totalInscripciones*100) : 0}%`} color="purple" />
            </div>
            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
              <h3 className="font-bold mb-4">Rendimiento por Curso</h3>
              <div className="space-y-4">
                {cursos.map(c => {
                  const cInscs = inscripciones.filter(i => i.cursoId === c.id);
                  const cComp = cInscs.filter(i => i.estado === "completada");
                  const cCert = cInscs.filter(i => i.certificadoFecha);
                  const pct = cInscs.length ? Math.round(cComp.length/cInscs.length*100) : 0;
                  return (
                    <div key={c.id} className="bg-white/5 rounded-xl p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-semibold">{c.titulo}</h4>
                          <p className="text-xs text-gray-400">{c.duracionHoras}h · {c.totalModulos || "—"} módulos</p>
                        </div>
                        <span className="text-sm font-bold text-[#c5a044]">{cInscs.length} inscritos</span>
                      </div>
                      <div className="grid grid-cols-4 gap-2 text-center text-xs mt-3">
                        <div className="bg-white/5 rounded-lg p-2"><p className="text-lg font-bold text-blue-400">{cInscs.length}</p><p className="text-gray-500">Inscritos</p></div>
                        <div className="bg-white/5 rounded-lg p-2"><p className="text-lg font-bold text-green-400">{cComp.length}</p><p className="text-gray-500">Completados</p></div>
                        <div className="bg-white/5 rounded-lg p-2"><p className="text-lg font-bold text-[#c5a044]">{cCert.length}</p><p className="text-gray-500">Certificados</p></div>
                        <div className="bg-white/5 rounded-lg p-2"><p className="text-lg font-bold text-purple-400">{pct}%</p><p className="text-gray-500">Completación</p></div>
                      </div>
                      <div className="h-1.5 bg-white/5 rounded-full mt-3 overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-[#c5a044] to-[#eab308] rounded-full" style={{width: `${pct}%`}} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ═══ AGENDAS ═══ */}
        {tab === "agendas" && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <KPI icon="event" label="Total" value={totalAgendas} color="blue" />
              <KPI icon="hourglass_top" label="Pendientes" value={agendasPendientes.length} color="gold" />
              <KPI icon="check" label="Completadas" value={agendasCompletadas.length} color="green" />
              <KPI icon="star" label="Calificación" value={promCalif} color="purple" />
            </div>
            <div className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden">
              <table className="w-full text-sm">
                <thead><tr className="border-b border-white/10 text-left">
                  <th className="px-4 py-3 text-gray-400">Estudiante</th>
                  <th className="px-4 py-3 text-gray-400">Curso</th>
                  <th className="px-4 py-3 text-gray-400">Modalidad</th>
                  <th className="px-4 py-3 text-gray-400">Profesional</th>
                  <th className="px-4 py-3 text-gray-400">Estado</th>
                  <th className="px-4 py-3 text-gray-400">⭐</th>
                </tr></thead>
                <tbody>
                  {agendas.sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map(a => (
                    <tr key={a.id} className="border-b border-white/5 hover:bg-white/5">
                      <td className="px-4 py-3">{a.estudianteNombre}</td>
                      <td className="px-4 py-3 text-gray-400">{a.cursoNombre}</td>
                      <td className="px-4 py-3">{a.modalidad === "virtual" ? "🖥" : "🏫"} {a.modalidad}</td>
                      <td className="px-4 py-3">{a.profesionalNombre || <span className="text-yellow-500">Sin asignar</span>}</td>
                      <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                        a.estado === "completada" ? "bg-green-500/20 text-green-400" :
                        a.estado === "aceptada" ? "bg-blue-500/20 text-blue-400" :
                        a.estado === "pendiente" ? "bg-yellow-500/20 text-yellow-400" :
                        "bg-red-500/20 text-red-400"
                      }`}>{a.estado}</span></td>
                      <td className="px-4 py-3 text-center">{a.calificacion ? `${a.calificacion}/5` : "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ═══ PAGOS ═══ */}
        {tab === "pagos" && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
              <KPI icon="payments" label="Total pagos" value={pagos.length} color="blue" />
              <KPI icon="hourglass_top" label="En revisión" value={pagosRevisionManual.length} color="gold" />
              <KPI icon="check_circle" label="Aprobados" value={pagosAprobados.length} color="green" />
              <KPI icon="cancel" label="Rechazados" value={pagosRechazados.length} color="purple" />
              <KPI icon="auto_awesome" label="Auto-aprobado IA" value={`${tasaAutoAprobacion}%`} color="gold" />
            </div>

            <div className="bg-white/5 rounded-2xl p-5 border border-white/10 flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Ingresos totales (pagos aprobados + canjeados)</p>
                <p className="text-3xl font-extrabold text-[#c5a044] mt-1">{pagosAprobados.length} pagos</p>
              </div>
              <Link href="/admin/enlaces-pago" className="px-5 py-3 rounded-xl bg-[#c5a044] text-[#0f172a] font-bold hover:opacity-90 flex items-center gap-2">
                <span className="material-icons-outlined text-lg">qr_code_2</span>
                Enlaces / QR
              </Link>
            </div>

            {/* Cola de revisión */}
            <div className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden">
              <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-icons-outlined text-amber-400">priority_high</span>
                  <h3 className="font-bold">Cola de revisión manual ({pagosRevisionManual.length})</h3>
                </div>
                <Link href="/admin/pagos" className="text-xs text-[#c5a044] hover:underline">Ver vista completa →</Link>
              </div>

              {pagosRevisionManual.length === 0 ? (
                <p className="text-center text-gray-500 py-10">No hay pagos pendientes de revisión 🎉</p>
              ) : (
                <div className="divide-y divide-white/5">
                  {pagosRevisionManual.map(p => (
                    <div key={p.id} className="p-4 grid md:grid-cols-[120px_1fr_auto] gap-4 items-start">
                      <a href={p.imagenUrl} target="_blank" rel="noopener noreferrer">
                        <img src={p.imagenUrl} alt="Comprobante" className="w-full h-28 object-cover rounded-lg border border-white/10 hover:opacity-80" />
                      </a>
                      <div className="space-y-1 text-sm">
                        <p className="font-semibold">{p.cursoTitulo} · <span className="text-[#c5a044]">${p.montoEsperado.toLocaleString("es-CO")}</span></p>
                        <p className="text-gray-400">{p.userNombre} · {p.userEmail}</p>
                        {p.iaData && (
                          <p className="text-xs text-gray-500">
                            IA: confianza {(p.iaData.confianza * 100).toFixed(0)}%
                            {p.iaData.monto !== undefined && ` · monto detectado $${p.iaData.monto.toLocaleString("es-CO")}`}
                            {p.iaData.titular && ` · titular "${p.iaData.titular}"`}
                          </p>
                        )}
                        {p.motivoRechazo && (
                          <p className="text-xs text-amber-400 bg-amber-500/10 rounded p-2">⚠️ {p.motivoRechazo}</p>
                        )}
                      </div>
                      <div className="flex md:flex-col gap-2">
                        <button
                          onClick={() => decidirPago(p.id, "aprobar")}
                          className="px-4 py-2 rounded-lg bg-green-600 text-white text-sm font-semibold hover:bg-green-700"
                        >
                          ✓ Aprobar
                        </button>
                        <button
                          onClick={() => {
                            const motivo = window.prompt("Motivo del rechazo (lo verá el usuario):") || "";
                            if (motivo.trim()) decidirPago(p.id, "rechazar", motivo.trim());
                          }}
                          className="px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-semibold hover:bg-red-700"
                        >
                          ✗ Rechazar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Historial reciente */}
            <div className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden">
              <div className="px-5 py-4 border-b border-white/10 flex items-center gap-2">
                <span className="material-icons-outlined text-blue-400">history</span>
                <h3 className="font-bold">Pagos recientes</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/10 text-left">
                      <th className="px-4 py-3 text-gray-400">Fecha</th>
                      <th className="px-4 py-3 text-gray-400">Usuario</th>
                      <th className="px-4 py-3 text-gray-400">Curso</th>
                      <th className="px-4 py-3 text-gray-400">Monto</th>
                      <th className="px-4 py-3 text-gray-400">Estado</th>
                      <th className="px-4 py-3 text-gray-400">Código</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pagos.length === 0 ? (
                      <tr><td colSpan={6} className="text-center text-gray-500 py-8">Aún no hay pagos.</td></tr>
                    ) : (
                      [...pagos]
                        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                        .slice(0, 20)
                        .map(p => (
                          <tr key={p.id} className="border-b border-white/5 hover:bg-white/5">
                            <td className="px-4 py-3 text-gray-400 whitespace-nowrap">{p.createdAt?.slice(0, 16).replace("T", " ")}</td>
                            <td className="px-4 py-3">{p.userNombre}</td>
                            <td className="px-4 py-3 text-gray-400">{p.cursoTitulo}</td>
                            <td className="px-4 py-3 font-semibold text-[#c5a044]">${p.montoEsperado.toLocaleString("es-CO")}</td>
                            <td className="px-4 py-3">
                              <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                                p.estado === "aprobado_auto" || p.estado === "canjeado" ? "bg-green-500/20 text-green-400" :
                                p.estado === "aprobado_manual" ? "bg-cyan-500/20 text-cyan-400" :
                                p.estado === "revision_manual" ? "bg-yellow-500/20 text-yellow-400" :
                                p.estado === "rechazado" ? "bg-red-500/20 text-red-400" :
                                "bg-gray-500/20 text-gray-400"
                              }`}>{p.estado.replace("_", " ")}</span>
                            </td>
                            <td className="px-4 py-3 font-mono text-xs text-gray-400">{p.codigoCanje || "—"}</td>
                          </tr>
                        ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ═══ PROMOS ═══ */}
        {tab === "promos" && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <KPI icon="local_offer" label="Códigos creados" value={promos.length} color="blue" />
              <KPI icon="check_circle" label="Activos" value={promosActivos.length} color="green" />
              <KPI icon="redeem" label="Usos totales" value={usosTotales} color="gold" />
              <KPI icon="savings" label="Descuento otorgado" value={`$${descuentosTotales.toLocaleString("es-CO")}`} color="purple" />
            </div>

            {/* Form crear */}
            <div className="bg-white/5 rounded-2xl border border-white/10 p-5">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <span className="material-icons-outlined text-[#c5a044]">add_circle</span>
                Crear nuevo código
              </h3>
              <form
                onSubmit={(e) => { e.preventDefault(); crearPromo(e.currentTarget); }}
                className="grid md:grid-cols-2 lg:grid-cols-3 gap-3"
              >
                <input
                  name="codigo"
                  required
                  placeholder="CÓDIGO (ej: BLACK50)"
                  className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm uppercase font-mono"
                  maxLength={24}
                  pattern="[A-Za-z0-9_\-]{3,24}"
                  title="3-24 caracteres alfanuméricos, guiones o guiones bajos"
                />
                <input
                  name="porcentaje"
                  type="number"
                  required
                  min={1}
                  max={99}
                  placeholder="% Descuento (1-99)"
                  className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm"
                />
                <input
                  name="descripcion"
                  placeholder="Descripción interna (opcional)"
                  className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm"
                  maxLength={200}
                />
                <label className="text-xs text-gray-400 block">
                  Válido desde
                  <input
                    name="validoDesde"
                    type="datetime-local"
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm mt-1"
                  />
                </label>
                <label className="text-xs text-gray-400 block">
                  Válido hasta (opcional)
                  <input
                    name="validoHasta"
                    type="datetime-local"
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm mt-1"
                  />
                </label>
                <input
                  name="usosMaximos"
                  type="number"
                  min={1}
                  placeholder="Usos máximos (vacío = ilimitado)"
                  className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm"
                />
                <label className="flex items-center gap-2 text-sm text-gray-300">
                  <input name="unoPorUsuario" type="checkbox" defaultChecked className="rounded" />
                  Solo 1 uso por usuario
                </label>
                <button
                  type="submit"
                  className="md:col-span-2 lg:col-span-3 py-2.5 rounded-lg bg-[#c5a044] text-[#0f172a] font-bold hover:opacity-90"
                >
                  Crear código
                </button>
              </form>
            </div>

            {/* Lista */}
            <div className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/10 text-left">
                      <th className="px-4 py-3 text-gray-400">Código</th>
                      <th className="px-4 py-3 text-gray-400">%</th>
                      <th className="px-4 py-3 text-gray-400">Vigencia</th>
                      <th className="px-4 py-3 text-gray-400">Usos</th>
                      <th className="px-4 py-3 text-gray-400">Estado</th>
                      <th className="px-4 py-3 text-gray-400">Creado por</th>
                      <th className="px-4 py-3 text-gray-400">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {promos.length === 0 ? (
                      <tr><td colSpan={7} className="text-center text-gray-500 py-8">No hay códigos aún. Crea el primero arriba.</td></tr>
                    ) : (
                      promos.map(p => {
                        const expirado = p.validoHasta ? Date.parse(p.validoHasta) < Date.now() : false;
                        const agotado = p.usosMaximos !== null && p.usosActuales >= p.usosMaximos;
                        const rangoLabel = p.validoHasta
                          ? `${p.validoDesde.slice(0,10)} → ${p.validoHasta.slice(0,10)}`
                          : `desde ${p.validoDesde.slice(0,10)}`;
                        return (
                          <tr key={p.id} className="border-b border-white/5 hover:bg-white/5">
                            <td className="px-4 py-3 font-mono font-bold text-[#c5a044]">
                              {p.id}
                              {p.descripcion && <p className="text-xs text-gray-500 font-sans font-normal mt-0.5">{p.descripcion}</p>}
                            </td>
                            <td className="px-4 py-3 font-bold">{p.porcentaje}%</td>
                            <td className="px-4 py-3 text-xs text-gray-400">{rangoLabel}</td>
                            <td className="px-4 py-3 text-xs">{p.usosActuales}{p.usosMaximos ? ` / ${p.usosMaximos}` : ""}</td>
                            <td className="px-4 py-3">
                              <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                                !p.activo ? "bg-gray-500/20 text-gray-400" :
                                expirado ? "bg-red-500/20 text-red-400" :
                                agotado ? "bg-amber-500/20 text-amber-400" :
                                "bg-green-500/20 text-green-400"
                              }`}>
                                {!p.activo ? "Desactivado" : expirado ? "Expirado" : agotado ? "Agotado" : "Activo"}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-xs text-gray-500">{p.createdBy}</td>
                            <td className="px-4 py-3">
                              <div className="flex gap-2">
                                <button
                                  onClick={() => togglePromo(p.id, !p.activo)}
                                  className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                                    p.activo ? "bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30" : "bg-green-500/20 text-green-400 hover:bg-green-500/30"
                                  }`}
                                >
                                  {p.activo ? "Desactivar" : "Activar"}
                                </button>
                                <button
                                  onClick={() => eliminarPromo(p.id)}
                                  className="px-3 py-1 rounded-lg text-xs font-semibold bg-red-500/20 text-red-400 hover:bg-red-500/30"
                                >
                                  Eliminar
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ═══ GROWTH ═══ */}
        {tab === "growth" && (
          <div className="space-y-6">
            {/* Registrations chart */}
            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
              <h3 className="font-bold mb-4 flex items-center gap-2"><span className="material-icons-outlined text-blue-400">person_add</span> Registros — Últimos 30 días</h3>
              <div className="flex items-end gap-[2px] h-32">
                {days30.map(d => {
                  const v = regByDay[d] || 0;
                  const h = maxReg ? (v / maxReg) * 100 : 0;
                  return (
                    <div key={d} className="flex-1 group relative">
                      <div className="bg-blue-500/80 hover:bg-blue-400 rounded-t transition-all" style={{height: `${Math.max(h, 2)}%`, minHeight: v ? "4px" : "1px"}} />
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:block bg-[#1e293b] px-2 py-1 rounded text-xs whitespace-nowrap z-10">{d}: {v}</div>
                    </div>
                  );
                })}
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-2">
                <span>{days30[0]}</span><span>{days30[days30.length-1]}</span>
              </div>
            </div>

            {/* Inscripciones chart */}
            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
              <h3 className="font-bold mb-4 flex items-center gap-2"><span className="material-icons-outlined text-green-400">how_to_reg</span> Inscripciones — Últimos 30 días</h3>
              <div className="flex items-end gap-[2px] h-32">
                {days30.map(d => {
                  const v = inscByDay[d] || 0;
                  const h = maxInsc ? (v / maxInsc) * 100 : 0;
                  return (
                    <div key={d} className="flex-1 group relative">
                      <div className="bg-green-500/80 hover:bg-green-400 rounded-t transition-all" style={{height: `${Math.max(h, 2)}%`, minHeight: v ? "4px" : "1px"}} />
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:block bg-[#1e293b] px-2 py-1 rounded text-xs whitespace-nowrap z-10">{d}: {v}</div>
                    </div>
                  );
                })}
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-2">
                <span>{days30[0]}</span><span>{days30[days30.length-1]}</span>
              </div>
            </div>

            {/* Key insights */}
            <div className="bg-gradient-to-r from-[#c5a044]/10 to-[#eab308]/5 rounded-2xl p-6 border border-[#c5a044]/20">
              <h3 className="font-bold mb-3 text-[#c5a044]">💡 Insights Clave</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>• <span className="font-semibold text-white">{totalUsers}</span> usuarios registrados, <span className="font-semibold text-white">{totalInscripciones ? Math.round(totalInscripciones/Math.max(totalUsers,1)*100) : 0}%</span> se inscribieron en al menos un curso</li>
                <li>• Tasa de completación general: <span className="font-semibold text-white">{totalInscripciones ? Math.round(insCompletadas.length/totalInscripciones*100) : 0}%</span></li>
                <li>• {cursoRanking.length > 0 ? <>Curso más popular: <span className="font-semibold text-white">{cursoRanking[0][0]}</span> ({cursoRanking[0][1]} inscripciones)</> : "Sin inscripciones aún"}</li>
                <li>• {profesionales.length} profesionales activos para {agendasPendientes.length} tutorías pendientes</li>
                {calificaciones.length > 0 && <li>• Satisfacción promedio en tutorías: <span className="font-semibold text-[#c5a044]">⭐ {promCalif}/5</span></li>}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function KPI({ icon, label, value, color }: { icon: string; label: string; value: string|number; color: string }) {
  const colors: Record<string, string> = {
    blue: "from-blue-500/20 to-blue-600/5 border-blue-500/20 text-blue-400",
    green: "from-green-500/20 to-green-600/5 border-green-500/20 text-green-400",
    gold: "from-[#c5a044]/20 to-[#eab308]/5 border-[#c5a044]/20 text-[#c5a044]",
    purple: "from-purple-500/20 to-purple-600/5 border-purple-500/20 text-purple-400",
  };
  return (
    <div className={`bg-gradient-to-br ${colors[color]} rounded-2xl p-5 border`}>
      <span className="material-icons-outlined text-2xl opacity-60">{icon}</span>
      <p className="text-2xl font-extrabold mt-2">{value}</p>
      <p className="text-xs text-gray-400 mt-1">{label}</p>
    </div>
  );
}
