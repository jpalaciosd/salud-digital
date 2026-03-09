"use client";

import { useAuth } from "@/lib/AuthContext";
import Link from "next/link";
import { useState } from "react";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: "dashboard" },
  { href: "/cursos", label: "Cursos", icon: "school" },
  { href: "/monitoreo", label: "Monitoreo", icon: "monitor_heart" },
  { href: "/prescribir", label: "Prescripción", icon: "medication" },
  { href: "/estudiante", label: "Estudiante", icon: "person" },
  { href: "/servicios", label: "Servicios", icon: "medical_services" },
];

export default function UserNav() {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  if (!user) return null;

  const initials = `${user.nombre?.[0] || ""}${user.apellido?.[0] || ""}`.toUpperCase();

  return (
    <nav className="bg-[#102216] border-b border-white/10 px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#13ec5b] rounded-lg flex items-center justify-center">
              <span className="material-icons-outlined text-[#102216] text-xl">favorite</span>
            </div>
            <span className="text-lg font-bold text-white">
              Salud<span className="text-[#13ec5b]">Digital</span>
            </span>
          </Link>
          <div className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/5 transition"
          >
            <div className="w-9 h-9 bg-[#13ec5b]/20 rounded-full flex items-center justify-center text-[#13ec5b] font-bold text-sm">
              {initials}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-sm font-medium text-white">{user.nombre} {user.apellido}</p>
              <p className="text-xs text-gray-400 capitalize">{user.rol}</p>
            </div>
            <span className="material-icons-outlined text-gray-400 text-xl">expand_more</span>
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-[#1a2e21] border border-white/10 rounded-xl shadow-xl z-50 py-2">
              <div className="px-4 py-2 border-b border-white/10">
                <p className="text-sm text-white font-medium">{user.email}</p>
              </div>
              <button
                onClick={() => { setMenuOpen(false); logout(); }}
                className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-white/5 flex items-center gap-2"
              >
                <span className="material-icons-outlined text-lg">logout</span>
                Cerrar Sesión
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
