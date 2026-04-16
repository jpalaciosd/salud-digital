import { getById, query } from "@/lib/db";
import type { CodigoPromo, UsoPromo } from "@/lib/types";

export interface ResultadoValidacion {
  valido: boolean;
  motivo?: string;
  promo?: CodigoPromo;
  descuentoCop?: number;
  precioFinal?: number;
}

export function usoPromoId(codigoId: string, userId: string): string {
  return `${codigoId}_${userId}`;
}

function ahora(): number {
  return Date.now();
}

export async function validarCodigoParaPago(
  codigoRaw: string,
  userId: string,
  precioBase: number
): Promise<ResultadoValidacion> {
  const codigoId = codigoRaw.trim().toUpperCase();
  if (!codigoId) return { valido: false, motivo: "Código vacío" };

  const promo = await getById<CodigoPromo>("promos", codigoId);
  if (!promo) return { valido: false, motivo: "Código no encontrado" };

  if (!promo.activo) return { valido: false, motivo: "Código desactivado" };

  const t = ahora();
  if (Date.parse(promo.validoDesde) > t) {
    return { valido: false, motivo: "Código aún no está vigente" };
  }
  if (promo.validoHasta && Date.parse(promo.validoHasta) < t) {
    return { valido: false, motivo: "Código expirado" };
  }

  if (promo.usosMaximos !== null && promo.usosActuales >= promo.usosMaximos) {
    return { valido: false, motivo: "Código agotado" };
  }

  if (promo.unoPorUsuario) {
    const previo = await getById<UsoPromo>("promo-usos", usoPromoId(codigoId, userId));
    if (previo) return { valido: false, motivo: "Ya usaste este código antes" };
  }

  const pct = Math.max(1, Math.min(99, Math.round(promo.porcentaje)));
  const descuento = Math.round((precioBase * pct) / 100);
  const precioFinal = Math.max(0, precioBase - descuento);

  return {
    valido: true,
    promo,
    descuentoCop: descuento,
    precioFinal,
  };
}

export async function listarUsosDeCodigo(codigoId: string): Promise<UsoPromo[]> {
  return query<UsoPromo>("promo-usos", (u) => u.codigoId === codigoId);
}
