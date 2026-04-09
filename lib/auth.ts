import { list, put, del } from "@vercel/blob";
import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "salud-digital-secret-key-2026-change-in-prod"
);

export interface User {
  id: string;
  email: string;
  nombre: string;
  apellido: string;
  documento: string;
  tipoDocumento: string;
  rol: "paciente" | "medico" | "estudiante" | "profesional" | "admin";
  telefono?: string;
  /** URL de la foto de perfil (principalmente para médicos). */
  avatarUrl?: string;
  /** Descripción profesional / bio (solo médicos). */
  descripcionProfesional?: string;
  especialidad?: string;
  createdAt: string;
}

interface StoredUser extends User {
  passwordHash: string;
}

// ── User Storage (Vercel Blob) ──────────────────────────────────────

async function getUserByEmail(email: string): Promise<StoredUser | null> {
  try {
    const res = await fetch(
      `https://dXnVv4YLfDRDUKDn.public.blob.vercel-storage.com/users/${encodeURIComponent(email)}.json`,
      { cache: "no-store" }
    );
    if (!res.ok) return null;
    return (await res.json()) as StoredUser;
  } catch {
    return null;
  }
}

async function saveUser(user: StoredUser): Promise<void> {
  await put(`users/${user.email}.json`, JSON.stringify(user), {
    access: "public",
    addRandomSuffix: false,
    contentType: "application/json",
  });
}

export async function getAllUsers(): Promise<User[]> {
  const { blobs } = await list({ prefix: "users/" });
  const users: User[] = [];
  for (const blob of blobs) {
    try {
      const res = await fetch(blob.url, { cache: "no-store" });
      if (res.ok) {
        const stored = (await res.json()) as StoredUser;
        const { passwordHash, ...user } = stored;
        users.push(user);
      }
    } catch {}
  }
  return users;
}

// ── Registration ────────────────────────────────────────────────────

export async function registerUser(data: {
  email: string;
  password: string;
  nombre: string;
  apellido: string;
  documento: string;
  tipoDocumento: string;
  rol: "paciente" | "medico" | "estudiante" | "profesional" | "admin";
  telefono?: string;
  avatarUrl?: string;
  descripcionProfesional?: string;
}): Promise<{ success: boolean; error?: string; user?: User }> {
  const existing = await getUserByEmail(data.email);
  if (existing) {
    return { success: false, error: "El correo ya está registrado" };
  }

  const passwordHash = await bcrypt.hash(data.password, 10);
  const id = crypto.randomUUID();

  const storedUser: StoredUser = {
    id,
    email: data.email,
    nombre: data.nombre,
    apellido: data.apellido,
    documento: data.documento,
    tipoDocumento: data.tipoDocumento,
    rol: data.rol,
    telefono: data.telefono,
    avatarUrl: data.avatarUrl,
    descripcionProfesional: data.descripcionProfesional,
    passwordHash,
    createdAt: new Date().toISOString(),
  };

  await saveUser(storedUser);

  const { passwordHash: _, ...user } = storedUser;
  return { success: true, user };
}

// ── Login ───────────────────────────────────────────────────────────

export async function loginUser(
  email: string,
  password: string
): Promise<{ success: boolean; error?: string; token?: string; user?: User }> {
  const stored = await getUserByEmail(email);
  if (!stored) {
    return { success: false, error: "Credenciales inválidas" };
  }

  const valid = await bcrypt.compare(password, stored.passwordHash);
  if (!valid) {
    return { success: false, error: "Credenciales inválidas" };
  }

  const { passwordHash, ...user } = stored;

  const token = await new SignJWT({
    userId: user.id,
    email: user.email,
    nombre: user.nombre,
    apellido: user.apellido,
    rol: user.rol,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(JWT_SECRET);

  return { success: true, token, user };
}

// ── JWT Verification ────────────────────────────────────────────────

export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as {
      userId: string;
      email: string;
      nombre: string;
      apellido: string;
      rol: string;
    };
  } catch {
    return null;
  }
}

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth-token")?.value;
  if (!token) return null;
  return verifyToken(token);
}
