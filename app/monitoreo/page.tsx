"use client";
import { useState } from "react";
import { useAuth } from "@/lib/AuthContext";
import Link from "next/link";

const pacientes = [
  { nombre: "Carlos Ruiz", iniciales: "", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBShdiWBnmVrTrA_qn6FWsz0_iJPgQet0C7azsLI2APprMbkEvFMBCCVLbnGcSnHVBCgtxYyfunhso63UUfo8pnTIkxPnjWaP0AjHDJkck30FzH1lTd_wg-aiO7WowZse1Nk0tbo1Me6Oz3dlHWjydIHfiYyWzDBhIKZagqQdnTb3dpYbURrZbAa_eJd40y90_RVSiOfyatzkdW4OfbFDGJnRAwvFyBntmGxKsYJS0oOfzjcK5sgK6MXdxxxbzg29Ctmv27zm45dsng", cond: "HTA • Diabetes II", riesgo: "Crítico", riesgoColor: "bg-rose-100 text-rose-700", lecturas: [{ icon: "favorite", color: "text-rose-500", val: "145/95" }, { icon: "water_drop", color: "text-blue-500", val: "162 mg/dL" }], contacto: "Hace 3 días", edad: "64 años", ciudad: "Bogotá, DC", cedula: "10.293.847" },
  { nombre: "Marta Arango", iniciales: "MA", img: "", cond: "EPOC", riesgo: "Medio", riesgoColor: "bg-amber-100 text-amber-700", lecturas: [{ icon: "air", color: "text-slate-400", val: "92% SpO2" }], contacto: "Ayer", edad: "58 años", ciudad: "Medellín", cedula: "43.567.890" },
  { nombre: "Jorge Pérez", iniciales: "JP", img: "", cond: "Control Post-Op", riesgo: "Estable", riesgoColor: "bg-blue-100 text-blue-700", lecturas: [{ icon: "scale", color: "text-slate-400", val: "82.1 kg" }], contacto: "Hoy", edad: "45 años", ciudad: "Cali", cedula: "16.789.012" },
];

export default function Monitoreo() {
  const { user, logout } = useAuth();
  const [selected, setSelected] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const paciente = pacientes[selected];

  return (
    <div className="min-h-screen flex bg-[#fafaf7]" style={{ fontFamily: "'Manrope', sans-serif" }}>
      {/* Mobile overlay */}
      {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 w-72 lg:w-64 bg-white border-r border-slate-200 z-50 transform transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 lg:static lg:shrink-0 flex flex-col`}>
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#0f4c75] rounded flex items-center justify-center">
              <span className="material-icons-outlined text-white text-lg">clinical_notes</span>
            </div>
            <span className="text-lg font-bold tracking-tight text-slate-900">SaludClínica</span>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-1 text-slate-400">
            <span className="material-icons-outlined">close</span>
          </button>
        </div>
        <nav className="flex-1 mt-2 px-3 space-y-1">
          <p className="px-4 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Gestión</p>
          <a className="flex items-center gap-3 px-4 py-2.5 bg-[#0f4c75]/10 text-[#0f4c75] rounded-lg font-semibold text-sm" href="#">
            <span className="material-icons-outlined text-xl">group</span>
            Panel de Pacientes
          </a>
          {[
            { icon: "notifications_active", label: "Alertas Críticas" },
            { icon: "calendar_today", label: "Agenda Médica" },
          ].map((item, i) => (
            <a key={i} className="flex items-center gap-3 px-4 py-2.5 text-slate-500 hover:bg-slate-50 rounded-lg transition-colors text-sm" href="#">
              <span className="material-icons-outlined text-xl">{item.icon}</span>
              {item.label}
            </a>
          ))}
          <p className="px-4 py-2 mt-6 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Análisis</p>
          {[
            { icon: "monitoring", label: "Estadísticas Población" },
            { icon: "assignment", label: "Reportes Epidemiológicos" },
          ].map((item, i) => (
            <a key={i} className="flex items-center gap-3 px-4 py-2.5 text-slate-500 hover:bg-slate-50 rounded-lg transition-colors text-sm" href="#">
              <span className="material-icons-outlined text-xl">{item.icon}</span>
              {item.label}
            </a>
          ))}
        </nav>
        <div className="mt-auto p-4">
          <div className="bg-slate-50 rounded-xl border border-slate-100 p-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#0f4c75] flex items-center justify-center text-white font-bold text-xs shrink-0">
                {(user?.nombre?.[0] || "D")}{(user?.apellido?.[0] || "r")}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-slate-900 truncate">{user?.nombre} {user?.apellido}</p>
                <p className="text-[10px] text-slate-500 capitalize">{user?.rol}</p>
              </div>
            </div>
          </div>
          <div className="flex gap-2 mt-2">
            <Link href="/dashboard" className="flex-1 text-center text-xs text-slate-500 hover:bg-slate-50 py-1.5 rounded-lg transition">Dashboard</Link>
            <button onClick={logout} className="flex-1 text-xs text-red-500 hover:bg-red-50 py-1.5 rounded-lg transition">Salir</button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0 flex flex-col">
        {/* Mobile header */}
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-lg border-b border-slate-200 px-4 py-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 -ml-2 text-slate-600 hover:bg-slate-50 rounded-lg">
                <span className="material-icons-outlined">menu</span>
              </button>
              <div>
                <h1 className="text-base lg:text-2xl font-bold text-slate-900">Monitoreo Clínico</h1>
                <p className="text-[10px] lg:text-sm text-slate-500 hidden sm:block">3 pacientes requieren atención inmediata</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative hidden sm:block">
                <span className="material-icons-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">search</span>
                <input className="pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-sm w-48 lg:w-64 focus:ring-[#0f4c75] focus:border-[#0f4c75]" placeholder="Buscar paciente..." type="text" />
              </div>
              <button className="relative p-2 text-slate-500">
                <span className="material-icons-outlined">notifications</span>
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
              </button>
            </div>
          </div>
        </header>

        <div className="p-4 lg:p-6 flex-1">
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 lg:gap-6">
            {/* Table + Charts */}
            <div className="xl:col-span-8 space-y-4">
              {/* Patient List — cards on mobile, table on desktop */}
              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <div className="px-4 lg:px-6 py-3 lg:py-4 border-b border-slate-100 flex justify-between items-center">
                  <h3 className="font-bold text-slate-900 flex items-center gap-2 text-sm lg:text-base">
                    <span className="material-icons-outlined text-rose-500 text-xl">priority_high</span>
                    Prioridad de Atención
                  </h3>
                  <span className="text-[10px] lg:text-xs font-medium text-slate-400">124 monitoreados</span>
                </div>
                {/* Desktop table */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 text-slate-500 font-semibold">
                      <tr>
                        <th className="px-4 lg:px-6 py-3">Paciente</th>
                        <th className="px-4 py-3 text-center">Riesgo</th>
                        <th className="px-4 py-3">Última Lectura</th>
                        <th className="px-4 py-3">Contacto</th>
                        <th className="px-4 py-3"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {pacientes.map((p, i) => (
                        <tr key={i} onClick={() => setSelected(i)} className={`hover:bg-blue-50/30 cursor-pointer ${selected === i ? "bg-blue-50/10" : ""}`}>
                          <td className="px-4 lg:px-6 py-3">
                            <div className="flex items-center gap-3">
                              {p.img ? <img alt={p.nombre} className="w-8 h-8 rounded-full" src={p.img} /> : <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-xs">{p.iniciales}</div>}
                              <div>
                                <p className="font-bold text-slate-900 text-sm">{p.nombre}</p>
                                <p className="text-[10px] text-slate-400">{p.cond}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span className={`inline-block px-2 py-0.5 text-[10px] font-bold rounded uppercase ${p.riesgoColor}`}>{p.riesgo}</span>
                          </td>
                          <td className="px-4 py-3">
                            {p.lecturas.map((l, j) => (
                              <div key={j} className="flex items-center gap-1.5">
                                <span className={`material-icons-outlined text-sm ${l.color}`}>{l.icon}</span>
                                <span className="text-xs font-medium">{l.val}</span>
                              </div>
                            ))}
                          </td>
                          <td className="px-4 py-3 text-xs text-slate-500">{p.contacto}</td>
                          <td className="px-4 py-3"><span className="material-icons-outlined text-slate-400 text-xl">chevron_right</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {/* Mobile cards */}
                <div className="md:hidden divide-y divide-slate-100">
                  {pacientes.map((p, i) => (
                    <button key={i} onClick={() => { setSelected(i); setDetailOpen(true); }} className={`w-full text-left p-4 hover:bg-slate-50 transition ${selected === i ? "bg-blue-50/20" : ""}`}>
                      <div className="flex items-center gap-3">
                        {p.img ? <img alt={p.nombre} className="w-10 h-10 rounded-full" src={p.img} /> : <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-xs">{p.iniciales}</div>}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="font-bold text-slate-900 text-sm truncate">{p.nombre}</p>
                            <span className={`px-2 py-0.5 text-[10px] font-bold rounded uppercase shrink-0 ml-2 ${p.riesgoColor}`}>{p.riesgo}</span>
                          </div>
                          <p className="text-[10px] text-slate-400">{p.cond}</p>
                          <div className="flex items-center gap-3 mt-1">
                            {p.lecturas.map((l, j) => (
                              <span key={j} className="text-[10px] font-medium text-slate-600">{l.val}</span>
                            ))}
                            <span className="text-[10px] text-slate-400">• {p.contacto}</span>
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-xl border border-slate-200">
                  <h4 className="text-[10px] lg:text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Tendencia Glucosa</h4>
                  <div className="h-24 lg:h-32 flex items-end gap-1 px-2">
                    {[40, 60, 85, 100, 70, 45].map((h, i) => (
                      <div key={i} className={`flex-1 rounded-t ${i === 3 ? "bg-[#0f2847] shadow-[0_0_15px_-5px_#0f2847]" : "bg-[#0f4c75]"}`} style={{ height: `${h}%`, opacity: i === 3 ? 1 : 0.2 + (i * 0.1) }}></div>
                    ))}
                  </div>
                  <div className="flex justify-between mt-2 text-[8px] lg:text-[10px] text-slate-400">
                    <span>Lun</span><span>Mar</span><span>Mié</span><span>Jue</span><span>Vie</span><span>Sáb</span>
                  </div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200">
                  <h4 className="text-[10px] lg:text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Alertas por Categoría</h4>
                  <div className="space-y-3">
                    {[
                      { label: "HTA", val: 15, pct: 15, color: "bg-rose-500" },
                      { label: "Gluco", val: 35, pct: 35, color: "bg-amber-500" },
                      { label: "Seguim", val: 50, pct: 50, color: "bg-[#0f4c75]" },
                    ].map((a, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <div className="flex-1 bg-slate-100 h-2 rounded-full overflow-hidden">
                          <div className={`${a.color} h-full`} style={{ width: `${a.pct}%` }}></div>
                        </div>
                        <span className="text-[10px] font-bold w-16">{a.label} ({a.val})</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Patient Detail — panel on desktop, sheet on mobile */}
            {detailOpen && (
              <div className="fixed inset-0 bg-black/50 z-50 xl:hidden" onClick={() => setDetailOpen(false)}>
                <div className="absolute inset-x-0 bottom-0 max-h-[85vh] bg-white rounded-t-2xl overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                  <div className="sticky top-0 bg-white border-b border-slate-100 p-4 flex justify-between items-center">
                    <h3 className="font-bold">Detalle del Paciente</h3>
                    <button onClick={() => setDetailOpen(false)} className="p-1 text-slate-400"><span className="material-icons-outlined">close</span></button>
                  </div>
                  <PatientDetail paciente={paciente} />
                </div>
              </div>
            )}
            <aside className="xl:col-span-4 hidden xl:block">
              <div className="bg-white rounded-xl border border-slate-200 sticky top-20">
                <PatientDetail paciente={paciente} />
              </div>
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
}

function PatientDetail({ paciente }: { paciente: typeof pacientes[0] }) {
  return (
    <>
      <div className="p-4 lg:p-6 border-b border-slate-100">
        <div className="flex items-start gap-4">
          {paciente.img ? (
            <img alt={paciente.nombre} className="w-14 h-14 lg:w-16 lg:h-16 rounded-xl object-cover border-2 border-[#0f2847]/20" src={paciente.img} />
          ) : (
            <div className="w-14 h-14 lg:w-16 lg:h-16 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-xl">{paciente.iniciales}</div>
          )}
          <div>
            <h2 className="text-lg lg:text-xl font-bold text-slate-900">{paciente.nombre}</h2>
            <p className="text-xs text-slate-500">{paciente.edad} • {paciente.ciudad}</p>
            <span className="inline-block mt-1 px-2 py-0.5 bg-slate-100 text-[10px] rounded">Cédula {paciente.cedula}</span>
          </div>
        </div>
        <div className="mt-4">
          <div className="flex justify-between items-end mb-2">
            <h4 className="text-[10px] lg:text-xs font-bold text-slate-400 uppercase">Tensión Arterial</h4>
            <span className="text-xs text-rose-500 font-bold">{paciente.lecturas[0]?.val}</span>
          </div>
          <div className="relative h-20 lg:h-24 w-full">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 100 40">
              <path d="M0,35 Q10,30 20,32 T40,25 T60,28 T80,15 T100,5" fill="none" stroke="#0f4c75" strokeWidth="2" opacity="0.5" />
              <path d="M0,35 Q10,30 20,32 T40,25 T60,28 T80,15 T100,5" fill="none" stroke="#ef4444" strokeWidth="2.5" strokeDasharray="3,2" />
              <circle cx="100" cy="5" r="3" fill="#ef4444" />
            </svg>
          </div>
        </div>
      </div>
      <div className="p-4 lg:p-6 space-y-3">
        <h4 className="text-[10px] lg:text-xs font-bold text-slate-400 uppercase tracking-widest">Alertas</h4>
        <div className="p-3 bg-rose-50 border border-rose-100 rounded-lg flex gap-3">
          <span className="material-icons-outlined text-rose-500 text-lg shrink-0">warning</span>
          <div>
            <p className="text-xs font-bold text-rose-900">Pico Hipertensivo</p>
            <p className="text-[10px] text-rose-700/70">145/95 mmHg — hoy 08:30 AM</p>
          </div>
        </div>
        <div className="p-3 bg-amber-50 border border-amber-100 rounded-lg flex gap-3">
          <span className="material-icons-outlined text-amber-600 text-lg shrink-0">medication</span>
          <div>
            <p className="text-xs font-bold text-amber-900">Renovación de Metformina</p>
            <p className="text-[10px] text-amber-700/70">Fórmula vence en 2 días</p>
          </div>
        </div>
      </div>
      <div className="p-4 lg:p-6 bg-slate-50 border-t border-slate-100">
        <h4 className="text-[10px] lg:text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Acciones</h4>
        <button className="w-full flex items-center justify-center gap-2 bg-[#0f4c75] hover:bg-[#0f4c75]/90 text-white py-2.5 rounded-lg font-bold text-sm transition-all mb-2">
          <span className="material-icons-outlined text-xl">videocam</span>
          Iniciar Teleconsulta
        </button>
        <div className="grid grid-cols-2 gap-2">
          <button className="flex items-center justify-center gap-1.5 bg-white border border-slate-200 text-slate-700 py-2 rounded-lg font-bold text-xs hover:bg-slate-50">
            <span className="material-icons-outlined text-sm">edit_note</span>
            Receta
          </button>
          <button className="flex items-center justify-center gap-1.5 bg-white border border-slate-200 text-slate-700 py-2 rounded-lg font-bold text-xs hover:bg-slate-50">
            <span className="material-icons-outlined text-sm">chat</span>
            Mensaje
          </button>
        </div>
      </div>
    </>
  );
}
