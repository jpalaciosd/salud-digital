"use client";
import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/lib/AuthContext";

interface Medico { id: string; nombre: string; apellido: string; documento: string; }
interface Paciente { id: string; nombre: string; apellido: string; email: string; documento: string; telefono?: string; }
interface Cita { id: string; pacienteId: string; pacienteNombre: string; medicoId?: string; medicoNombre: string; especialidad: string; fecha: string; hora: string; tipo: string; estado: string; motivo: string; }
interface Formula { id: string; pacienteId: string; pacienteNombre: string; medicoNombre: string; medicamentos: { nombre: string; dosis: string; frecuencia: string; duracionDias: number; via: string; cantidad: string }[]; estado: string; fechaEmision: string; fechaVencimiento: string; diagnostico: string; observaciones?: string; }
interface Historia { id: string; pacienteId: string; pacienteNombre: string; tipo: string; medicoNombre: string; diagnostico: string; notas: string; fecha: string; signos?: Record<string, string>; }
interface Inscripcion { id: string; cursoId: string; cursoTitulo: string; completedItems: string[]; evaluacionNota: number | null; evaluacionAprobada: boolean; estado: string; certificadoFecha: string | null; }
interface Curso { id: string; titulo: string; descripcion: string; instructor: string; modulos?: number; totalModulos?: number; totalItems?: number; duracionHoras: number; imagen: string; }
interface CursoDetalle { id: string; titulo: string; modulos: { titulo: string; items: string[] }[]; evaluacion: { pregunta: string; opciones: string[]; respuesta: number }[]; }
interface ProgresoWhatsApp { id: string; userId: string; telefono: string; cursoId: string; cursoNombre: string; moduloCompletado: number; totalModulos: number; porcentaje: number; nota?: number; detalle?: string; updatedAt: string; }


export default function Dashboard() {
  const { user, loading, logout } = useAuth();
  const [tab, setTab] = useState("inicio");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Data
  const [medicos, setMedicos] = useState<Medico[]>([]);
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [citas, setCitas] = useState<Cita[]>([]);
  const [formulas, setFormulas] = useState<Formula[]>([]);
  const [historia, setHistoria] = useState<Historia[]>([]);
  const [inscripciones, setInscripciones] = useState<Inscripcion[]>([]);
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [progresoWA, setProgresoWA] = useState<ProgresoWhatsApp[]>([]);

  // Modals
  const [showAgendarCita, setShowAgendarCita] = useState(false);
  const [showCrearFormula, setShowCrearFormula] = useState(false);
  const [showCrearHistoria, setShowCrearHistoria] = useState(false);
  const [saving, setSaving] = useState(false);
  // Course detail
  const [cursoActivo, setCursoActivo] = useState<string | null>(null);
  const [cursoDetalle, setCursoDetalle] = useState<CursoDetalle | null>(null);
  const [showEvaluacion, setShowEvaluacion] = useState(false);
  const [respuestas, setRespuestas] = useState<Record<number, number>>({});
  const [evalResult, setEvalResult] = useState<{ nota: number; aprobado: boolean } | null>(null);
  const [showAgendarTutoria, setShowAgendarTutoria] = useState(false);
  const [tutoriaForm, setTutoriaForm] = useState({ medicoId: "", fecha: "", hora: "", motivo: "" });

  // Forms
  const [citaForm, setCitaForm] = useState({ medicoId: "", especialidad: "", fecha: "", hora: "", tipo: "teleconsulta", motivo: "" });
  const [formulaForm, setFormulaForm] = useState({ pacienteId: "", diagnostico: "", observaciones: "", duracionDias: 30, medicamentos: [{ nombre: "", dosis: "", frecuencia: "Cada 12 horas", via: "Oral", duracionDias: 30, cantidad: "" }] });
  const [historiaForm, setHistoriaForm] = useState({ pacienteId: "", tipo: "Control", diagnostico: "", notas: "", presion: "", glucosa: "", peso: "" });

  const isMedico = user?.rol === "medico" || user?.rol === "admin";

  const fetchData = useCallback(async () => {
    const [citasR, formulasR, historiaR, inscR, cursosR, medicosR] = await Promise.all([
      fetch("/api/citas").then(r => r.ok ? r.json() : { citas: [] }),
      fetch("/api/formulas").then(r => r.ok ? r.json() : { formulas: [] }),
      fetch("/api/historia").then(r => r.ok ? r.json() : { registros: [] }),
      fetch("/api/inscripciones").then(r => r.ok ? r.json() : { inscripciones: [] }),
      fetch("/api/cursos").then(r => r.ok ? r.json() : { cursos: [] }),
      fetch("/api/medicos").then(r => r.ok ? r.json() : { medicos: [] }),
    ]);
    setCitas(citasR.citas || []);
    setFormulas(formulasR.formulas || []);
    setHistoria(historiaR.registros || []);
    setInscripciones(inscR.inscripciones || []);
    setCursos(cursosR.cursos || []);
    setMedicos(medicosR.medicos || []);

    if (isMedico) {
      const pacR = await fetch("/api/pacientes").then(r => r.ok ? r.json() : { pacientes: [] });
      setPacientes(pacR.pacientes || []);
    }

    // Fetch WhatsApp progress
    if (user?.userId) {
      const progR = await fetch(`/api/progreso?userId=${user.userId}`).then(r => r.ok ? r.json() : { progreso: [] });
      setProgresoWA(progR.progreso || []);
    }
  }, [isMedico]);

  useEffect(() => { if (!loading && user) fetchData(); }, [loading, user, fetchData]);

  // ── Actions ──
  const agendarCita = async () => {
    const medico = medicos.find(m => m.id === citaForm.medicoId);
    if (!medico) return;
    setSaving(true);
    await fetch("/api/citas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...citaForm,
        medicoNombre: `Dr. ${medico.nombre} ${medico.apellido}`,
        medicoId: medico.id,
      }),
    });
    setSaving(false);
    setShowAgendarCita(false);
    setCitaForm({ medicoId: "", especialidad: "", fecha: "", hora: "", tipo: "teleconsulta", motivo: "" });
    fetchData();
  };

  const crearFormula = async () => {
    const pac = pacientes.find(p => p.id === formulaForm.pacienteId);
    if (!pac) return;
    setSaving(true);
    await fetch("/api/formulas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...formulaForm,
        pacienteNombre: `${pac.nombre} ${pac.apellido}`,
      }),
    });
    setSaving(false);
    setShowCrearFormula(false);
    setFormulaForm({ pacienteId: "", diagnostico: "", observaciones: "", duracionDias: 30, medicamentos: [{ nombre: "", dosis: "", frecuencia: "Cada 12 horas", via: "Oral", duracionDias: 30, cantidad: "" }] });
    fetchData();
  };

  const crearHistoria = async () => {
    const pac = pacientes.find(p => p.id === historiaForm.pacienteId);
    if (!pac) return;
    setSaving(true);
    await fetch("/api/historia", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        pacienteId: historiaForm.pacienteId,
        pacienteNombre: `${pac.nombre} ${pac.apellido}`,
        tipo: historiaForm.tipo,
        diagnostico: historiaForm.diagnostico,
        notas: historiaForm.notas,
        signos: { presion: historiaForm.presion, glucosa: historiaForm.glucosa, peso: historiaForm.peso },
      }),
    });
    setSaving(false);
    setShowCrearHistoria(false);
    setHistoriaForm({ pacienteId: "", tipo: "Control", diagnostico: "", notas: "", presion: "", glucosa: "", peso: "" });
    fetchData();
  };

  const inscribirCurso = async (curso: Curso) => {
    await fetch("/api/inscripciones", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cursoId: curso.id, cursoTitulo: curso.titulo }),
    });
    fetchData();
  };

  const actualizarEstadoCita = async (id: string, estado: string) => {
    await fetch(`/api/citas/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ estado }),
    });
    fetchData();
  };

  const abrirCurso = async (cursoId: string) => {
    setCursoActivo(cursoId);
    setShowEvaluacion(false);
    setEvalResult(null);
    setRespuestas({});
    const res = await fetch(`/api/cursos/${cursoId}`);
    if (res.ok) {
      const data = await res.json();
      setCursoDetalle(data.curso);
    }
  };

  const agendarTutoria = async (cursoTitulo: string) => {
    const medico = medicos.find(m => m.id === tutoriaForm.medicoId);
    if (!medico) return;
    setSaving(true);
    await fetch("/api/citas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        medicoId: medico.id,
        medicoNombre: `Dr. ${medico.nombre} ${medico.apellido}`,
        especialidad: "Tutoría Académica",
        fecha: tutoriaForm.fecha,
        hora: tutoriaForm.hora,
        tipo: "teleconsulta",
        motivo: `Tutoría: ${cursoTitulo} — ${tutoriaForm.motivo}`,
      }),
    });
    setSaving(false);
    setShowAgendarTutoria(false);
    setTutoriaForm({ medicoId: "", fecha: "", hora: "", motivo: "" });
    fetchData();
  };

  const toggleItem = async (inscripcionId: string, itemKey: string) => {
    await fetch("/api/inscripciones", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ inscripcionId, action: "toggle_item", itemKey }),
    });
    fetchData();
  };

  const submitEvaluacion = async (inscripcionId: string, totalItems: number) => {
    if (!cursoDetalle) return;
    let correctas = 0;
    cursoDetalle.evaluacion.forEach((q, i) => {
      if (respuestas[i] === q.respuesta) correctas++;
    });
    const nota = Math.round((correctas / cursoDetalle.evaluacion.length) * 100);
    const res = await fetch("/api/inscripciones", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ inscripcionId, action: "submit_evaluation", evaluacionNota: nota, totalItems }),
    });
    if (res.ok) {
      setEvalResult({ nota, aprobado: nota >= 70 });
      fetchData();
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin h-8 w-8 border-4 border-[#13ec5b] border-t-transparent rounded-full"></div></div>;

  const formatDate = (d: string) => { try { return new Date(d).toLocaleDateString("es-CO", { day: "numeric", month: "short", year: "numeric" }); } catch { return d; } };
  const diasRestantes = (v: string) => { const d = Math.ceil((new Date(v).getTime() - Date.now()) / 86400000); return d > 0 ? `${d} días` : "Vencido"; };

  // Nav items depend on role
  const navItems = isMedico ? [
    { id: "inicio", icon: "dashboard", label: "Inicio" },
    { id: "citas", icon: "calendar_today", label: "Mis Citas" },
    { id: "pacientes", icon: "group", label: "Mis Pacientes" },
    { id: "formulas", icon: "medication", label: "Fórmulas" },
    { id: "historia", icon: "history_edu", label: "Historia Clínica" },
  ] : [
    { id: "inicio", icon: "dashboard", label: "Inicio" },
    { id: "citas", icon: "calendar_today", label: "Mis Citas" },
    { id: "formulas", icon: "medication", label: "Mis Fórmulas" },
    { id: "historia", icon: "history_edu", label: "Historia Clínica" },
    { id: "cursos", icon: "school", label: "Mis Cursos" },
  ];

  const handleTabChange = (id: string) => { setTab(id); setSidebarOpen(false); };
  const addMedicamento = () => setFormulaForm({ ...formulaForm, medicamentos: [...formulaForm.medicamentos, { nombre: "", dosis: "", frecuencia: "Cada 12 horas", via: "Oral", duracionDias: 30, cantidad: "" }] });
  const updateMed = (i: number, field: string, value: string | number) => {
    const meds = [...formulaForm.medicamentos];
    (meds[i] as Record<string, string | number>)[field] = value;
    setFormulaForm({ ...formulaForm, medicamentos: meds });
  };

  return (
    <div className="min-h-screen flex bg-[#f6f8f6]">
      {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 w-72 lg:w-64 bg-white border-r border-[#13ec5b]/10 z-50 transform transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 lg:static lg:shrink-0`}>
        <div className="flex flex-col h-full p-5">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#13ec5b] rounded-lg flex items-center justify-center">
                <span className="material-icons-outlined text-white text-lg">health_and_safety</span>
              </div>
              <span className="text-lg font-bold tracking-tight text-[#102216]">SaludDigital</span>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-1 text-slate-400"><span className="material-icons-outlined">close</span></button>
          </div>
          {isMedico && <div className="mb-4 px-3 py-1.5 bg-blue-50 rounded-lg text-center"><span className="text-xs font-bold text-blue-700">🩺 Panel Médico</span></div>}
          <nav className="flex-1 space-y-1">
            {navItems.map((item) => (
              <button key={item.id} onClick={() => handleTabChange(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-colors text-sm ${tab === item.id ? "bg-[#13ec5b]/10 text-emerald-700" : "text-slate-500 hover:bg-emerald-50"}`}>
                <span className="material-icons-outlined text-xl">{item.icon}</span>{item.label}
              </button>
            ))}
            <div className="pt-4 mt-4 border-t border-emerald-100 space-y-1">
              <Link href="/agentes" className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-emerald-50 rounded-xl transition-colors text-sm">
                <span className="material-icons-outlined text-xl">smart_toy</span>Agentes IA
              </Link>
              <a className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-emerald-50 rounded-xl transition-colors text-sm" href="https://wa.me/12763294935">
                <span className="material-icons-outlined text-xl">chat</span>Hablar con Aura
              </a>
              <Link href="/" className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-emerald-50 rounded-xl transition-colors text-sm">
                <span className="material-icons-outlined text-xl">home</span>Inicio
              </Link>
            </div>
          </nav>
          <div className="mt-auto p-3 bg-emerald-50 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#13ec5b]/20 rounded-full flex items-center justify-center text-[#13ec5b] font-bold text-sm shrink-0">
                {(user?.nombre?.[0] || "")}{(user?.apellido?.[0] || "")}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-emerald-950 truncate">{user?.nombre} {user?.apellido}</p>
                <p className="text-xs text-emerald-600 capitalize">{user?.rol}</p>
              </div>
            </div>
            <button onClick={logout} className="mt-3 w-full text-xs text-red-500 hover:bg-red-50 py-2 rounded-lg transition flex items-center justify-center gap-1">
              <span className="material-icons-outlined text-sm">logout</span>Cerrar Sesión
            </button>
            <p className="text-center text-[10px] text-slate-400 mt-3">Powered by <span className="font-semibold text-[#13ec5b]">AINovaX</span></p>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 min-w-0">
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-lg border-b border-emerald-100 px-4 py-3 lg:px-8 lg:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 -ml-2 text-slate-600 hover:bg-emerald-50 rounded-lg"><span className="material-icons-outlined">menu</span></button>
              <div>
                <h1 className="text-lg lg:text-2xl font-bold text-emerald-950">¡Hola, {isMedico ? "Dr. " : ""}{user?.nombre}!</h1>
                <p className="text-xs lg:text-sm text-slate-500 hidden sm:block">{isMedico ? "Panel de gestión médica" : "Tu portal de salud digital"}</p>
              </div>
            </div>
          </div>
        </header>

        <div className="p-4 lg:p-8">

          {/* ═══ INICIO ═══ */}
          {tab === "inicio" && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <Stat label="Citas" value={citas.filter(c => c.estado === "pendiente" || c.estado === "confirmada").length} />
                <Stat label="Fórmulas" value={formulas.filter(f => f.estado === "activa").length} />
                <Stat label="Registros HC" value={historia.length} />
                <Stat label={isMedico ? "Pacientes" : "Cursos"} value={isMedico ? pacientes.length : inscripciones.length} />
              </div>

              {/* Próxima cita */}
              {(() => {
                const upcoming = citas.filter(c => c.estado !== "cancelada" && c.estado !== "completada");
                if (upcoming.length > 0) {
                  const c = upcoming[0];
                  return (
                    <div className="bg-emerald-950 text-white rounded-xl p-5 lg:p-8">
                      <span className="inline-block px-2 py-0.5 bg-[#13ec5b]/20 text-[#13ec5b] text-[10px] font-bold rounded-full mb-2 uppercase">Próxima Cita</span>
                      <h2 className="text-lg lg:text-2xl font-bold">{isMedico ? c.pacienteNombre : c.medicoNombre}</h2>
                      <p className="text-emerald-300/80 text-sm">{c.especialidad} • {c.tipo}</p>
                      <div className="flex flex-wrap gap-3 mt-2 text-sm">
                        <span className="flex items-center gap-1"><span className="material-icons-outlined text-sm">calendar_month</span>{formatDate(c.fecha)}</span>
                        <span className="flex items-center gap-1 text-[#13ec5b]"><span className="material-icons-outlined text-sm">schedule</span>{c.hora}</span>
                        <span className={`px-2 py-0.5 text-[10px] font-bold rounded uppercase ${c.estado === "confirmada" ? "bg-emerald-500/20 text-emerald-300" : "bg-amber-500/20 text-amber-300"}`}>{c.estado}</span>
                      </div>
                    </div>
                  );
                }
                return (
                  <div className="bg-white p-6 rounded-xl border border-emerald-100 text-center">
                    <span className="material-icons-outlined text-4xl text-slate-300 mb-2">calendar_today</span>
                    <p className="text-slate-500 mb-3">No hay citas programadas</p>
                    {!isMedico && <button onClick={() => { setTab("citas"); setShowAgendarCita(true); }} className="bg-[#13ec5b] text-[#102216] font-bold py-2 px-6 rounded-xl text-sm">Agendar Cita</button>}
                  </div>
                );
              })()}

              {/* Progreso WhatsApp (Aura) */}
              {progresoWA.length > 0 && (
                <div>
                  <h3 className="text-sm font-bold text-slate-500 uppercase mb-3 flex items-center gap-2">
                    <span className="material-icons-outlined text-[#25D366] text-lg">chat</span>
                    Progreso Académico vía WhatsApp
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                    {progresoWA.map((p) => (
                      <div key={p.id} className="bg-white p-5 rounded-xl border border-emerald-100 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-20 h-20 bg-[#25D366]/5 rounded-bl-full"></div>
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-8 h-8 bg-[#25D366]/10 rounded-lg flex items-center justify-center">
                            <span className="material-icons-outlined text-[#25D366] text-lg">school</span>
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-sm truncate">{p.cursoNombre}</p>
                            <p className="text-[10px] text-slate-400">Guía Aura • WhatsApp</p>
                          </div>
                        </div>
                        <div className="flex items-end justify-between mb-2">
                          <div>
                            <p className="text-xs text-slate-500">Módulo {p.moduloCompletado} de {p.totalModulos}</p>
                            {p.nota && <p className="text-xs text-emerald-600 font-bold">Nota: {p.nota}/100</p>}
                          </div>
                          <p className="text-2xl font-bold text-emerald-700">{p.porcentaje}%</p>
                        </div>
                        <div className="w-full bg-emerald-100 rounded-full h-2.5">
                          <div className="h-2.5 rounded-full bg-[#25D366] transition-all" style={{ width: `${p.porcentaje}%` }}></div>
                        </div>
                        {p.detalle && <p className="text-[11px] text-slate-400 mt-2 italic">{p.detalle}</p>}
                        <p className="text-[10px] text-slate-300 mt-1">Actualizado: {new Date(p.updatedAt).toLocaleDateString("es-CO", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Quick actions for doctor */}
              {isMedico && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button onClick={() => { setTab("formulas"); setShowCrearFormula(true); }} className="bg-white p-4 rounded-xl border border-emerald-100 hover:border-[#13ec5b]/50 transition text-left">
                    <span className="material-icons-outlined text-[#13ec5b] text-2xl mb-2">medication</span>
                    <p className="font-bold text-sm">Nueva Fórmula</p>
                    <p className="text-xs text-slate-500">Prescribir a un paciente</p>
                  </button>
                  <button onClick={() => { setTab("historia"); setShowCrearHistoria(true); }} className="bg-white p-4 rounded-xl border border-emerald-100 hover:border-[#13ec5b]/50 transition text-left">
                    <span className="material-icons-outlined text-[#13ec5b] text-2xl mb-2">history_edu</span>
                    <p className="font-bold text-sm">Registrar HC</p>
                    <p className="text-xs text-slate-500">Actualizar historia clínica</p>
                  </button>
                  <button onClick={() => setTab("pacientes")} className="bg-white p-4 rounded-xl border border-emerald-100 hover:border-[#13ec5b]/50 transition text-left">
                    <span className="material-icons-outlined text-[#13ec5b] text-2xl mb-2">group</span>
                    <p className="font-bold text-sm">Ver Pacientes</p>
                    <p className="text-xs text-slate-500">{pacientes.length} pacientes registrados</p>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ═══ CITAS ═══ */}
          {tab === "citas" && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl lg:text-2xl font-bold">Mis Citas</h2>
                {!isMedico && (
                  <button onClick={() => setShowAgendarCita(true)} className="bg-[#13ec5b] text-[#102216] font-bold py-2 px-4 rounded-xl text-sm flex items-center gap-2">
                    <span className="material-icons-outlined text-lg">add</span>Agendar
                  </button>
                )}
              </div>

              {/* Agendar Modal — patient selects from registered doctors */}
              {showAgendarCita && (
                <Modal onClose={() => setShowAgendarCita(false)}>
                  <h3 className="text-lg font-bold mb-4">Agendar Nueva Cita</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Seleccionar Médico</label>
                      <select value={citaForm.medicoId} onChange={e => setCitaForm({...citaForm, medicoId: e.target.value})} className="w-full p-2.5 border border-slate-200 rounded-lg text-sm">
                        <option value="">-- Seleccione un médico --</option>
                        {medicos.map(m => <option key={m.id} value={m.id}>Dr. {m.nombre} {m.apellido}</option>)}
                      </select>
                      {medicos.length === 0 && <p className="text-xs text-amber-600 mt-1">No hay médicos registrados aún</p>}
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Especialidad</label>
                      <select value={citaForm.especialidad} onChange={e => setCitaForm({...citaForm, especialidad: e.target.value})} className="w-full p-2.5 border border-slate-200 rounded-lg text-sm">
                        <option value="">-- Seleccione --</option>
                        <option>Medicina General</option><option>Medicina Interna</option><option>Nutrición</option><option>Laboratorio</option><option>Cardiología</option><option>Endocrinología</option><option>Psicología</option>
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div><label className="block text-xs font-bold text-slate-500 uppercase mb-1">Fecha</label><input type="date" value={citaForm.fecha} onChange={e => setCitaForm({...citaForm, fecha: e.target.value})} className="w-full p-2.5 border border-slate-200 rounded-lg text-sm" /></div>
                      <div><label className="block text-xs font-bold text-slate-500 uppercase mb-1">Hora</label><input type="time" value={citaForm.hora} onChange={e => setCitaForm({...citaForm, hora: e.target.value})} className="w-full p-2.5 border border-slate-200 rounded-lg text-sm" /></div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Tipo</label>
                      <select value={citaForm.tipo} onChange={e => setCitaForm({...citaForm, tipo: e.target.value})} className="w-full p-2.5 border border-slate-200 rounded-lg text-sm">
                        <option value="teleconsulta">Teleconsulta</option><option value="presencial">Presencial</option><option value="laboratorio">Laboratorio</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Motivo</label>
                      <textarea value={citaForm.motivo} onChange={e => setCitaForm({...citaForm, motivo: e.target.value})} className="w-full p-2.5 border border-slate-200 rounded-lg text-sm" rows={2} placeholder="Motivo de la consulta..." />
                    </div>
                  </div>
                  <div className="flex gap-3 mt-6">
                    <button onClick={() => setShowAgendarCita(false)} className="flex-1 py-2.5 border border-slate-200 rounded-xl text-sm font-bold">Cancelar</button>
                    <button onClick={agendarCita} disabled={saving || !citaForm.medicoId || !citaForm.fecha || !citaForm.hora || !citaForm.motivo || !citaForm.especialidad} className="flex-1 py-2.5 bg-[#13ec5b] text-[#102216] rounded-xl text-sm font-bold disabled:opacity-50">
                      {saving ? "Guardando..." : "Agendar"}
                    </button>
                  </div>
                </Modal>
              )}

              {citas.length === 0 ? (
                <Empty icon="event_busy" title="Sin citas" subtitle={isMedico ? "Tus pacientes aún no han agendado citas" : "Agenda tu primera cita"} />
              ) : (
                <div className="space-y-3">
                  {citas.map((c) => (
                    <div key={c.id} className="bg-white p-4 lg:p-5 rounded-xl border border-emerald-100">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                        <div>
                          <h4 className="font-bold text-sm lg:text-base">{isMedico ? `Paciente: ${c.pacienteNombre}` : c.medicoNombre}</h4>
                          <p className="text-xs text-slate-500">{c.especialidad} • {c.tipo}</p>
                          <p className="text-xs font-medium mt-1">{formatDate(c.fecha)} — {c.hora}</p>
                          <p className="text-xs text-slate-400 mt-1">{c.motivo}</p>
                        </div>
                        <div className="flex flex-wrap items-center gap-2 self-start">
                          <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                            c.estado === "confirmada" ? "bg-emerald-100 text-emerald-700" :
                            c.estado === "pendiente" ? "bg-amber-100 text-amber-700" :
                            c.estado === "completada" ? "bg-blue-100 text-blue-700" :
                            c.estado === "rechazada" ? "bg-red-100 text-red-700" :
                            c.estado === "cancelada" ? "bg-slate-100 text-slate-500" :
                            "bg-slate-100 text-slate-500"
                          }`}>{c.estado}</span>
                          {/* Médico: Aceptar o Rechazar pendientes */}
                          {isMedico && c.estado === "pendiente" && (
                            <>
                              <button onClick={() => actualizarEstadoCita(c.id, "confirmada")} className="px-2.5 py-1 bg-emerald-100 text-emerald-700 rounded text-[10px] font-bold hover:bg-emerald-200 flex items-center gap-1">
                                <span className="material-icons-outlined text-xs">check</span>Aceptar
                              </button>
                              <button onClick={() => actualizarEstadoCita(c.id, "rechazada")} className="px-2.5 py-1 bg-red-100 text-red-700 rounded text-[10px] font-bold hover:bg-red-200 flex items-center gap-1">
                                <span className="material-icons-outlined text-xs">close</span>Rechazar
                              </button>
                            </>
                          )}
                          {/* Médico: Completar confirmadas */}
                          {isMedico && c.estado === "confirmada" && (
                            <button onClick={() => actualizarEstadoCita(c.id, "completada")} className="px-2.5 py-1 bg-blue-100 text-blue-700 rounded text-[10px] font-bold hover:bg-blue-200 flex items-center gap-1">
                              <span className="material-icons-outlined text-xs">done_all</span>Completar
                            </button>
                          )}
                          {/* Paciente: Cancelar pendientes o confirmadas */}
                          {!isMedico && (c.estado === "pendiente" || c.estado === "confirmada") && (
                            <button onClick={() => actualizarEstadoCita(c.id, "cancelada")} className="px-2.5 py-1 bg-red-50 text-red-600 rounded text-[10px] font-bold hover:bg-red-100 flex items-center gap-1">
                              <span className="material-icons-outlined text-xs">cancel</span>Cancelar
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ═══ PACIENTES (médico) ═══ */}
          {tab === "pacientes" && isMedico && (
            <div>
              <h2 className="text-xl lg:text-2xl font-bold mb-6">Mis Pacientes</h2>
              {pacientes.length === 0 ? (
                <Empty icon="group" title="Sin pacientes" subtitle="Aún no hay pacientes registrados en la plataforma" />
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                  {pacientes.map(p => {
                    const pFormulas = formulas.filter(f => f.pacienteId === p.id);
                    const pHistoria = historia.filter(h => h.pacienteId === p.id);
                    return (
                      <div key={p.id} className="bg-white p-5 rounded-xl border border-emerald-100">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-12 h-12 bg-[#13ec5b]/20 rounded-full flex items-center justify-center text-[#13ec5b] font-bold">
                            {p.nombre[0]}{p.apellido[0]}
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-sm truncate">{p.nombre} {p.apellido}</p>
                            <p className="text-[10px] text-slate-500">CC {p.documento}</p>
                          </div>
                        </div>
                        <div className="flex gap-4 text-xs text-slate-500 mb-3">
                          <span>{pFormulas.length} fórmula(s)</span>
                          <span>{pHistoria.length} registro(s) HC</span>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => { setFormulaForm({...formulaForm, pacienteId: p.id}); setShowCrearFormula(true); setTab("formulas"); }} className="flex-1 py-2 bg-[#13ec5b]/10 text-emerald-700 rounded-lg text-xs font-bold hover:bg-[#13ec5b]/20">
                            Prescribir
                          </button>
                          <button onClick={() => { setHistoriaForm({...historiaForm, pacienteId: p.id}); setShowCrearHistoria(true); setTab("historia"); }} className="flex-1 py-2 bg-blue-50 text-blue-700 rounded-lg text-xs font-bold hover:bg-blue-100">
                            Registrar HC
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ═══ FÓRMULAS ═══ */}
          {tab === "formulas" && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl lg:text-2xl font-bold">Fórmulas Médicas</h2>
                {isMedico && (
                  <button onClick={() => setShowCrearFormula(true)} className="bg-[#13ec5b] text-[#102216] font-bold py-2 px-4 rounded-xl text-sm flex items-center gap-2">
                    <span className="material-icons-outlined text-lg">add</span>Nueva Fórmula
                  </button>
                )}
              </div>

              {showCrearFormula && isMedico && (
                <Modal onClose={() => setShowCrearFormula(false)}>
                  <h3 className="text-lg font-bold mb-4">Crear Fórmula Médica</h3>
                  <div className="space-y-4 max-h-[60vh] overflow-y-auto">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Paciente</label>
                      <select value={formulaForm.pacienteId} onChange={e => setFormulaForm({...formulaForm, pacienteId: e.target.value})} className="w-full p-2.5 border border-slate-200 rounded-lg text-sm">
                        <option value="">-- Seleccione paciente --</option>
                        {pacientes.map(p => <option key={p.id} value={p.id}>{p.nombre} {p.apellido} (CC {p.documento})</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Diagnóstico</label>
                      <input value={formulaForm.diagnostico} onChange={e => setFormulaForm({...formulaForm, diagnostico: e.target.value})} className="w-full p-2.5 border border-slate-200 rounded-lg text-sm" placeholder="Ej. HTA, Diabetes Tipo II" />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-xs font-bold text-slate-500 uppercase">Medicamentos</label>
                        <button onClick={addMedicamento} className="text-xs text-[#13ec5b] font-bold flex items-center gap-1">
                          <span className="material-icons-outlined text-sm">add</span>Agregar
                        </button>
                      </div>
                      {formulaForm.medicamentos.map((med, i) => (
                        <div key={i} className="bg-slate-50 p-3 rounded-lg mb-2 space-y-2">
                          <input value={med.nombre} onChange={e => updateMed(i, "nombre", e.target.value)} className="w-full p-2 border border-slate-200 rounded text-sm" placeholder="Nombre (ej. Losartán 50mg)" />
                          <div className="grid grid-cols-2 gap-2">
                            <input value={med.dosis} onChange={e => updateMed(i, "dosis", e.target.value)} className="p-2 border border-slate-200 rounded text-sm" placeholder="Dosis" />
                            <input value={med.cantidad} onChange={e => updateMed(i, "cantidad", e.target.value)} className="p-2 border border-slate-200 rounded text-sm" placeholder="Cantidad" />
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <select value={med.frecuencia} onChange={e => updateMed(i, "frecuencia", e.target.value)} className="p-2 border border-slate-200 rounded text-sm">
                              <option>Cada 8 horas</option><option>Cada 12 horas</option><option>Diario</option><option>Con almuerzo</option><option>Al acostarse</option>
                            </select>
                            <select value={med.via} onChange={e => updateMed(i, "via", e.target.value)} className="p-2 border border-slate-200 rounded text-sm">
                              <option>Oral</option><option>Subcutánea</option><option>Intravenosa</option><option>Tópica</option>
                            </select>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Observaciones</label>
                      <textarea value={formulaForm.observaciones} onChange={e => setFormulaForm({...formulaForm, observaciones: e.target.value})} className="w-full p-2.5 border border-slate-200 rounded-lg text-sm" rows={2} />
                    </div>
                  </div>
                  <div className="flex gap-3 mt-6">
                    <button onClick={() => setShowCrearFormula(false)} className="flex-1 py-2.5 border border-slate-200 rounded-xl text-sm font-bold">Cancelar</button>
                    <button onClick={crearFormula} disabled={saving || !formulaForm.pacienteId || !formulaForm.diagnostico || !formulaForm.medicamentos[0].nombre} className="flex-1 py-2.5 bg-[#13ec5b] text-[#102216] rounded-xl text-sm font-bold disabled:opacity-50">
                      {saving ? "Guardando..." : "Emitir Fórmula"}
                    </button>
                  </div>
                </Modal>
              )}

              {formulas.length === 0 ? (
                <Empty icon="medication" title="Sin fórmulas" subtitle={isMedico ? "Crea una fórmula para tus pacientes" : "Tu médico asignará tus fórmulas"} />
              ) : (
                <div className="space-y-4">
                  {formulas.map((f) => (
                    <div key={f.id} className="bg-white p-4 lg:p-6 rounded-xl border border-emerald-100">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <p className="font-bold text-sm">{isMedico ? `Paciente: ${f.pacienteNombre}` : `Dr. ${f.medicoNombre}`}</p>
                          <p className="text-xs text-slate-400">Dx: {f.diagnostico} • {formatDate(f.fechaEmision)}</p>
                        </div>
                        <span className={`px-2 py-0.5 text-[10px] font-bold rounded uppercase ${f.estado === "activa" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>{f.estado}</span>
                      </div>
                      <div className="space-y-2">
                        {f.medicamentos.map((m, j) => (
                          <div key={j} className="bg-[#f6f8f6] p-3 rounded-lg">
                            <p className="font-bold text-sm">{m.nombre} — {m.dosis}</p>
                            <p className="text-xs text-slate-500">{m.frecuencia} • {m.via} • {m.duracionDias} días • {m.cantidad}</p>
                          </div>
                        ))}
                      </div>
                      <p className="text-xs text-slate-400 mt-3">Vence: {formatDate(f.fechaVencimiento)} ({diasRestantes(f.fechaVencimiento)})</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ═══ HISTORIA CLÍNICA ═══ */}
          {tab === "historia" && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl lg:text-2xl font-bold">Historia Clínica</h2>
                {isMedico && (
                  <button onClick={() => setShowCrearHistoria(true)} className="bg-[#13ec5b] text-[#102216] font-bold py-2 px-4 rounded-xl text-sm flex items-center gap-2">
                    <span className="material-icons-outlined text-lg">add</span>Nuevo Registro
                  </button>
                )}
              </div>

              {showCrearHistoria && isMedico && (
                <Modal onClose={() => setShowCrearHistoria(false)}>
                  <h3 className="text-lg font-bold mb-4">Registrar Historia Clínica</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Paciente</label>
                      <select value={historiaForm.pacienteId} onChange={e => setHistoriaForm({...historiaForm, pacienteId: e.target.value})} className="w-full p-2.5 border border-slate-200 rounded-lg text-sm">
                        <option value="">-- Seleccione paciente --</option>
                        {pacientes.map(p => <option key={p.id} value={p.id}>{p.nombre} {p.apellido} (CC {p.documento})</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Tipo de Consulta</label>
                      <select value={historiaForm.tipo} onChange={e => setHistoriaForm({...historiaForm, tipo: e.target.value})} className="w-full p-2.5 border border-slate-200 rounded-lg text-sm">
                        <option>Control</option><option>Primera Vez</option><option>Urgencia</option><option>Laboratorio</option><option>Seguimiento</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Diagnóstico</label>
                      <input value={historiaForm.diagnostico} onChange={e => setHistoriaForm({...historiaForm, diagnostico: e.target.value})} className="w-full p-2.5 border border-slate-200 rounded-lg text-sm" placeholder="Diagnóstico principal" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Notas Clínicas</label>
                      <textarea value={historiaForm.notas} onChange={e => setHistoriaForm({...historiaForm, notas: e.target.value})} className="w-full p-2.5 border border-slate-200 rounded-lg text-sm" rows={3} placeholder="Observaciones, plan de tratamiento..." />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Signos Vitales</label>
                      <div className="grid grid-cols-3 gap-3">
                        <input value={historiaForm.presion} onChange={e => setHistoriaForm({...historiaForm, presion: e.target.value})} className="p-2 border border-slate-200 rounded text-sm" placeholder="PA (mmHg)" />
                        <input value={historiaForm.glucosa} onChange={e => setHistoriaForm({...historiaForm, glucosa: e.target.value})} className="p-2 border border-slate-200 rounded text-sm" placeholder="Glucosa" />
                        <input value={historiaForm.peso} onChange={e => setHistoriaForm({...historiaForm, peso: e.target.value})} className="p-2 border border-slate-200 rounded text-sm" placeholder="Peso (kg)" />
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-3 mt-6">
                    <button onClick={() => setShowCrearHistoria(false)} className="flex-1 py-2.5 border border-slate-200 rounded-xl text-sm font-bold">Cancelar</button>
                    <button onClick={crearHistoria} disabled={saving || !historiaForm.pacienteId || !historiaForm.diagnostico} className="flex-1 py-2.5 bg-[#13ec5b] text-[#102216] rounded-xl text-sm font-bold disabled:opacity-50">
                      {saving ? "Guardando..." : "Registrar"}
                    </button>
                  </div>
                </Modal>
              )}

              {historia.length === 0 ? (
                <Empty icon="history_edu" title="Sin registros" subtitle={isMedico ? "Registra la historia clínica de tus pacientes" : "Tu médico actualizará tu historia"} />
              ) : (
                <div className="space-y-3">
                  {historia.map((h) => (
                    <div key={h.id} className="bg-white p-4 lg:p-6 rounded-xl border border-emerald-100">
                      <div className="flex flex-col sm:flex-row sm:justify-between gap-1 mb-2">
                        <div>
                          <h4 className="font-bold text-sm lg:text-base">{h.tipo}</h4>
                          <p className="text-xs text-slate-500">{isMedico ? `Paciente: ${h.pacienteNombre}` : h.medicoNombre} — {h.diagnostico}</p>
                        </div>
                        <span className="text-xs text-slate-400">{formatDate(h.fecha)}</span>
                      </div>
                      <p className="text-xs lg:text-sm text-slate-600">{h.notas}</p>
                      {h.signos && Object.values(h.signos).some(v => v) && (
                        <div className="flex flex-wrap gap-2 mt-3">
                          {Object.entries(h.signos).map(([k, v]) => v && (
                            <span key={k} className="px-2 py-1 bg-emerald-50 rounded text-xs font-medium capitalize">{k}: {v}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ═══ CURSOS (paciente) ═══ */}
          {tab === "cursos" && !isMedico && (
            <div>
              {/* ── Vista detalle de curso ── */}
              {cursoActivo && cursoDetalle ? (() => {
                const ins = inscripciones.find(i => i.cursoId === cursoActivo);
                if (!ins) return null;
                const totalItems = cursoDetalle.modulos.reduce((s, m) => s + m.items.length, 0);
                const completedCount = ins.completedItems?.length || 0;
                const progreso = totalItems > 0 ? Math.round((completedCount / totalItems) * 100) : 0;
                const allItemsDone = completedCount >= totalItems;

                return (
                  <div>
                    <button onClick={() => { setCursoActivo(null); setCursoDetalle(null); setShowEvaluacion(false); setEvalResult(null); }} className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 mb-4">
                      <span className="material-icons-outlined text-lg">arrow_back</span>Volver a cursos
                    </button>

                    <div className="bg-white p-5 lg:p-6 rounded-xl border border-emerald-100 mb-6">
                      <h2 className="text-xl lg:text-2xl font-bold mb-1">{cursoDetalle.titulo}</h2>
                      <div className="flex flex-wrap items-center gap-4 mt-2 mb-4">
                        <div className="flex items-center gap-2 text-sm">
                          <span className="material-icons-outlined text-[#13ec5b] text-lg">check_circle</span>
                          <span className="font-bold">{completedCount}/{totalItems}</span> <span className="text-slate-500">ítems completados</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <span className="font-bold text-emerald-700">{progreso}%</span>
                        </div>
                        {ins.estado === "completado" && (
                          <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full">✅ CERTIFICADO</span>
                        )}
                      </div>
                      <div className="w-full bg-emerald-100 rounded-full h-3">
                        <div className="h-3 rounded-full bg-[#13ec5b] transition-all" style={{ width: `${progreso}%` }}></div>
                      </div>
                    </div>

                    {/* Módulos con ítems */}
                    <div className="space-y-4 mb-8">
                      {cursoDetalle.modulos.map((mod, mi) => {
                        const modItemsDone = mod.items.filter((_, ii) => (ins.completedItems || []).includes(`${mi}:${ii}`)).length;
                        const modComplete = modItemsDone === mod.items.length;
                        return (
                          <div key={mi} className="bg-white rounded-xl border border-emerald-100 overflow-hidden">
                            <div className={`px-4 lg:px-5 py-3 flex items-center justify-between ${modComplete ? "bg-emerald-50" : "bg-slate-50"}`}>
                              <h3 className="font-bold text-sm flex items-center gap-2">
                                {modComplete && <span className="material-icons-outlined text-[#13ec5b] text-lg">check_circle</span>}
                                {mod.titulo}
                              </h3>
                              <span className="text-xs text-slate-500">{modItemsDone}/{mod.items.length}</span>
                            </div>
                            <div className="divide-y divide-slate-50">
                              {mod.items.map((item, ii) => {
                                const key = `${mi}:${ii}`;
                                const done = (ins.completedItems || []).includes(key);
                                return (
                                  <div key={ii} className="w-full flex items-center gap-3 px-4 lg:px-5 py-3 text-left">
                                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 ${done ? "bg-[#13ec5b] border-[#13ec5b]" : "border-slate-200 bg-slate-50"}`}>
                                      {done && <span className="material-icons-outlined text-white text-sm">check</span>}
                                    </div>
                                    <span className={`text-sm ${done ? "text-slate-400 line-through" : "text-slate-700"}`}>{item}</span>
                                    {!done && <span className="ml-auto text-[10px] text-slate-300 flex items-center gap-1"><span className="material-icons-outlined text-xs">lock</span>Avanza con Aura</span>}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Tutoría */}
                    <div className="bg-gradient-to-br from-blue-50 to-white rounded-xl border border-blue-100 p-5 lg:p-6 mb-6">
                      <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
                        <span className="material-icons-outlined text-blue-500">support_agent</span>
                        ¿Necesitas ayuda con un profesional?
                      </h3>
                      <p className="text-sm text-slate-600 mb-4">Si tienes dificultades con algún tema, puedes agendar una tutoría con un profesional real que te acompañará en tu aprendizaje.</p>
                      
                      {showAgendarTutoria ? (
                        <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-4">
                          <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Seleccionar Profesional</label>
                            <select value={tutoriaForm.medicoId} onChange={e => setTutoriaForm({...tutoriaForm, medicoId: e.target.value})} className="w-full p-2.5 border border-slate-200 rounded-lg text-sm">
                              <option value="">-- Seleccione un profesional --</option>
                              {medicos.map(m => <option key={m.id} value={m.id}>Dr. {m.nombre} {m.apellido}</option>)}
                            </select>
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Fecha</label>
                              <input type="date" value={tutoriaForm.fecha} onChange={e => setTutoriaForm({...tutoriaForm, fecha: e.target.value})} className="w-full p-2.5 border border-slate-200 rounded-lg text-sm" />
                            </div>
                            <div>
                              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Hora</label>
                              <input type="time" value={tutoriaForm.hora} onChange={e => setTutoriaForm({...tutoriaForm, hora: e.target.value})} className="w-full p-2.5 border border-slate-200 rounded-lg text-sm" />
                            </div>
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">¿En qué tema necesitas ayuda?</label>
                            <textarea value={tutoriaForm.motivo} onChange={e => setTutoriaForm({...tutoriaForm, motivo: e.target.value})} className="w-full p-2.5 border border-slate-200 rounded-lg text-sm" rows={2} placeholder="Describe tu dificultad o el tema que quieres reforzar..." />
                          </div>
                          <div className="flex gap-3">
                            <button onClick={() => setShowAgendarTutoria(false)} className="flex-1 py-2.5 border border-slate-200 rounded-xl text-sm font-bold">Cancelar</button>
                            <button onClick={() => agendarTutoria(cursoDetalle.titulo)} disabled={saving || !tutoriaForm.medicoId || !tutoriaForm.fecha || !tutoriaForm.hora || !tutoriaForm.motivo} className="flex-1 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold disabled:opacity-50 flex items-center justify-center gap-2">
                              {saving ? "Agendando..." : <><span className="material-icons-outlined text-lg">event</span>Agendar Tutoría</>}
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button onClick={() => setShowAgendarTutoria(true)} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl text-sm flex items-center gap-2 transition">
                          <span className="material-icons-outlined">person_search</span>
                          Agendar Tutoría con Profesional
                        </button>
                      )}
                    </div>

                    {/* Evaluación */}
                    <div className="bg-white rounded-xl border border-emerald-100 p-5 lg:p-6">
                      <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
                        <span className="material-icons-outlined text-amber-500">quiz</span>
                        Evaluación de Certificación
                      </h3>

                      {ins.estado === "completado" ? (
                        <div className="bg-emerald-50 p-4 rounded-xl text-center">
                          <span className="material-icons-outlined text-[#13ec5b] text-5xl mb-2">workspace_premium</span>
                          <p className="font-bold text-emerald-800 text-lg">¡Curso Aprobado!</p>
                          <p className="text-sm text-emerald-600">Nota: {ins.evaluacionNota}% — Certificado emitido</p>
                        </div>
                      ) : !allItemsDone ? (
                        <div className="bg-amber-50 p-4 rounded-xl flex items-start gap-3">
                          <span className="material-icons-outlined text-amber-500">info</span>
                          <div>
                            <p className="text-sm font-bold text-amber-800">Completa todos los ítems primero</p>
                            <p className="text-xs text-amber-600">Te faltan {totalItems - completedCount} ítems por completar antes de presentar la evaluación.</p>
                          </div>
                        </div>
                      ) : !showEvaluacion ? (
                        <div>
                          {ins.evaluacionNota !== null && !ins.evaluacionAprobada && (
                            <div className="bg-red-50 p-3 rounded-lg mb-3 flex items-start gap-2">
                              <span className="material-icons-outlined text-red-500 text-lg">error</span>
                              <div>
                                <p className="text-sm font-bold text-red-700">No aprobaste ({ins.evaluacionNota}%)</p>
                                <p className="text-xs text-red-600">Necesitas mínimo 70%. Puedes intentar de nuevo.</p>
                              </div>
                            </div>
                          )}
                          <p className="text-sm text-slate-600 mb-4">Evaluación de {cursoDetalle.evaluacion.length} preguntas. Se aprueba con 70% o más.</p>
                          <button onClick={() => { setShowEvaluacion(true); setRespuestas({}); setEvalResult(null); }} className="bg-[#13ec5b] text-[#102216] font-bold py-3 px-6 rounded-xl text-sm flex items-center gap-2">
                            <span className="material-icons-outlined">assignment</span>
                            {ins.evaluacionNota !== null ? "Reintentar Evaluación" : "Presentar Evaluación"}
                          </button>
                        </div>
                      ) : evalResult ? (
                        <div className={`p-4 rounded-xl text-center ${evalResult.aprobado ? "bg-emerald-50" : "bg-red-50"}`}>
                          <span className={`material-icons-outlined text-5xl mb-2 ${evalResult.aprobado ? "text-[#13ec5b]" : "text-red-400"}`}>
                            {evalResult.aprobado ? "workspace_premium" : "sentiment_dissatisfied"}
                          </span>
                          <p className={`font-bold text-lg ${evalResult.aprobado ? "text-emerald-800" : "text-red-700"}`}>
                            {evalResult.aprobado ? "¡Aprobaste!" : "No alcanzaste el puntaje"}
                          </p>
                          <p className={`text-sm ${evalResult.aprobado ? "text-emerald-600" : "text-red-600"}`}>
                            Tu nota: {evalResult.nota}%{evalResult.aprobado ? " — ¡Certificado emitido! 🎉" : " — Necesitas 70%. Puedes reintentar."}
                          </p>
                          {!evalResult.aprobado && (
                            <button onClick={() => { setShowEvaluacion(false); setEvalResult(null); }} className="mt-4 bg-white border border-slate-200 px-4 py-2 rounded-lg text-sm font-bold">
                              Cerrar
                            </button>
                          )}
                        </div>
                      ) : (
                        <div>
                          <div className="space-y-6 mb-6">
                            {cursoDetalle.evaluacion.map((q, qi) => (
                              <div key={qi} className="bg-slate-50 p-4 rounded-xl">
                                <p className="font-bold text-sm mb-3">{qi + 1}. {q.pregunta}</p>
                                <div className="space-y-2">
                                  {q.opciones.map((op, oi) => (
                                    <button key={oi} onClick={() => setRespuestas({ ...respuestas, [qi]: oi })}
                                      className={`w-full text-left px-4 py-2.5 rounded-lg text-sm transition border ${
                                        respuestas[qi] === oi
                                          ? "bg-[#13ec5b]/10 border-[#13ec5b] font-bold"
                                          : "bg-white border-slate-200 hover:border-slate-300"
                                      }`}>
                                      <span className="font-bold mr-2">{String.fromCharCode(65 + oi)}.</span>{op}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                          <div className="flex gap-3">
                            <button onClick={() => setShowEvaluacion(false)} className="flex-1 py-2.5 border border-slate-200 rounded-xl text-sm font-bold">Cancelar</button>
                            <button
                              onClick={() => submitEvaluacion(ins.id, totalItems)}
                              disabled={Object.keys(respuestas).length < cursoDetalle.evaluacion.length}
                              className="flex-1 py-2.5 bg-[#13ec5b] text-[#102216] rounded-xl text-sm font-bold disabled:opacity-50">
                              Enviar Respuestas ({Object.keys(respuestas).length}/{cursoDetalle.evaluacion.length})
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })() : (
                /* ── Lista de cursos ── */
                <div>
                  <h2 className="text-xl lg:text-2xl font-bold mb-6">Mis Cursos</h2>
                  {inscripciones.length > 0 && (
                    <div className="mb-8">
                      <h3 className="text-sm font-bold text-slate-500 uppercase mb-3">Inscritos</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                        {inscripciones.map((ins) => {
                          const curso = cursos.find(c => c.id === ins.cursoId);
                          const total = curso?.totalItems || 1;
                          const done = ins.completedItems?.length || 0;
                          const pct = Math.round((done / total) * 100);
                          return (
                            <div key={ins.id} className="bg-white p-5 rounded-xl border border-emerald-100 hover:border-[#13ec5b]/30 transition cursor-pointer" onClick={() => abrirCurso(ins.cursoId)}>
                              <div className="flex items-start justify-between mb-2">
                                <div className="text-3xl">{curso?.imagen || "📚"}</div>
                                {ins.estado === "completado" && <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded-full">CERTIFICADO</span>}
                              </div>
                              <h4 className="font-bold text-sm mb-1">{ins.cursoTitulo}</h4>
                              <p className="text-xs text-slate-500 mb-3">{curso?.instructor}</p>
                              <div className="flex justify-between text-xs mb-2">
                                <span className="text-slate-500">{done}/{total} ítems</span>
                                <span className="font-bold text-emerald-700">{pct}%</span>
                              </div>
                              <div className="w-full bg-emerald-100 rounded-full h-2"><div className="h-2 rounded-full bg-[#13ec5b]" style={{ width: `${pct}%` }}></div></div>
                              <p className="text-xs text-[#13ec5b] font-bold mt-3 flex items-center gap-1">
                                <span className="material-icons-outlined text-sm">play_circle</span>
                                {ins.estado === "completado" ? "Ver certificado" : "Continuar curso"}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                  {/* Progreso WhatsApp en cursos */}
                  {progresoWA.length > 0 && (
                    <div className="mb-8">
                      <h3 className="text-sm font-bold text-slate-500 uppercase mb-3 flex items-center gap-2">
                        <span className="material-icons-outlined text-[#25D366] text-lg">chat</span>
                        Progreso vía WhatsApp (Guía Aura)
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                        {progresoWA.map((p) => (
                          <div key={p.id} className="bg-gradient-to-br from-[#25D366]/5 to-white p-5 rounded-xl border border-[#25D366]/20">
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-2">
                                <div className="w-10 h-10 bg-[#25D366]/10 rounded-full flex items-center justify-center">
                                  <span className="material-icons-outlined text-[#25D366]">school</span>
                                </div>
                                <div>
                                  <p className="font-bold text-sm">{p.cursoNombre}</p>
                                  <p className="text-[10px] text-slate-400">Módulo {p.moduloCompletado}/{p.totalModulos}</p>
                                </div>
                              </div>
                              <span className="text-xl font-bold text-[#25D366]">{p.porcentaje}%</span>
                            </div>
                            <div className="w-full bg-[#25D366]/10 rounded-full h-3 mb-2">
                              <div className="h-3 rounded-full bg-[#25D366] transition-all" style={{ width: `${p.porcentaje}%` }}></div>
                            </div>
                            {p.nota && <p className="text-xs text-emerald-600 font-bold">Última nota: {p.nota}/100</p>}
                            {p.detalle && <p className="text-xs text-slate-400 italic mt-1">{p.detalle}</p>}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <h3 className="text-sm font-bold text-slate-500 uppercase mb-3">Catálogo de Cursos</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                    {cursos.map((curso) => {
                      const enrolled = inscripciones.some(i => i.cursoId === curso.id);
                      return (
                        <div key={curso.id} className="bg-white p-5 rounded-xl border border-emerald-100 hover:border-[#13ec5b]/50 transition-all">
                          <div className="text-3xl mb-2">{curso.imagen}</div>
                          <h4 className="font-bold text-sm mb-1">{curso.titulo}</h4>
                          <p className="text-xs text-slate-500 mb-1">{curso.instructor}</p>
                          <p className="text-xs text-slate-400 mb-3">{curso.totalModulos || curso.modulos} módulos • {curso.duracionHoras}h</p>
                          {enrolled ? (
                            <button onClick={() => abrirCurso(curso.id)} className="w-full py-2 rounded-lg text-xs font-bold bg-emerald-100 text-emerald-700">
                              📖 Ir al curso
                            </button>
                          ) : (
                            <button onClick={() => inscribirCurso(curso)} className="w-full py-2 rounded-lg text-xs font-bold bg-[#13ec5b] text-[#102216]">
                              Inscribirme
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

// ── Helper Components ──

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-white p-4 rounded-xl border border-emerald-100">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="text-2xl font-bold text-emerald-700">{value}</p>
    </div>
  );
}

function Empty({ icon, title, subtitle }: { icon: string; title: string; subtitle: string }) {
  return (
    <div className="bg-white p-8 rounded-xl border border-emerald-100 text-center">
      <span className="material-icons-outlined text-5xl text-slate-300 mb-3">{icon}</span>
      <p className="text-slate-500 mb-1">{title}</p>
      <p className="text-xs text-slate-400">{subtitle}</p>
    </div>
  );
}

function Modal({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}
