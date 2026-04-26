"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";

const HIDE_ON_PATHS = ["/perfil", "/login", "/registro"];

export default function PhoneGateBanner() {
  const { user, loading } = useAuth();
  const pathname = usePathname();

  if (loading || !user) return null;
  if (HIDE_ON_PATHS.includes(pathname)) return null;

  const phoneDigits = (user.telefono || "").replace(/\D/g, "");
  const phoneOk = /^3\d{9}$/.test(phoneDigits);
  if (phoneOk) return null;

  return (
    <div className="bg-amber-500/15 border-b border-amber-500/30 text-amber-100 px-4 py-2 text-sm flex items-center justify-center gap-3 sticky top-0 z-50">
      <span className="material-symbols-outlined text-amber-300 text-base">warning</span>
      <span>
        Tu WhatsApp no está vinculado. Dr. Nova no podrá reconocerte hasta que lo completes.
      </span>
      <Link
        href="/perfil"
        className="px-3 py-1 bg-amber-500/30 hover:bg-amber-500/50 rounded-md font-semibold whitespace-nowrap transition"
      >
        Completar perfil
      </Link>
    </div>
  );
}
