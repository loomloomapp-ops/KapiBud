import { useEffect, useState } from 'react';

const cache = new Map<string, unknown>();
const inflight = new Map<string, Promise<unknown>>();

async function fetchOnce<T>(url: string): Promise<T> {
  if (cache.has(url)) return cache.get(url) as T;
  let p = inflight.get(url) as Promise<T> | undefined;
  if (!p) {
    p = fetch(url, { cache: 'no-cache' }).then((r) => {
      if (!r.ok) throw new Error(`Failed ${url}: ${r.status}`);
      return r.json();
    }) as Promise<T>;
    inflight.set(url, p as Promise<unknown>);
    p.then((data) => {
      cache.set(url, data);
      inflight.delete(url);
    }).catch(() => inflight.delete(url));
  }
  return p;
}

export function useContent<T>(type: string, fallback: T): T {
  const [data, setData] = useState<T>(() => (cache.get(`/data/${type}.json`) as T) ?? fallback);
  useEffect(() => {
    let alive = true;
    fetchOnce<T>(`/data/${type}.json`).then((d) => { if (alive) setData(d); }).catch(() => {});
    return () => { alive = false; };
  }, [type]);
  return data;
}

export async function loadContent<T>(type: string): Promise<T> {
  return fetchOnce<T>(`/data/${type}.json`);
}
