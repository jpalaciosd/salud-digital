"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import UserNav from "@/lib/UserNav";
import { useAuth } from "@/lib/AuthContext";

interface CursoPago {
  id: string;
  titulo: string;
  descripcion: string;
  precio: number;
  imagen: string;
  duracionHoras: number;
}

interface NequiInfo {
  numero: string;
  last4: string;
  titular: string;
}

type Paso = "instrucciones" | "upload" | "validando" | "resultado";

interface ResultadoPago {
  pagoId: string;
  estado: string;
  codigoCanje: string | null;
  motivoRechazo?: string;
  iaData?: { confianza: number; monto?: number };
}

const MAX_SIZE = 2 * 1024 * 1024;

interface PromoState {
  codigo: string;
  porcentaje: number;
  descripcion: string;
  descuentoCop: number;
  precioOriginal: number;
  precioFinal: number;
}

export default function PagarClient({ curso, nequi }: { curso: CursoPago; nequi: NequiInfo }) {
  const { user } = useAuth();
  const router = useRouter();
  const [paso, setPaso] = useState<Paso>("instrucciones");
  const [archivo, setArchivo] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [resultado, setResultado] = useState<ResultadoPago | null>(null);
  const [canjeando, setCanjeando] = useState(false);

  const [codigoInput, setCodigoInput] = useState("");
  const [validandoPromo, setValidandoPromo] = useState(false);
  const [promoError, setPromoError] = useState("");
  const [promo, setPromo] = useState<PromoState | null>(null);

  useEffect(() => {
    if (!user && typeof window !== "undefined") {
      window.location.href = `/login?redirect=/pagar/${curso.id}`;
    }
  }, [user, curso.id]);

  if (!user) return null;

  const montoActual = promo ? promo.precioFinal : curso.precio;
  const montoFormateado = "Incluido";

  const copiarMonto = () => {
    navigator.clipboard.writeText(String(montoActual));
  };

  const aplicarCodigo = async () => {
    const codigo = codigoInput.trim().toUpperCase();
    if (!codigo) return;
    setPromoError("");
    setValidandoPromo(true);
    try {
      const res = await fetch("/api/promos/validar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ codigo, cursoId: curso.id }),
      });
      const data = await res.json();
      if (!res.ok || !data.valido) {
        setPromoError(data.motivo || data.error || "Código no válido");
        setPromo(null);
      } else {
        setPromo({
          codigo,
          porcentaje: data.porcentaje,
          descripcion: data.descripcion,
          descuentoCop: data.descuentoCop,
          precioOriginal: data.precioOriginal,
          precioFinal: data.precioFinal,
        });
      }
    } catch {
      setPromoError("Error de conexión");
    }
    setValidandoPromo(false);
  };

  const quitarPromo = () => {
    setPromo(null);
    setCodigoInput("");
    setPromoError("");
  };

  const seleccionarArchivo = (f: File | null) => {
    setError("");
    if (!f) {
      setArchivo(null);
      setPreview(null);
      return;
    }
    if (f.size > MAX_SIZE) {
      setError("La imagen no puede superar 2 MB");
      return;
    }
    if (!["image/jpeg", "image/png", "image/webp"].includes(f.type)) {
      setError("Formato no soportado. Usa JPG, PNG o WebP");
      return;
    }
    setArchivo(f);
    setPreview(URL.createObjectURL(f));
  };

  const subir = async () => {
    if (!archivo) return;
    setError("");
    setPaso("validando");
    try {
      const fd = new FormData();
      fd.append("file", archivo);
      fd.append("cursoId", curso.id);
      if (promo) fd.append("codigoPromo", promo.codigo);
      const res = await fetch("/api/pagos/subir", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Error al validar el pago");
        setPaso("upload");
        return;
      }
      setResultado(data);
      setPaso("resultado");
    } catch {
      setError("Error de conexión");
      setPaso("upload");
    }
  };

  const canjear = async () => {
    if (!resultado?.codigoCanje) return;
    setCanjeando(true);
    setError("");
    try {
      const res = await fetch("/api/pagos/canjear", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ codigoCanje: resultado.codigoCanje }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "No se pudo inscribir");
        setCanjeando(false);
        return;
      }
      router.push("/dashboard?tab=cursos");
    } catch {
      setError("Error de conexión");
      setCanjeando(false);
    }
  };

  const reset = () => {
    setArchivo(null);
    setPreview(null);
    setResultado(null);
    setError("");
    setPaso("instrucciones");
  };

  return (
    <div className="min-h-screen bg-[#fafaf7]">
      <UserNav />

      <div className="max-w-3xl mx-auto px-6 py-10">
        <Link href="/cursos" className="text-sm text-slate-500 hover:text-[#0f2847]">
          ← Volver a cursos
        </Link>

        <div className="mt-6 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex gap-4 items-start">
            <span className="text-5xl">{curso.imagen}</span>
            <div className="flex-1">
              <h1 className="text-2xl font-extrabold text-[#0f2847]">{curso.titulo}</h1>
              <p className="text-sm text-slate-500 mt-1">{curso.descripcion}</p>
              <div className="mt-3 flex gap-4 items-center">
                <span className="text-xl font-bold text-[#c5a044]">{montoFormateado}</span>
                <span className="text-xs text-slate-400">⏱️ {curso.duracionHoras} horas</span>
              </div>
            </div>
          </div>

          <div className="p-6">
            {paso === "instrucciones" && (
              <div className="space-y-5">
                <h2 className="text-lg font-bold text-[#0f2847]">Paso 1 — Paga con Bre-B / Nequi</h2>
                <div className="bg-gradient-to-br from-[#0f2847] to-[#1e3a8a] text-white rounded-xl p-5 space-y-3">
                  <div>
                    <p className="text-xs opacity-70 uppercase tracking-wide">Llave Bre-B (Nequi Negocios)</p>
                    <p className="text-2xl font-bold tracking-wider">{nequi.numero || `•••• ${nequi.last4 || "••••"}`}</p>
                  </div>
                  {nequi.titular && (
                    <div>
                      <p className="text-xs opacity-70 uppercase tracking-wide">Titular</p>
                      <p className="font-semibold">{nequi.titular}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-xs opacity-70 uppercase tracking-wide">Monto exacto</p>
                    {promo ? (
                      <div className="space-y-1">
                        <p className="text-sm line-through opacity-60">${promo.precioOriginal.toLocaleString("es-CO")}</p>
                        <div className="flex items-center gap-3">
                          <p className="text-3xl font-extrabold text-green-300">{montoFormateado}</p>
                          <button
                            onClick={copiarMonto}
                            className="px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold"
                          >
                            Copiar
                          </button>
                        </div>
                        <p className="text-xs text-green-300">
                          {promo.codigo} aplicado · ahorras ${promo.descuentoCop.toLocaleString("es-CO")} ({promo.porcentaje}%)
                        </p>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3">
                        <p className="text-3xl font-extrabold">{montoFormateado}</p>
                        <button
                          onClick={copiarMonto}
                          className="px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold"
                        >
                          Copiar
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Código promocional */}
                <div className="bg-white border border-slate-200 rounded-xl p-4">
                  <p className="text-sm font-semibold text-[#0f2847] mb-2">¿Tienes un código promocional?</p>
                  {promo ? (
                    <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg p-3">
                      <div>
                        <p className="text-sm font-bold text-green-800">✓ {promo.codigo}</p>
                        {promo.descripcion && <p className="text-xs text-green-700">{promo.descripcion}</p>}
                      </div>
                      <button onClick={quitarPromo} className="text-xs text-red-600 hover:underline font-semibold">
                        Quitar
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={codigoInput}
                          onChange={(e) => setCodigoInput(e.target.value.toUpperCase())}
                          placeholder="EJEMPLO20"
                          className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm uppercase tracking-wide font-mono"
                          maxLength={24}
                          onKeyDown={(e) => { if (e.key === "Enter") aplicarCodigo(); }}
                        />
                        <button
                          onClick={aplicarCodigo}
                          disabled={!codigoInput.trim() || validandoPromo}
                          className="px-4 py-2 rounded-lg bg-[#0f2847] text-white text-sm font-bold disabled:opacity-40"
                        >
                          {validandoPromo ? "..." : "Aplicar"}
                        </button>
                      </div>
                      {promoError && <p className="text-xs text-red-600 mt-2">{promoError}</p>}
                    </>
                  )}
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-900">
                  <p className="font-semibold mb-1">Instrucciones:</p>
                  <ol className="list-decimal list-inside space-y-1 text-amber-800">
                    <li>Abre tu app (Nequi, Bancolombia, Daviplata) y elige enviar a una llave Bre-B.</li>
                    <li>Pega la llave indicada arriba y envía el monto exacto.</li>
                    <li>Guarda el comprobante (captura de pantalla).</li>
                    <li>Vuelve aquí y súbelo para validar tu pago.</li>
                  </ol>
                </div>

                <button
                  onClick={() => setPaso("upload")}
                  className="w-full py-3 rounded-xl bg-[#0f2847] text-white font-bold hover:opacity-90"
                >
                  Ya pagué, subir comprobante →
                </button>
              </div>
            )}

            {paso === "upload" && (
              <div className="space-y-5">
                <h2 className="text-lg font-bold text-[#0f2847]">Paso 2 — Sube el comprobante</h2>

                <label className="block border-2 border-dashed border-slate-300 rounded-xl p-6 cursor-pointer hover:border-[#c5a044] transition">
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    onChange={(e) => seleccionarArchivo(e.target.files?.[0] || null)}
                  />
                  {preview ? (
                    <div className="space-y-3">
                      <img src={preview} alt="Comprobante" className="max-h-80 mx-auto rounded-lg" />
                      <p className="text-sm text-center text-slate-500">Haz clic para cambiar</p>
                    </div>
                  ) : (
                    <div className="text-center text-slate-500">
                      <p className="text-4xl mb-2">📤</p>
                      <p className="font-semibold">Haz clic para seleccionar</p>
                      <p className="text-xs mt-1">JPG, PNG o WebP — máx 2 MB</p>
                    </div>
                  )}
                </label>

                {error && <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">{error}</p>}

                <div className="flex gap-3">
                  <button
                    onClick={() => setPaso("instrucciones")}
                    className="flex-1 py-3 rounded-xl border border-slate-300 text-slate-600 font-bold hover:bg-slate-50"
                  >
                    Atrás
                  </button>
                  <button
                    onClick={subir}
                    disabled={!archivo}
                    className="flex-1 py-3 rounded-xl bg-[#0f2847] text-white font-bold hover:opacity-90 disabled:opacity-40"
                  >
                    Validar pago
                  </button>
                </div>
              </div>
            )}

            {paso === "validando" && (
              <div className="py-16 text-center space-y-4">
                <div className="text-5xl animate-pulse">🔍</div>
                <p className="text-lg font-bold text-[#0f2847]">Validando tu comprobante...</p>
                <p className="text-sm text-slate-500">Esto toma unos segundos. No cierres la ventana.</p>
              </div>
            )}

            {paso === "resultado" && resultado && (
              <div className="space-y-5">
                {resultado.estado === "aprobado_auto" && resultado.codigoCanje && (
                  <div className="space-y-5">
                    <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
                      <div className="text-5xl mb-3">✅</div>
                      <h2 className="text-xl font-extrabold text-green-800">¡Pago aprobado!</h2>
                      <p className="text-sm text-green-700 mt-2">Tu código de canje para el curso:</p>
                      <div className="mt-4 bg-white rounded-lg p-4 border-2 border-dashed border-green-400">
                        <p className="text-3xl font-black tracking-widest text-[#0f2847]">
                          {resultado.codigoCanje}
                        </p>
                      </div>
                      <p className="text-xs text-green-700 mt-3">
                        Guarda este código. Es específico para tu cuenta y este curso.
                      </p>
                    </div>

                    {error && <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">{error}</p>}

                    <button
                      onClick={canjear}
                      disabled={canjeando}
                      className="w-full py-4 rounded-xl bg-green-600 text-white font-bold text-lg hover:bg-green-700 disabled:opacity-50"
                    >
                      {canjeando ? "Inscribiendo..." : "Inscribirme ahora →"}
                    </button>
                  </div>
                )}

                {resultado.estado === "revision_manual" && (
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 text-center space-y-3">
                    <div className="text-5xl">⏳</div>
                    <h2 className="text-xl font-extrabold text-amber-800">Pago en revisión</h2>
                    <p className="text-sm text-amber-800">
                      Tu comprobante necesita revisión manual (hasta 24h). Te avisaremos cuando esté listo.
                    </p>
                    {resultado.motivoRechazo && (
                      <p className="text-xs text-amber-700 bg-white/50 rounded p-2">
                        Motivo: {resultado.motivoRechazo}
                      </p>
                    )}
                    <Link
                      href="/dashboard"
                      className="inline-block mt-2 px-6 py-2 rounded-lg bg-[#0f2847] text-white font-semibold"
                    >
                      Ir al Dashboard
                    </Link>
                  </div>
                )}

                {resultado.estado === "rechazado" && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center space-y-3">
                    <div className="text-5xl">❌</div>
                    <h2 className="text-xl font-extrabold text-red-800">Pago rechazado</h2>
                    {resultado.motivoRechazo && (
                      <p className="text-sm text-red-700">{resultado.motivoRechazo}</p>
                    )}
                    <button
                      onClick={reset}
                      className="mt-2 px-6 py-2 rounded-lg bg-[#0f2847] text-white font-semibold"
                    >
                      Intentar de nuevo
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
