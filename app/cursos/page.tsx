"use client";
import Link from "next/link";
import { useAuth } from "@/lib/AuthContext";
import UserNav from "@/lib/UserNav";
import { useState, useEffect } from "react";

interface CursoAPI {
  id: string;
  titulo: string;
  descripcion: string;
  instructor: string;
  categoria: string;
  duracionHoras: number;
  imagen: string;
  totalModulos?: number;
  modulos?: number;
}

const nivelesMap: Record<string, string> = {
  "salud": "Básico",
  "salud-mental": "Básico",
  "enfermeria": "Intermedio",
  "emergencias": "Intermedio",
  "farmacologia": "Intermedio",
};

const tagsMap: Record<string, string> = {
  "curso-primeros-auxilios": "Popular",
  "curso-rcp-60h": "Nuevo",
  "curso-farmacologia": "Nuevo",
  "curso-bls-acls": "Nuevo",
};

export default function Cursos() {
  const { user, token } = useAuth();
  const [cursos, setCursos] = useState<CursoAPI[]>([]);
  const [inscribiendo, setInscribiendo] = useState<string | null>(null);
  const [inscritos, setInscritos] = useState<Set<string>>(new Set());
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    fetch("/api/cursos").then(r => r.json()).then(d => setCursos(d.cursos || []));
  }, []);

  useEffect(() => {
    if (!token) return;
    fetch("/api/inscripciones", { headers: { Cookie: `auth-token=${token}` } })
      .then(r => r.ok ? r.json() : { inscripciones: [] })
      .then(d => {
        const ids = new Set<string>((d.inscripciones || []).map((i: { cursoId: string }) => i.cursoId));
        setInscritos(ids);
      });
  }, [token]);

  const inscribir = async (cursoId: string) => {
    if (!user) {
      window.location.href = "/login?redirect=/cursos";
      return;
    }
    setInscribiendo(cursoId);
    setMensaje("");
    try {
      const res = await fetch("/api/inscripciones", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cursoId }),
      });
      if (res.ok) {
        setInscritos(prev => new Set([...prev, cursoId]));
        setMensaje("✅ ¡Inscripción exitosa! Ve a tu Dashboard para comenzar.");
      } else {
        const data = await res.json();
        setMensaje(data.error || "Error al inscribirte");
      }
    } catch {
      setMensaje("Error de conexión");
    }
    setInscribiendo(null);
  };

  return (
    <div className="min-h-screen">
      {/* Nav — UserNav se muestra si hay sesión; si no, header público */}
      <UserNav />
      {!user && (
        <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-[#0f2847]/10">
          <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img src="/logo-issi.png" alt="ISSI" className="w-12 h-12 rounded-full" />
              <span className="text-xl font-bold tracking-tight uppercase">ISSI</span>
            </div>
            <nav className="flex items-center gap-8">
              <Link href="/" className="text-sm font-semibold hover:text-[#c5a044] transition-colors">Inicio</Link>
              <Link href="/cursos" className="text-sm font-semibold text-[#c5a044]">Cursos</Link>
              <Link href="/login?redirect=/cursos" className="px-5 py-2 rounded-lg bg-[#0f2847] text-white font-bold text-sm">Iniciar Sesión</Link>
            </nav>
          </div>
        </header>
      )}

      {/* Hero */}
      <section className="py-16 px-6 bg-gradient-to-b from-[#0f2847] to-[#1e3a8a]">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Catálogo de Cursos</h1>
          <p className="text-lg text-blue-200">Formación certificada en salud — 100% virtual con tutor IA</p>
        </div>
      </section>

      {/* Mensaje */}
      {mensaje && (
        <div className="max-w-4xl mx-auto px-6 mt-6">
          <div className={`p-4 rounded-xl text-sm font-semibold text-center ${mensaje.startsWith("✅") ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
            {mensaje}
            {mensaje.startsWith("✅") && (
              <Link href="/dashboard" className="ml-2 underline font-bold">Ir al Dashboard →</Link>
            )}
          </div>
        </div>
      )}

      {/* Grid */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {cursos.map((curso) => {
              const enrolled = inscritos.has(curso.id);
              const nivel = nivelesMap[curso.categoria] || "Intermedio";
              const tag = tagsMap[curso.id] || "";
              const mods = curso.totalModulos || curso.modulos || 0;

              return (
                <div key={curso.id} className="bg-white rounded-2xl shadow-lg p-6 border border-slate-100 hover:shadow-xl transition-all flex flex-col">
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-4xl">{curso.imagen}</span>
                    {tag && (
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        tag === "Popular" ? "bg-amber-100 text-amber-700" : "bg-blue-100 text-blue-700"
                      }`}>{tag}</span>
                    )}
                  </div>
                  <h3 className="text-xl font-bold mb-2">{curso.titulo}</h3>
                  <p className="text-sm text-slate-500 mb-4 leading-relaxed flex-1">{curso.descripcion}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="text-xs bg-[#fafaf7] px-2 py-1 rounded-lg text-slate-600">📚 {mods} módulos</span>
                    <span className="text-xs bg-[#fafaf7] px-2 py-1 rounded-lg text-slate-600">⏱️ {curso.duracionHoras} horas</span>
                    <span className="text-xs bg-[#fafaf7] px-2 py-1 rounded-lg text-slate-600">📊 {nivel}</span>
                  </div>
                  <p className="text-xs text-slate-400 mb-4">👨‍⚕️ {curso.instructor}</p>
                  <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                    <span className="text-lg font-extrabold text-[#c5a044]">Gratis</span>
                    {enrolled ? (
                      <Link href="/dashboard?tab=cursos" className="px-6 py-2 rounded-lg bg-green-600 text-white font-bold text-sm">
                        📖 Ir al curso
                      </Link>
                    ) : (
                      <button
                        onClick={() => inscribir(curso.id)}
                        disabled={inscribiendo === curso.id}
                        className="px-6 py-2 rounded-lg bg-[#0f2847] text-white font-bold text-sm hover:opacity-90 transition-all disabled:opacity-50"
                      >
                        {inscribiendo === curso.id ? "Inscribiendo..." : "Inscribirme"}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA WhatsApp Tutor */}
      <section className="py-16 px-6 bg-[#1e3a8a]">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl font-extrabold mb-4">Aprende con Maestro<br />Tutor IA 🤖</h2>
          <p className="text-blue-200 mb-8">Después de inscribirte, inicia tu curso por WhatsApp con Aura, tu tutora virtual disponible 24/7.</p>
          <a href="https://wa.me/573148915903?text=Hola%20Aura%2C%20quiero%20empezar%20mi%20curso" target="_blank" className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-green-500 text-white font-bold text-lg hover:bg-green-600 transition-all">
            💬 Hablar con Aura
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 bg-[#0f2847] text-white/60 text-center text-sm">
        <p>© 2026 ISSI — Instituto Superior de Salud Integral. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}
