/** Short-lived in-memory ZIP store so Brave can download via a real GET URL. */

type Entry = {
  data: Uint8Array;
  filename: string;
  expires: number;
};

const store = new Map<string, Entry>();
const TTL_MS = 15 * 60 * 1000;

function purge() {
  const now = Date.now();
  for (const [k, v] of store) {
    if (v.expires < now) store.delete(k);
  }
}

export function putExport(data: Uint8Array, filename: string): string {
  purge();
  const id = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
  store.set(id, { data, filename, expires: Date.now() + TTL_MS });
  return id;
}

export function takeExport(id: string): Entry | null {
  purge();
  const entry = store.get(id);
  if (!entry) return null;
  // keep available for retries (Brave may hit twice)
  return entry;
}
