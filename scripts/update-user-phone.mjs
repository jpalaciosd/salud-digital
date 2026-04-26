// Actualiza el campo `telefono` de un usuario en Vercel Blob.
// Uso:
//   node scripts/update-user-phone.mjs <email> <telefono>
// Requiere BLOB_READ_WRITE_TOKEN en el entorno (correr `vercel env pull` antes
// si no lo tienes localmente).

import { put } from "@vercel/blob";

const PUBLIC_BLOB_BASE =
  "https://dXnVv4YLfDRDUKDn.public.blob.vercel-storage.com";

function normalizePhoneCO(input) {
  const digits = String(input || "").replace(/\D/g, "");
  return digits.slice(-10);
}

async function main() {
  const [, , emailArg, phoneArg] = process.argv;
  if (!emailArg || !phoneArg) {
    console.error("Uso: node scripts/update-user-phone.mjs <email> <telefono>");
    process.exit(1);
  }

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    console.error(
      "Falta BLOB_READ_WRITE_TOKEN. Corre `vercel env pull` o expórtalo manualmente."
    );
    process.exit(1);
  }

  const email = emailArg.toLowerCase();
  const telefono = normalizePhoneCO(phoneArg);

  if (!/^3\d{9}$/.test(telefono)) {
    console.error(
      `Teléfono "${phoneArg}" -> "${telefono}" no parece celular CO de 10 dígitos (debería empezar por 3).`
    );
    process.exit(1);
  }

  const url = `${PUBLIC_BLOB_BASE}/users/${encodeURIComponent(email)}.json`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) {
    console.error(`No se encontró el usuario en ${url} (status ${res.status}).`);
    process.exit(1);
  }
  const user = await res.json();
  const before = user.telefono;
  user.telefono = telefono;

  await put(`users/${email}.json`, JSON.stringify(user), {
    access: "public",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json",
    token: process.env.BLOB_READ_WRITE_TOKEN,
  });

  console.log(`OK - ${email}: telefono "${before}" -> "${telefono}"`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
