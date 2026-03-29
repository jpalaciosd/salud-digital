"use client";

import { useAuth } from "@/lib/AuthContext";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const NAV_ITEMS = [
  { href: "/", label: "Inicio", icon: "home" },
  { href: "/cursos", label: "Cursos", icon: "school" },
  { href: "/dashboard", label: "Mi Portal", icon: "dashboard" },
];

export default function UserNav() {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  if (!user) return null;

  const initials = `${user.nombre?.[0] || ""}${user.apellido?.[0] || ""}`.toUpperCase();

  return (
    <nav className="bg-[#0f2847] border-b border-white/10 px-4 py-3 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <img src="/logo-issi.png" alt="ISSI" className="w-9 h-9 rounded-full" />
            <span className="text-lg font-bold text-white tracking-tight uppercase">
              ISSI
            </span>
          </Link>
          <div className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-2 text-sm rounded-lg transition ${
                  pathname === item.href
                    ? "text-[#c5a044] bg-white/10 font-semibold"
                    : "text-gray-300 hover:text-white hover:bg-white/5"
                }`}
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
            <div className="w-9 h-9 bg-[#c5a044]/20 rounded-full flex items-center justify-center text-[#c5a044] font-bold text-sm">
              {initials}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-sm font-medium text-white">{user.nombre} {user.apellido}</p>
              <p className="text-xs text-gray-400 capitalize">{user.rol}</p>
            </div>
            <span className="material-icons-outlined text-gray-400 text-xl">expand_more</span>
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-[#1e293b] border border-white/10 rounded-xl shadow-xl z-50 py-2">
              <div className="px-4 py-2 border-b border-white/10">
                <p className="text-sm text-white font-medium truncate">{user.email}</p>
              </div>
              <Link
                href="/dashboard"
                onClick={() => setMenuOpen(false)}
                className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-white/5 flex items-center gap-2"
              >
                <span className="material-icons-outlined text-lg">person</span>
                Mi Portal
              </Link>
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

        {/* Mobile hamburger */}
        <div className="md:hidden flex items-center gap-2">
          <button onClick={() => setMenuOpen(!menuOpen)} className="text-white p-2">
            <span className="material-icons-outlined">menu</span>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden mt-2 pb-2 border-t border-white/10 pt-2">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              className={`block px-4 py-2 text-sm rounded-lg ${
                pathname === item.href ? "text-[#c5a044] font-semibold" : "text-gray-300"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
