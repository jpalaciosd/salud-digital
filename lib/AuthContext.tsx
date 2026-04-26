"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";

interface AuthUser {
  userId: string;
  email: string;
  nombre: string;
  apellido: string;
  rol: string;
  telefono?: string;
  documento?: string;
  tipoDocumento?: string;
  avatarUrl?: string;
  descripcionProfesional?: string;
  especialidad?: string;
}

interface AuthCtx {
  user: AuthUser | null;
  token?: string;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  loginWithGoogle: (credential: string) => Promise<{ success: boolean; error?: string }>;
  register: (data: Record<string, string>) => Promise<{ success: boolean; error?: string }>;
  refreshUser: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthCtx>({
  user: null,
  loading: true,
  login: async () => ({ success: false }),
  loginWithGoogle: async () => ({ success: false }),
  register: async () => ({ success: false }),
  refreshUser: async () => {},
  logout: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchUser = async () => {
    const res = await fetch("/api/auth/me", { credentials: "same-origin" });
    if (!res.ok) return null;
    const data = await res.json();
    return data?.user ?? null;
  };

  useEffect(() => {
    fetchUser()
      .then((u) => {
        if (u) setUser(u);
      })
      .finally(() => setLoading(false));
  }, []);

  const refreshUser = async () => {
    const u = await fetchUser();
    if (u) setUser(u);
  };

  const login = async (email: string, password: string) => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "same-origin",
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (res.ok && data.user) {
      const u = data.user;
      setUser({
        userId: u.id || u.userId,
        email: u.email,
        nombre: u.nombre,
        apellido: u.apellido,
        rol: u.rol,
      });
      return { success: true };
    }
    return { success: false, error: data.error || "Error al iniciar sesión" };
  };

  const loginWithGoogle = async (credential: string) => {
    const res = await fetch("/api/auth/google", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "same-origin",
      body: JSON.stringify({ credential }),
    });
    const data = await res.json();
    if (res.ok && data.user) {
      const u = data.user;
      setUser({
        userId: u.id || u.userId,
        email: u.email,
        nombre: u.nombre,
        apellido: u.apellido,
        rol: u.rol,
      });
      return { success: true };
    }
    return { success: false, error: data.error || "Error con Google" };
  };

  const register = async (formData: Record<string, string>) => {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    const data = await res.json();
    if (res.ok) return { success: true };
    return { success: false, error: data.error || "Error al registrarse" };
  };

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, loginWithGoogle, register, refreshUser, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
