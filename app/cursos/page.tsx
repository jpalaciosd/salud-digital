"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
  precio: number;
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
  "curso-adulto-mayor": "Nuevo",
};

export default function Cursos() {
  const { user, token } = useAuth();
  const router = useRouter();
  const [cursos, setCursos] = useState<CursoAPI[]>([]);
  const [inscritos, setInscritos] = useState<Set<string>>(new Set());

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

  const irAPagar = (cursoId: string) => {
    if (!user) {
      router.push(`/login?redirect=/pagar/${cursoId}`);
      return;
    }
    router.push(`/pagar/${cursoId}`);
  };

  return (
    <div className="min-h-screen">
      {/* Nav */}
      {user ? (
        <UserNav />
      ) : (
        <header className="sticky top-0 z-50 w-full bg-[#0f2847] border-b border-white/10 px-4 py-3">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <img src="/logo-issi.png" alt="ISSI" className="w-9 h-9 rounded-full" />
              <span className="text-lg font-bold text-white tracking-tight uppercase">ISSI</span>
            </Link>
            <nav className="flex items-center gap-6">
              <Link href="/" className="text-sm text-gray-300 hover:text-white transition-colors">Inicio</Link>
              <Link href="/cursos" className="text-sm text-[#c5a044] font-semibold">Cursos</Link>
              <Link href="/login?redirect=/cursos" className="px-5 py-2 rounded-lg bg-[#c5a044] text-[#0f2847] font-bold text-sm hover:opacity-90 transition">Iniciar Sesión</Link>
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
                    <span className="text-lg font-extrabold text-[#c5a044]">{curso.precio ? `$${curso.precio.toLocaleString("es-CO")}` : "Gratis"}</span>
                    {enrolled ? (
                      <Link href="/dashboard?tab=cursos" className="px-6 py-2 rounded-lg bg-green-600 text-white font-bold text-sm">
                        📖 Ir al curso
                      </Link>
                    ) : (
                      <button
                        onClick={() => irAPagar(curso.id)}
                        className="px-6 py-2 rounded-lg bg-[#0f2847] text-white font-bold text-sm hover:opacity-90 transition-all"
                      >
                        Pagar e inscribirme
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
