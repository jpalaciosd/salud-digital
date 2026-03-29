import { list, put, del } from "@vercel/blob";

// Generic CRUD for Vercel Blob "collections"
// Each record is stored as: {collection}/{id}.json

export async function create<T extends { id: string }>(
  collection: string,
  data: T
): Promise<T> {
  await put(`${collection}/${data.id}.json`, JSON.stringify(data), {
    access: "public",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json",
  });
  return data;
}

export async function getById<T>(
  collection: string,
  id: string
): Promise<T | null> {
  try {
    const res = await fetch(
      `https://dXnVv4YLfDRDUKDn.public.blob.vercel-storage.com/${collection}/${id}.json`,
      { cache: "no-store" }
    );
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

export async function getAll<T>(collection: string): Promise<T[]> {
  const { blobs } = await list({ prefix: `${collection}/` });
  const items: T[] = [];
  for (const blob of blobs) {
    try {
      const res = await fetch(blob.url, { cache: "no-store" });
      if (res.ok) items.push((await res.json()) as T);
    } catch {}
  }
  return items;
}

export async function query<T>(
  collection: string,
  filter: (item: T) => boolean
): Promise<T[]> {
  const all = await getAll<T>(collection);
  return all.filter(filter);
}

export async function update<T extends { id: string }>(
  collection: string,
  id: string,
  updater: (item: T) => T
): Promise<T | null> {
  const existing = await getById<T>(collection, id);
  if (!existing) return null;
  const updated = updater(existing);
  await put(`${collection}/${id}.json`, JSON.stringify(updated), {
    access: "public",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json",
  });
  return updated;
}

export async function remove(collection: string, id: string): Promise<boolean> {
  try {
    await del(
      `https://dXnVv4YLfDRDUKDn.public.blob.vercel-storage.com/${collection}/${id}.json`
    );
    return true;
  } catch {
    return false;
  }
}
