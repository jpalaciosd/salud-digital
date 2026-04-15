const ALFABETO = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

export function generarCodigoCanje(): string {
  let codigo = "";
  const arr = new Uint8Array(6);
  crypto.getRandomValues(arr);
  for (const b of arr) codigo += ALFABETO[b % ALFABETO.length];
  return `ISSI-${codigo}`;
}

export function normalizar(s: string): string {
  return s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

function levenshtein(a: string, b: string): number {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;
  const m: number[][] = Array.from({ length: a.length + 1 }, () => new Array(b.length + 1).fill(0));
  for (let i = 0; i <= a.length; i++) m[i][0] = i;
  for (let j = 0; j <= b.length; j++) m[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      m[i][j] = Math.min(m[i - 1][j] + 1, m[i][j - 1] + 1, m[i - 1][j - 1] + cost);
    }
  }
  return m[a.length][b.length];
}

export function coincidenciaFuzzy(a: string, b: string): number {
  const na = normalizar(a);
  const nb = normalizar(b);
  if (!na || !nb) return 0;
  if (na === nb) return 1;
  const maxLen = Math.max(na.length, nb.length);
  const dist = levenshtein(na, nb);
  return 1 - dist / maxLen;
}

export function tituarContenido(titularIa: string, titularEsperado: string): boolean {
  const a = normalizar(titularIa);
  const b = normalizar(titularEsperado);
  if (!a || !b) return false;
  if (a.includes(b) || b.includes(a)) return true;
  return coincidenciaFuzzy(a, b) >= 0.8;
}
