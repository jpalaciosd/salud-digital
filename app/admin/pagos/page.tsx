"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import UserNav from "@/lib/UserNav";
import { useAuth } from "@/lib/AuthContext";
import type { Pago, EstadoPago } from "@/lib/types";

const ESTADOS: { value: EstadoPago; label: string }[] = [
  { value: "revision_manual", label: "En revisión" },
  { value: "aprobado_auto", label: "Aprobados auto" },
  { value: "aprobado_manual", label: "Aprobados manual" },
  { value: "rechazado", label: "Rechazados" },
  { value: "canjeado", label: "Canjeados" },
];

export default function AdminPagosPage() {
  const { user } = useAuth();
  const [pagos, setPagos] = useState<Pago[]>([]);
  const [estado, setEstado] = useState<EstadoPago>("revision_manual");
  const [loading, setLoading] = useState(true);
  const [procesando, setProcesando] = useState<string | null>(null);
  const [modalRechazo, setModalRechazo] = useState<{ id: string; motivo: string } | null>(null);
  const [error, setError] = useState("");
  const [imagenAmpliada, setImagenAmpliada] = useState<string | null>(null);

  const cargar = async (e: EstadoPago) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/admin/pagos?estado=${e}`);
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Error al cargar");
        setPagos([]);
      } else {
        setPagos(data.pagos || []);
      }
    } catch {
      setError("Error de conexión");
    }
    setLoading(false);
  };

  useEffect(() => {
    cargar(estado);
  }, [estado]);

  const aprobar = async (pagoId: string) => {
    setProcesando(pagoId);
    try {
      const res = await fetch(`/api/admin/pagos/${pagoId}/decidir`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ decision: "aprobar" }),
      });
      if (res.ok) {
        setPagos((prev) => prev.filter((p) => p.id !== pagoId));
      } else {
        const d = await res.json();
        setError(d.error || "Error al aprobar");
      }
    } finally {
      setProcesando(null);
    }
  };

  const rechazar = async () => {
    if (!modalRechazo) return;
    setProcesando(modalRechazo.id);
    try {
      const res = await fetch(`/api/admin/pagos/${modalRechazo.id}/decidir`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ decision: "rechazar", motivo: modalRechazo.motivo }),
      });
      if (res.ok) {
        setPagos((prev) => prev.filter((p) => p.id !== modalRechazo.id));
        setModalRechazo(null);
      } else {
        const d = await res.json();
        setError(d.error || "Error al rechazar");
      }
    } finally {
      setProcesando(null);
    }
  };

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

  return (
    <div className="min-h-screen bg-[#fafaf7]">
      <UserNav />

      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-extrabold text-[#0f2847]">Pagos — Admin</h1>
          <Link href="/admin" className="text-sm text-slate-500 hover:text-[#0f2847]">
            ← Admin
          </Link>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {ESTADOS.map((e) => (
            <button
              key={e.value}
              onClick={() => setEstado(e.value)}
              className={`px-4 py-2 rounded-full text-sm font-semibold ${
                estado === e.value
                  ? "bg-[#0f2847] text-white"
                  : "bg-white text-slate-600 border border-slate-200"
              }`}
            >
              {e.label}
            </button>
          ))}
        </div>

        {error && <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg mb-4">{error}</p>}

        {loading ? (
          <p className="text-center text-slate-500 py-10">Cargando...</p>
        ) : pagos.length === 0 ? (
          <div className="bg-white rounded-xl p-10 text-center text-slate-500 border border-slate-100">
            No hay pagos en este estado.
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {pagos.map((p) => (
              <div key={p.id} className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
                <button onClick={() => setImagenAmpliada(p.imagenUrl)} className="block w-full">
                  <img
                    src={p.imagenUrl}
                    alt="Comprobante"
                    className="w-full h-48 object-cover hover:opacity-80 transition"
                  />
                </button>
                <div className="p-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="font-bold text-[#0f2847]">{p.cursoTitulo}</span>
                    <span className="text-sm font-bold text-[#c5a044]">
                      ${p.montoEsperado.toLocaleString("es-CO")}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600">
                    {p.userNombre} <span className="text-slate-400">· {p.userEmail}</span>
                  </p>
                  {p.iaData && (
                    <div className="text-xs bg-slate-50 rounded p-2 space-y-1">
                      <p>
                        <span className="font-semibold">Confianza IA:</span>{" "}
                        {(p.iaData.confianza * 100).toFixed(0)}%
                      </p>
                      {p.iaData.monto !== undefined && (
                        <p>
                          <span className="font-semibold">Monto detectado:</span>{" "}
                          ${p.iaData.monto.toLocaleString("es-CO")}
                        </p>
                      )}
                      {p.iaData.titular && (
                        <p>
                          <span className="font-semibold">Titular:</span> {p.iaData.titular}
                        </p>
                      )}
                      {p.iaData.last4 && (
                        <p>
                          <span className="font-semibold">Last4:</span> {p.iaData.last4}
                        </p>
                      )}
                      {p.iaData.fecha && (
                        <p>
                          <span className="font-semibold">Fecha:</span> {p.iaData.fecha}
                        </p>
                      )}
                      {p.iaData.referencia && (
                        <p>
                          <span className="font-semibold">Ref:</span> {p.iaData.referencia}
                        </p>
                      )}
                    </div>
                  )}
                  {p.motivoRechazo && (
                    <p className="text-xs text-amber-700 bg-amber-50 rounded p-2">
                      ⚠️ {p.motivoRechazo}
                    </p>
                  )}
                  {p.codigoCanje && (
                    <p className="text-xs font-mono bg-green-50 text-green-800 rounded p-2">
                      Código: {p.codigoCanje}
                    </p>
                  )}
                  {estado === "revision_manual" && (
                    <div className="flex gap-2 pt-2">
                      <button
                        onClick={() => aprobar(p.id)}
                        disabled={procesando === p.id}
                        className="flex-1 py-2 rounded-lg bg-green-600 text-white font-semibold text-sm hover:bg-green-700 disabled:opacity-50"
                      >
                        Aprobar
                      </button>
                      <button
                        onClick={() => setModalRechazo({ id: p.id, motivo: "" })}
                        disabled={procesando === p.id}
                        className="flex-1 py-2 rounded-lg bg-red-600 text-white font-semibold text-sm hover:bg-red-700 disabled:opacity-50"
                      >
                        Rechazar
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {imagenAmpliada && (
        <div
          onClick={() => setImagenAmpliada(null)}
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-6 cursor-pointer"
        >
          <img src={imagenAmpliada} alt="Comprobante" className="max-w-full max-h-full rounded-lg" />
        </div>
      )}

      {modalRechazo && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-6">
          <div className="bg-white rounded-xl p-6 max-w-md w-full space-y-4">
            <h3 className="text-lg font-bold text-[#0f2847]">Rechazar pago</h3>
            <textarea
              value={modalRechazo.motivo}
              onChange={(e) => setModalRechazo({ ...modalRechazo, motivo: e.target.value })}
              placeholder="Motivo del rechazo (visible para el usuario)"
              className="w-full border border-slate-300 rounded-lg p-3 text-sm"
              rows={4}
            />
            <div className="flex gap-2">
              <button
                onClick={() => setModalRechazo(null)}
                className="flex-1 py-2 rounded-lg border border-slate-300 text-slate-600 font-semibold"
              >
                Cancelar
              </button>
              <button
                onClick={rechazar}
                disabled={!modalRechazo.motivo.trim() || procesando === modalRechazo.id}
                className="flex-1 py-2 rounded-lg bg-red-600 text-white font-semibold disabled:opacity-50"
              >
                Rechazar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
