"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { QRCodeCanvas } from "qrcode.react";
import UserNav from "@/lib/UserNav";
import { useAuth } from "@/lib/AuthContext";

interface Curso {
  id: string;
  titulo: string;
  precio: number;
  imagen: string;
  duracionHoras: number;
}

export default function EnlacesPagoPage() {
  const { user } = useAuth();
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [copied, setCopied] = useState<string | null>(null);
  const [baseUrl, setBaseUrl] = useState("");

  useEffect(() => {
    setBaseUrl(window.location.origin);
    fetch("/api/cursos")
      .then((r) => r.json())
      .then((d) => setCursos(d.cursos || []));
  }, []);

  if (!user || user.rol !== "admin") {
    return (
      <div className="min-h-screen bg-[#fafaf7]">
        <UserNav />
        <div className="max-w-xl mx-auto p-10 text-center">
          <h1 className="text-2xl font-bold text-red-700">Acceso restringido</h1>
          <p className="text-slate-500 mt-3">Solo administradores pueden ver esta página.</p>
          <Link href="/dashboard" className="inline-block mt-6 px-6 py-2 rounded-lg bg-[#0f2847] text-white">
            Volver al Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const copiar = async (url: string, id: string) => {
    await navigator.clipboard.writeText(url);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const compartirWhatsApp = (curso: Curso, url: string) => {
    const mensaje = `Hola! 👋\n\nInscríbete al curso *${curso.titulo}* en ISSI.\n\n💰 Valor: $${curso.precio.toLocaleString("es-CO")} COP\n⏱️ ${curso.duracionHoras} horas\n\n👉 Paga aquí: ${url}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(mensaje)}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-[#fafaf7]">
      <UserNav />

      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-extrabold text-[#0f2847]">Enlaces de pago</h1>
            <p className="text-sm text-slate-500 mt-1">
              Comparte el link o QR de cualquier curso para que paguen directo.
            </p>
          </div>
          <Link href="/admin" className="text-sm text-slate-500 hover:text-[#0f2847]">
            ← Admin
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {cursos.map((curso) => {
            const url = baseUrl ? `${baseUrl}/pagar/${curso.id}` : "";
            return (
              <CursoQRCard
                key={curso.id}
                curso={curso}
                url={url}
                copied={copied === curso.id}
                onCopy={() => copiar(url, curso.id)}
                onWhatsApp={() => compartirWhatsApp(curso, url)}
              />
            );
          })}
        </div>

        {cursos.length === 0 && (
          <div className="bg-white rounded-xl p-10 text-center text-slate-500 border border-slate-100">
            Cargando cursos...
          </div>
        )}
      </div>
    </div>
  );
}

function CursoQRCard({
  curso,
  url,
  copied,
  onCopy,
  onWhatsApp,
}: {
  curso: Curso;
  url: string;
  copied: boolean;
  onCopy: () => void;
  onWhatsApp: () => void;
}) {
  const ref = useRef<HTMLCanvasElement>(null);

  const descargar = () => {
    const canvas = ref.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = `qr-${curso.id}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="p-4 border-b border-slate-100 flex items-center gap-3">
        <span className="text-3xl">{curso.imagen}</span>
        <div className="flex-1">
          <h3 className="font-bold text-[#0f2847] text-sm leading-tight">{curso.titulo}</h3>
          <p className="text-xs text-[#c5a044] font-bold mt-1">
            ${curso.precio.toLocaleString("es-CO")} · {curso.duracionHoras}h
          </p>
        </div>
      </div>

      <div className="p-5 flex flex-col items-center gap-4">
        <div className="bg-white p-3 rounded-lg border border-slate-200">
          <QRCodeCanvas
            ref={ref}
            value={url || "https://salud-digital-iota.vercel.app"}
            size={180}
            level="M"
            bgColor="#ffffff"
            fgColor="#0f2847"
          />
        </div>

        <div className="w-full space-y-2">
          <div className="flex gap-2">
            <input
              readOnly
              value={url}
              className="flex-1 px-2 py-1 text-xs bg-slate-50 border border-slate-200 rounded text-slate-600 font-mono truncate"
            />
            <button
              onClick={onCopy}
              className={`px-3 py-1 rounded text-xs font-semibold ${
                copied ? "bg-green-600 text-white" : "bg-[#0f2847] text-white"
              }`}
            >
              {copied ? "✓" : "Copiar"}
            </button>
          </div>

          <div className="flex gap-2">
            <button
              onClick={descargar}
              className="flex-1 py-2 rounded-lg bg-slate-100 text-slate-700 font-semibold text-xs hover:bg-slate-200"
            >
              ⬇️ QR
            </button>
            <button
              onClick={onWhatsApp}
              className="flex-1 py-2 rounded-lg bg-green-600 text-white font-semibold text-xs hover:bg-green-700"
            >
              💬 WhatsApp
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
