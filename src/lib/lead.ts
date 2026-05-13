// Відправка ліда. На Hostinger ходимо в /api/lead.php (PHP→Telegram).
// На локалці без бекенду — лог + симуляція успіху.

export type LeadPayload = {
  source: 'hero-form' | 'quiz' | 'cta' | 'services-popup' | 'floating-widget';
  name?: string;
  phone?: string;
  contactChannel?: string;
  objectType?: string;
  message?: string;
  service?: string;
  // Quiz extras
  step1?: string;
  step2?: string;
  step3?: Record<string, string>;
};

export async function sendLead(payload: LeadPayload): Promise<{ ok: boolean; error?: string }> {
  try {
    const res = await fetch('/api/lead.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...payload, ts: new Date().toISOString(), ua: navigator.userAgent }),
    });
    if (!res.ok) {
      // На локалці без PHP — мовчки повертаємо ok, щоб дизайн-флоу не блокувався.
      if (import.meta.env.DEV) {
        console.warn('[lead] dev mode — backend not available, simulating success', payload);
        return { ok: true };
      }
      return { ok: false, error: `HTTP ${res.status}` };
    }
    const data = await res.json().catch(() => ({ ok: true }));
    return { ok: !!data.ok, error: data.error };
  } catch (err) {
    if (import.meta.env.DEV) {
      console.warn('[lead] dev mode — fetch failed, simulating success', payload, err);
      return { ok: true };
    }
    return { ok: false, error: (err as Error).message };
  }
}
