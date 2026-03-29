"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/AuthContext";

const GOOGLE_CLIENT_ID = "253297969014-qpemu9li1l64vceqld3ki1cteuu7m7gj.apps.googleusercontent.com";

function LoginForm() {
  const { login, loginWithGoogle } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Initialize Google Sign-In
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.onload = () => {
      if (!(window as unknown as Record<string, unknown>).google) return;
      const google = (window as unknown as Record<string, { initialize: (cfg: Record<string, unknown>) => void; renderButton: (el: HTMLElement, cfg: Record<string, unknown>) => void }>).google;
      google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleGoogleResponse,
        auto_select: false,
      });
      const btn = document.getElementById("google-signin-btn");
      if (btn) {
        google.accounts.id.renderButton(btn, {
          theme: "filled_black",
          size: "large",
          width: "100%",
          text: "continue_with",
          shape: "pill",
          locale: "es",
        });
      }
    };
    document.body.appendChild(script);
    return () => { document.body.removeChild(script); };
  }, []);

  const handleGoogleResponse = async (response: { credential: string }) => {
    setError("");
    setLoading(true);
    const result = await loginWithGoogle(response.credential);
    setLoading(false);
    if (result.success) {
      router.push(redirect);
    } else {
      setError(result.error || "Error con Google");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);
    if (result.success) {
      router.push(redirect);
    } else {
      setError(result.error || "Error al iniciar sesión");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e3a8a] to-[#0c4a6e] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3">
            <img src="/logo-issi.png" alt="ISSI" className="w-14 h-14 rounded-full" />
            <span className="text-2xl font-bold text-white">ISSI</span>
          </Link>
        </div>

        {/* Card */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
          <h1 className="text-2xl font-bold text-white mb-2">Iniciar Sesión</h1>
          <p className="text-gray-400 mb-6">Accede a tu plataforma ISSI</p>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-red-400 text-xl">error</span>
              <span className="text-red-300 text-sm">{error}</span>
            </div>
          )}

          {/* Google Sign-In */}
          <div className="mb-6">
            <div id="google-signin-btn" className="flex justify-center" />
          </div>

          <div className="flex items-center gap-4 mb-6">
            <div className="h-px flex-1 bg-white/10" />
            <span className="text-gray-500 text-xs uppercase">o con email</span>
            <div className="h-px flex-1 bg-white/10" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Correo Electrónico</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-xl">mail</span>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="correo@ejemplo.com" required className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#0f2847]/50 transition" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Contraseña</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-xl">lock</span>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required minLength={6} className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#0f2847]/50 transition" />
              </div>
            </div>

            <button type="submit" disabled={loading} className="w-full py-3 bg-[#0f2847] hover:bg-[#2563eb] text-white font-bold rounded-xl transition disabled:opacity-50 flex items-center justify-center gap-2">
              {loading ? (
                <><svg className="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg> Ingresando...</>
              ) : (
                <><span className="material-symbols-outlined text-xl">login</span> Iniciar Sesión</>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm">
              ¿No tienes cuenta?{" "}
              <Link href="/registro" className="text-sky-200 hover:text-white hover:underline font-medium transition-colors">Regístrate aquí</Link>
            </p>
          </div>
        </div>

        <p className="text-center text-gray-500 text-xs mt-6">
          © 2026 ISSI — Instituto Superior de Salud Integral<br />
          <span className="text-gray-400">Powered by <span className="font-semibold text-sky-200">AINovaX</span></span>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#1e293b] flex items-center justify-center"><div className="animate-spin h-8 w-8 border-4 border-[#c5a044] border-t-transparent rounded-full" /></div>}>
      <LoginForm />
    </Suspense>
  );
}
