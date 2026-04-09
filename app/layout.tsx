import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/lib/AuthContext";

export const metadata: Metadata = {
  title: "ISSI | Instituto Superior de Salud Integral",
  description: "Plataforma educativa virtual con tutor IA para profesionales de la salud. 12 cursos certificados en SST, RCP, Farmacología, Vigilancia Epidemiológica y más.",
  openGraph: {
    title: "ISSI | Instituto Superior de Salud Integral",
    description: "Plataforma educativa virtual con 12 cursos certificados en salud. Diplomados en SST, Auditoría, Sistema Integrado de Gestión y más.",
    url: "https://salud-digital-iota.vercel.app",
    siteName: "ISSI",
    images: [
      {
        url: "https://salud-digital-iota.vercel.app/og-image.png",
        width: 1200,
        height: 630,
        alt: "ISSI - Instituto Superior de Salud Integral",
      },
    ],
    locale: "es_CO",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ISSI | Instituto Superior de Salud Integral",
    description: "12 cursos certificados en salud. Diplomados en SST, Auditoría y más.",
    images: ["https://salud-digital-iota.vercel.app/og-image.png"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons+Outlined" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0" rel="stylesheet" />
      </head>
      <body className="font-display antialiased bg-[#f1f5f9] text-[#1e293b]">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
