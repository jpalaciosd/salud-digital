import { NextRequest, NextResponse } from "next/server";
import { SignJWT } from "jose";
import { put } from "@vercel/blob";
import { ADMIN_EMAILS } from "@/lib/admin-emails";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "salud-digital-secret-key-2026-change-in-prod"
);

interface GoogleTokenPayload {
  email: string;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  sub: string;
}

async function verifyGoogleToken(credential: string): Promise<GoogleTokenPayload | null> {
  try {
    // Decode the JWT from Google (we verify via Google's tokeninfo endpoint)
    const res = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${credential}`);
    if (!res.ok) return null;
    const data = await res.json();
    if (!data.email) return null;
    return data as GoogleTokenPayload;
  } catch {
    return null;
  }
}

async function getOrCreateUser(google: GoogleTokenPayload) {
  const email = google.email.toLowerCase();
  
  // Try to fetch existing user
  try {
    const res = await fetch(
      `https://dXnVv4YLfDRDUKDn.public.blob.vercel-storage.com/users/${encodeURIComponent(email)}.json`,
      { cache: "no-store" }
    );
    if (res.ok) {
      const user = await res.json();
      return user;
    }
  } catch {}

  // Create new user
  const isAdmin = ADMIN_EMAILS.includes(email);
  const newUser = {
    id: crypto.randomUUID(),
    email,
    nombre: google.given_name || google.name?.split(" ")[0] || "Usuario",
    apellido: google.family_name || google.name?.split(" ").slice(1).join(" ") || "",
    documento: "",
    tipoDocumento: "CC",
    rol: isAdmin ? "admin" : "estudiante",
    telefono: "",
    avatarUrl: google.picture || "",
    descripcionProfesional: "",
    passwordHash: "", // No password for Google users
    googleSub: google.sub,
    createdAt: new Date().toISOString(),
  };

  await put(`users/${email}.json`, JSON.stringify(newUser), {
    access: "public",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json",
  });

  return newUser;
}

export async function POST(req: NextRequest) {
  try {
    const { credential } = await req.json();
    if (!credential) {
      return NextResponse.json({ error: "Token de Google requerido" }, { status: 400 });
    }

    const googleUser = await verifyGoogleToken(credential);
    if (!googleUser) {
      return NextResponse.json({ error: "Token de Google inválido" }, { status: 401 });
    }

    const user = await getOrCreateUser(googleUser);
    
    // Check if existing user should be upgraded to admin
    const isAdmin = ADMIN_EMAILS.includes(user.email.toLowerCase());
    if (isAdmin && user.rol !== "admin") {
      user.rol = "admin";
      await put(`users/${user.email}.json`, JSON.stringify(user), {
        access: "public",
        addRandomSuffix: false,
        allowOverwrite: true,
        contentType: "application/json",
      });
    }

    const token = await new SignJWT({
      userId: user.id,
      email: user.email,
      nombre: user.nombre,
      apellido: user.apellido,
      rol: user.rol,
      avatarUrl: user.avatarUrl || "",
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("7d")
      .sign(JWT_SECRET);

    const response = NextResponse.json({ user: { ...user, passwordHash: undefined } });
    response.cookies.set("auth-token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return response;
  } catch (err) {
    console.error("Google auth error:", err);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
