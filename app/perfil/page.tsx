"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import UserNav from "@/lib/UserNav";
import { useAuth } from "@/lib/AuthContext";

const TIPO_DOC_OPTIONS = [
  { value: "CC", label: "C.C." },
  { value: "TI", label: "T.I." },
  { value: "CE", label: "C.E." },
  { value: "PP", label: "Pasaporte" },
];

export default function PerfilPage() {
  const { user, loading, refreshUser } = useAuth();
  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    documento: "",
    tipoDocumento: "CC",
    telefono: "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [okMsg, setOkMsg] = useState("");

  useEffect(() => {
    if (user) {
      setForm({
        nombre: user.nombre || "",
        apellido: user.apellido || "",
        documento: user.documento || "",
        tipoDocumento: user.tipoDocumento || "CC",
        telefono: user.telefono || "",
      });
    }
  }, [user]);

  const update = (field: keyof typeof form, value: string) =>
    setForm((f) => ({ ...f, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setOkMsg("");
    setSaving(true);

    const res = await fetch("/api/auth/me", {
      method: "PATCH",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json().catch(() => ({}));
    setSaving(false);

    if (!res.ok) {
      setError(data?.error || "No se pudo guardar el perfil");
      return;
    }

    await refreshUser();
    setOkMsg("Perfil actualizado correctamente.");
  };

  const phoneInvalid = !/^3\d{9}$/.test((user?.telefono || "").replace(/\D/g, ""));

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e3a8a] to-[#0c4a6e] flex items-center justify-center text-white">
        Cargando...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e3a8a] to-[#0c4a6e] flex items-center justify-center text-white p-6">
        <div className="text-center">
          <p className="mb-4">Necesitas iniciar sesión para ver tu perfil.</p>
          <Link href="/login" className="px-4 py-2 bg-[#2563eb] rounded-lg">
            Ir a iniciar sesión
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e3a8a] to-[#0c4a6e]">
      <UserNav />
      <div className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-white mb-2">Mi Perfil</h1>
        <p className="text-gray-400 mb-6">
          Actualiza tus datos. <strong>El número de WhatsApp</strong> es necesario para que
          Dr. Nova te reconozca.
        </p>

        {phoneInvalid && (
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4 mb-4 flex items-start gap-2">
            <span className="material-symbols-outlined text-amber-300 text-xl">warning</span>
            <div className="text-amber-200 text-sm">
              Tu número de WhatsApp no está vinculado o no es un celular colombiano de 10 dígitos.
              Dr. Nova no podrá reconocerte hasta que lo agregues.
            </div>
          </div>
        )}

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 mb-4 text-red-300 text-sm">
              {error}
            </div>
          )}
          {okMsg && (
            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-3 mb-4 text-emerald-300 text-sm">
              {okMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Nombre</label>
                <input
                  type="text"
                  value={form.nombre}
                  onChange={(e) => update("nombre", e.target.value)}
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
                  required
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#0f2847]/50 transition"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Tipo Doc.</label>
                <select
                  value={form.tipoDocumento}
                  onChange={(e) => update("tipoDocumento", e.target.value)}
                  className="w-full px-3 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#0f2847]/50 transition"
                >
                  {TIPO_DOC_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value} className="bg-slate-800">
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Número de Documento
                </label>
                <input
                  type="text"
                  value={form.documento}
                  onChange={(e) => update("documento", e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#0f2847]/50 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Celular WhatsApp (10 dígitos, sin +57)
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-xl">
                  phone
                </span>
                <input
                  type="tel"
                  value={form.telefono}
                  onChange={(e) => update("telefono", e.target.value)}
                  placeholder="3001234567"
                  inputMode="numeric"
                  className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#0f2847]/50 transition"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Usa el mismo número con el que escribes a Dr. Nova por WhatsApp.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Correo</label>
              <input
                type="email"
                value={user.email}
                disabled
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-gray-500"
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full py-3 bg-[#0f2847] hover:bg-[#2563eb] text-white font-bold rounded-xl transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {saving ? "Guardando..." : "Guardar cambios"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
