import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';

type ToastItem = { id: number; type: 'ok' | 'err' | 'info'; text: string };
type Ctx = { ok: (t: string) => void; err: (t: string) => void; info: (t: string) => void };

const C = createContext<Ctx | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const push = useCallback((type: ToastItem['type'], text: string) => {
    const id = Date.now() + Math.random();
    setItems((arr) => [...arr, { id, type, text }]);
    setTimeout(() => setItems((arr) => arr.filter((x) => x.id !== id)), 3500);
  }, []);
  return (
    <C.Provider value={{
      ok:  (t) => push('ok', t),
      err: (t) => push('err', t),
      info:(t) => push('info', t),
    }}>
      {children}
      <div className="toasts">
        {items.map((t) => (
          <div key={t.id} className={`toast toast-${t.type}`}>{t.text}</div>
        ))}
      </div>
    </C.Provider>
  );
}

export function useToast() {
  const c = useContext(C);
  if (!c) throw new Error('useToast поза ToastProvider');
  return c;
}

// Маленький helper: викликати asyncFn, показати err у тості якщо впав
export function useTry() {
  const t = useToast();
  return useCallback(async <T,>(fn: () => Promise<T>): Promise<T | null> => {
    try { return await fn(); }
    catch (e: any) { t.err(e?.message || 'Помилка'); return null; }
  }, [t]);
}

// Захист від випадкового закриття при незбережених змінах
export function useUnsavedGuard(dirty: boolean) {
  useEffect(() => {
    if (!dirty) return;
    const h = (e: BeforeUnloadEvent) => { e.preventDefault(); e.returnValue = ''; };
    window.addEventListener('beforeunload', h);
    return () => window.removeEventListener('beforeunload', h);
  }, [dirty]);
}
