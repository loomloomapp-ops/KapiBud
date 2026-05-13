import { useCallback, useEffect, useRef, useState } from 'react';
import { api } from './api';
import { useToast } from './toast';

// Загальний хук редагування JSON-колекції (services / plans / reviews / faq / partners / cases-meta).
// Тримає original + draft, dirty, save(), reset().
export function useContentEditor<T>(type: string, initial: T) {
  const [draft, setDraft]     = useState<T>(initial);
  const [original, setOrig]   = useState<T>(initial);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);
  const t = useToast();

  // Зберігаємо посилання на toast щоб уникнути перезапусків ефекту
  const tRef = useRef(t); tRef.current = t;

  useEffect(() => {
    let alive = true;
    setLoading(true);
    api.get(type)
      .then((r) => {
        if (!alive) return;
        const data = (r.data ?? []) as T;
        setOrig(data); setDraft(data);
      })
      .catch((e) => { if (alive) tRef.current.err(e?.message || 'Помилка завантаження'); })
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, [type]);

  const dirty = JSON.stringify(draft) !== JSON.stringify(original);

  const save = useCallback(async () => {
    if (saving) return;
    setSaving(true);
    try {
      await api.save(type, draft as unknown[]);
      setOrig(draft);
      tRef.current.ok('Збережено');
    } catch (e: any) {
      tRef.current.err(e?.message || 'Не вдалося зберегти');
    } finally {
      setSaving(false);
    }
  }, [type, draft, saving]);

  const reset = useCallback(() => setDraft(original), [original]);

  return { draft, setDraft, dirty, loading, saving, save, reset, original };
}
