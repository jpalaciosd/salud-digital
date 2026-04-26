"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/AuthContext";

export default function RegistroPage() {
  const { register, login } = useAuth();
  const router = useRouter();

  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    email: "",
    password: "",
    confirmPassword: "",
    tipoDocumento: "CC",
    documento: "",
    rol: "paciente" as "paciente" | "medico" | "estudiante" | "profesional",
    telefono: "",
    fotoMedico: "",
    descripcionProfesional: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const update = (field: string, value: string) =>
    setForm((f) => ({ ...f, [field]: value }));
  const isMedico = form.rol === "medico";
  const isProfesional = form.rol === "profesional" || form.rol === "medico";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    setLoading(true);
    const payload: Record<string, string> = {
      ...form,
      avatarUrl: isMedico ? (form.fotoMedico?.trim() || "") : "",
      descripcionProfesional: isMedico ? (form.descripcionProfesional?.trim() || "") : "",
    };
    const result = await register(payload);
    if (result.success) {
      // Auto-login after registration
      const loginResult = await login(form.email, form.password);
      setLoading(false);
      if (loginResult.success) {
        router.push("/dashboard");
      } else {
        router.push("/login");
      }
    } else {
      setLoading(false);
      setError(result.error || "Error al registrarse");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e3a8a] to-[#0c4a6e] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-lg">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3">
            <img src="/logo-issi.png" alt="ISSI" className="w-14 h-14 rounded-full" />
            <span className="text-2xl font-bold text-white">
              ISSI
            </span>
          </Link>
        </div>

        {/* Card */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
          <h1 className="text-2xl font-bold text-white mb-2">Crear Cuenta</h1>
          <p className="text-gray-400 mb-6">Regístrate en ISSI</p>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-red-400 text-xl">error</span>
              <span className="text-red-300 text-sm">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Nombre y Apellido */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Nombre</label>
                <input
                  type="text"
                  value={form.nombre}
                  onChange={(e) => update("nombre", e.target.value)}
                  placeholder="Juan"
                  required
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#0f2847]/50 transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Apellido</label>
                <input
                  type="text"
                  value={form.apellido}
                  onChange={(e) => update("apellido", e.target.value)}
                  placeholder="Pérez"
                  required
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#0f2847]/50 transition"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Correo Electrónico</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-xl">mail</span>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                  placeholder="correo@ejemplo.com"
                  required
                  className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#0f2847]/50 transition"
                />
              </div>
            </div>

            {/* Documento */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Tipo Doc.</label>
                <select
                  value={form.tipoDocumento}
                  onChange={(e) => update("tipoDocumento", e.target.value)}
                  className="w-full px-3 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#0f2847]/50 transition"
                >
                  <option value="CC" className="bg-[white]">C.C.</option>
                  <option value="TI" className="bg-[white]">T.I.</option>
                  <option value="CE" className="bg-[white]">C.E.</option>
                  <option value="PP" className="bg-[white]">Pasaporte</option>
                </select>
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-1">Número de Documento</label>
                <input
                  type="text"
                  value={form.documento}
                  onChange={(e) => update("documento", e.target.value)}
                  placeholder="1234567890"
                  required
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#0f2847]/50 transition"
                />
              </div>
            </div>

            {/* Rol */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Tipo de Usuario</label>
              <select
                value={form.rol}
                onChange={(e) => update("rol", e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#0f2847]/50 transition"
              >
                <option value="paciente" className="bg-slate-800">Paciente</option>
                <option value="estudiante" className="bg-slate-800">Estudiante</option>
                <option value="profesional" className="bg-slate-800">Profesional / Tutor</option>
                <option value="medico" className="bg-slate-800">Médico</option>
              </select>
            </div>

            {/* Campos extra para profesional/tutor */}
            {isProfesional && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Especialidad</label>
                  <input
                    type="text"
                    value={form.descripcionProfesional}
                    onChange={(e) => update("descripcionProfesional", e.target.value)}
                    placeholder="Ej: Enfermería, Medicina de Emergencias, Farmacología..."
                    required
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#0f2847]/50 transition"
                  />
                  <p className="text-xs text-gray-500 mt-1">Los estudiantes verán tu especialidad al asignarte una tutoría.</p>
                </div>
              </>
            )}

            {/* Solo para médicos: foto y descripción profesional */}
            {isMedico && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">URL de tu foto de perfil (opcional)</label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-xl">image</span>
                    <input
                      type="url"
                      value={form.fotoMedico}
                      onChange={(e) => update("fotoMedico", e.target.value)}
                      placeholder="https://ejemplo.com/mi-foto.jpg"
                      className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#0f2847]/50 transition"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Los pacientes verán esta foto cuando agenden una cita contigo.</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Descripción profesional (opcional)</label>
                  <textarea
                    value={form.descripcionProfesional}
                    onChange={(e) => update("descripcionProfesional", e.target.value)}
                    placeholder="Ej: Médico general con 10 años de experiencia, especial interés en prevención y medicina familiar..."
                    rows={3}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#0f2847]/50 transition resize-none"
                  />
                  <p className="text-xs text-gray-500 mt-1">Esta información genera confianza en los pacientes.</p>
                </div>
              </>
            )}

            {/* Teléfono */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">WhatsApp / Teléfono</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-xl">phone</span>
                <input
                  type="tel"
                  value={form.telefono}
                  onChange={(e) => update("telefono", e.target.value)}
                  placeholder="3001234567"
                  className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#0f2847]/50 transition"
                />
              </div>
            </div>

            {/* Contraseñas */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Contraseña</label>
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) => update("password", e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#0f2847]/50 transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Confirmar</label>
                <input
                  type="password"
                  value={form.confirmPassword}
                  onChange={(e) => update("confirmPassword", e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#0f2847]/50 transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#0f2847] hover:bg-[#2563eb] text-white font-bold rounded-xl transition disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Creando cuenta...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-xl">person_add</span>
                  Crear Cuenta
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm">
              ¿Ya tienes cuenta?{" "}
              <Link href="/login" className="text-sky-200 hover:text-white hover:underline font-medium transition-colors">
                Inicia sesión
              </Link>
            </p>
          </div>
        </div>

        <p className="text-center text-gray-500 text-xs mt-6">
          © 2026 ISSI<br />
          <span className="text-gray-400">Powered by <span className="font-semibold text-sky-200">AINovaX</span></span>
        </p>
      </div>
    </div>
  );
}
