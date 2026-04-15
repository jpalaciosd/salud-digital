import OpenAI from "openai";
import type { IaData } from "./types";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const SYSTEM_PROMPT = `Eres un sistema OCR especializado en comprobantes de pago de Nequi (Colombia).
Extrae con precisión los siguientes campos del comprobante en la imagen y devuélvelos como JSON válido:

- monto: número entero en pesos colombianos (sin separadores, ej: 89900)
- titular: nombre completo del receptor del pago (tal como aparece)
- last4: últimos 4 dígitos del número Nequi receptor (solo dígitos)
- fecha: fecha y hora del pago en formato ISO-8601 (ej: "2026-04-13T15:30:00-05:00"). Si solo hay fecha, usar "T00:00:00-05:00"
- referencia: número de comprobante, referencia o ID de la transacción
- confianza: número entre 0 y 1 que refleja qué tan claro y legible es el comprobante
- motivosDuda: array de strings con cualquier ambigüedad (ej: "monto parcialmente oculto", "fecha borrosa"). Vacío si todo claro.

Si un campo no se puede determinar con certeza, omítelo pero NO inventes. Si la imagen no es un comprobante de Nequi, devuelve confianza: 0 y motivosDuda explicando.

Responde SOLO con el JSON, sin texto adicional.`;

export async function extraerComprobanteNequi(imagenUrl: string): Promise<IaData> {
  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      {
        role: "user",
        content: [
          { type: "text", text: "Extrae los datos del comprobante Nequi:" },
          { type: "image_url", image_url: { url: imagenUrl, detail: "high" } },
        ],
      },
    ],
    max_tokens: 500,
    temperature: 0,
  });

  const raw = response.choices[0]?.message?.content || "{}";
  let parsed: Partial<IaData> = {};
  try {
    parsed = JSON.parse(raw);
  } catch {
    return { confianza: 0, motivosDuda: ["No se pudo parsear respuesta de IA"] };
  }

  return {
    monto: typeof parsed.monto === "number" ? parsed.monto : undefined,
    titular: typeof parsed.titular === "string" ? parsed.titular : undefined,
    last4: typeof parsed.last4 === "string" ? parsed.last4.replace(/\D/g, "").slice(-4) : undefined,
    fecha: typeof parsed.fecha === "string" ? parsed.fecha : undefined,
    referencia: typeof parsed.referencia === "string" ? parsed.referencia : undefined,
    confianza: typeof parsed.confianza === "number" ? Math.max(0, Math.min(1, parsed.confianza)) : 0,
    motivosDuda: Array.isArray(parsed.motivosDuda) ? parsed.motivosDuda : undefined,
  };
}
