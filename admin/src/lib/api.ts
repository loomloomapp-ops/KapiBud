// Базовий fetch-клієнт адмінки. Тримає CSRF у памʼяті, всі write-запити
// автоматично додають заголовок X-CSRF-Token.

let csrf = '';

export function setCsrf(token: string) { csrf = token; }
export function getCsrf() { return csrf; }

type Json = Record<string, unknown>;

async function send(path: string, init: RequestInit = {}): Promise<any> {
  const headers = new Headers(init.headers || {});
  const method = (init.method || 'GET').toUpperCase();
  if (method !== 'GET' && csrf) headers.set('X-CSRF-Token', csrf);
  if (init.body && !(init.body instanceof FormData) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }
  const res = await fetch(`/api/admin/${path}`, {
    credentials: 'include',
    ...init,
    headers,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.error || `HTTP ${res.status}`);
  return data;
}

export const api = {
  me:     ()                                       => send('me.php'),
  login:  (user: string, pass: string)             => send('login.php',   { method: 'POST', body: JSON.stringify({ user, pass }) }),
  logout: ()                                       => send('logout.php',  { method: 'POST' }),
  get:    (type: string)                           => send(`content.php?type=${type}`),
  save:   (type: string, data: unknown[])          => send(`content.php?type=${type}`, { method: 'PUT', body: JSON.stringify({ data }) }),
  upload: (folder: string, file: File): Promise<{ url: string; name: string; size: number; type: string }> => {
    const fd = new FormData();
    fd.append('file', file);
    fd.append('folder', folder);
    return send(`upload.php?folder=${encodeURIComponent(folder)}`, { method: 'POST', body: fd });
  },
  deleteMedia: (path: string) => send('delete-media.php', { method: 'POST', body: JSON.stringify({ path }) }),

  // Кейси — окремий FS-API
  caseListMedia: (slug: string) =>
    send(`cases-fs.php?action=list-media&slug=${encodeURIComponent(slug)}`),
  caseUpload: (slug: string, file: File) => {
    const fd = new FormData();
    fd.append('file', file);
    fd.append('slug', slug);
    return send(`cases-fs.php?action=upload`, { method: 'POST', body: fd });
  },
  caseDeleteMedia: (slug: string, name: string) =>
    send('cases-fs.php?action=delete-media', { method: 'POST', body: JSON.stringify({ slug, name }) }),
  caseDeleteCase: (slug: string) =>
    send('cases-fs.php?action=delete-case', { method: 'POST', body: JSON.stringify({ slug }) }),
};

export type Json_ = Json;
