import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/lib/AuthContext";

export const metadata: Metadata = {
  title: "SaludDigital | Salud Humana Potenciada por Tecnología",
  description: "IPS Virtual - Transformamos la atención médica en Colombia a través de un modelo híbrido que prioriza la empatía humana y la precisión digital.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons+Outlined" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0" rel="stylesheet" />
      </head>
      <body className="font-display antialiased bg-[#f6f8f6] text-[#1a2e21]">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
