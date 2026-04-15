import OpenAI from "openai";
import type { IaData } from "./types";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const SYSTEM_PROMPT = `Eres un sistema OCR especializado en comprobantes de pago colombianos: Nequi, Bre-B (llaves), Nequi Negocios, Bancolombia, Daviplata, transferencias PSE.
Extrae con precisión los siguientes campos del comprobante en la imagen y devuélvelos como JSON válido:

- monto: número entero en pesos colombianos (sin separadores ni símbolo, ej: 89900). NO incluyas decimales si son ".00".
- titular: nombre completo del receptor del pago (tal como aparece en el comprobante). Si aparecen varios nombres juntos (ej: "Ips Aser Salud Wilson Cuartas"), devuelve el string completo.
- last4: últimos 4 dígitos del identificador del receptor. Puede ser:
  • Llave Bre-B (numérica/cédula/NIT, ej: "0092377556" → "7556")
  • Número celular Nequi (ej: "300 882 2279" → "2279")
  • Número de cuenta bancaria
  Solo dígitos. Si no encuentras un identificador del RECEPTOR, omite el campo (no uses el del emisor).
- fecha: fecha y hora del pago en formato ISO-8601 (ej: "2026-04-15T12:32:00-05:00"). Si solo hay fecha, usar "T00:00:00-05:00".
- referencia: número de comprobante / referencia / ID de la transacción (ej: "M24c151857"). Es el identificador único del movimiento.
- confianza: número entre 0 y 1 que refleja qué tan claro y legible es el comprobante.
- motivosDuda: array de strings con cualquier ambigüedad (ej: "monto parcialmente oculto", "fecha borrosa"). Vacío si todo claro.

REGLAS:
- Si un campo no se puede determinar con certeza, omítelo pero NO inventes.
- En comprobantes Bre-B/Nequi Negocios, el "titular" suele aparecer junto al nombre del negocio (ej: "Ips Aser Salud Wilson Cuartas") — devuélvelo completo.
- Si la imagen no es un comprobante de pago, devuelve confianza: 0 y motivosDuda explicando.

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
