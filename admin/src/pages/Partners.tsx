import { useRef, useState } from 'react';
import { useContentEditor } from '../lib/useContent';
import { useToast, useTry, useUnsavedGuard } from '../lib/toast';
import { api } from '../lib/api';
import SaveBar from '../components/SaveBar';
import ConfirmDialog from '../components/ConfirmDialog';
import { IcPlus, IcTrash, IcGrip, IcUpload, IcImage } from '../components/icons';

type Partner = { cls: string; label: string; logo?: string };

export default function PartnersPage() {
  const { draft, setDraft, dirty, loading, saving, save, reset } =
    useContentEditor<Partner[]>('partners', []);
  useUnsavedGuard(dirty);
  const t = useToast();
  const tryDo = useTry();
  const [delIdx, setDelIdx] = useState<number | null>(null);
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const fileRefs = useRef<Record<number, HTMLInputElement | null>>({});
  const list = draft || [];

  if (loading) return <div className="center-screen"><div className="spinner" /></div>;

  function update(i: number, patch: Partial<Partner>) {
    setDraft(list.map((it, k) => (k === i ? { ...it, ...patch } : it)));
  }
  function add() { setDraft([...list, { cls: '', label: '' }]); }
  function remove(i: number) { setDraft(list.filter((_, k) => k !== i)); setDelIdx(null); }
  function move(from: number, to: number) {
    if (from === to) return;
    const arr = [...list];
    const [it] = arr.splice(from, 1);
    arr.splice(to, 0, it);
    setDraft(arr);
  }
  async function uploadLogo(i: number, file: File) {
    const r = await tryDo(() => api.upload('partners', file));
    if (r) {
      update(i, { logo: r.url });
      t.ok('Логотип завантажено');
    }
  }

  return (
    <>
      <div className="page-head">
        <div>
          <h1>Партнери</h1>
          <p>Картки в маркі-карусел в нижній частині сайту. Перетягуйте за ⋮⋮ щоб змінити порядок.</p>
        </div>
        <div className="page-actions">
          <button className="btn btn-primary" onClick={add}>
            <IcPlus size={14} /> Додати партнера
          </button>
        </div>
      </div>

      {list.map((it, i) => (
        <div
          className="row-card"
          key={i}
          draggable
          onDragStart={() => setDragIdx(i)}
          onDragOver={(e) => e.preventDefault()}
          onDrop={() => { if (dragIdx !== null) move(dragIdx, i); setDragIdx(null); }}
          style={{ opacity: dragIdx === i ? 0.4 : 1 }}
        >
          <div className="row-card-head">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span className="drag-handle"><IcGrip size={14} /></span>
              <h3>{it.label || `Партнер №${i + 1}`}</h3>
            </div>
            <div className="row-card-actions">
              <button className="icon-btn danger" title="Видалити" onClick={() => setDelIdx(i)}>
                <IcTrash size={14} />
              </button>
            </div>
          </div>
          <div className="field-row">
            <div className="field-label">Назва</div>
            <input className="input" value={it.label} onChange={(e) => update(i, { label: e.target.value })} placeholder="АГРОМАТ" />
          </div>

          <div className="field-row">
            <div className="field-label">
              Логотип
              <span className="hint">SVG / PNG / JPG / WebP. Якщо порожньо — буде використано стилізовану назву</span>
            </div>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              {it.logo ? (
                <div className="img-preview" style={{ width: 100, height: 100, background: '#fff', display: 'grid', placeItems: 'center', padding: 8 }}>
                  <img src={it.logo} alt={it.label} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                </div>
              ) : (
                <div className="img-preview" style={{ width: 100, height: 100, display: 'grid', placeItems: 'center', color: 'var(--c-muted)' }}><IcImage size={22} /></div>
              )}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flex: 1 }}>
                <input
                  ref={(el) => { fileRefs.current[i] = el; }}
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/svg+xml,.svg"
                  style={{ display: 'none' }}
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) uploadLogo(i, f);
                    e.target.value = '';
                  }}
                />
                <div style={{ display: 'flex', gap: 6 }}>
                  <button className="btn btn-ghost btn-sm" onClick={() => fileRefs.current[i]?.click()}>
                    <IcUpload size={14} /> {it.logo ? 'Замінити' : 'Завантажити'}
                  </button>
                  {it.logo && (
                    <button className="btn btn-ghost btn-sm" onClick={() => update(i, { logo: '' })}>
                      Прибрати
                    </button>
                  )}
                </div>
                <input
                  className="input"
                  style={{ fontSize: 11, padding: '6px 8px' }}
                  value={it.logo || ''}
                  onChange={(e) => update(i, { logo: e.target.value })}
                  placeholder="/uploads/partners/..."
                />
              </div>
            </div>
          </div>

          <div className="field-row">
            <div className="field-label">
              CSS-клас стилю
              <span className="hint">AGROMAT / REHAU / TECE / KNAUF / SONCE / CERSANIT / LEROY / EPICENTRE. Використовується тільки якщо немає логотипу</span>
            </div>
            <input className="input" value={it.cls} onChange={(e) => update(i, { cls: e.target.value })} placeholder="AGROMAT" />
          </div>

        </div>
      ))}

      {list.length === 0 && (
        <div className="card" style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--c-muted)' }}>
          Поки немає партнерів.
        </div>
      )}

      <SaveBar dirty={dirty} saving={saving} onSave={save} onReset={reset} />

      <ConfirmDialog
        open={delIdx !== null}
        title="Видалити партнера?"
        danger confirmText="Видалити"
        onConfirm={() => delIdx !== null && remove(delIdx)}
        onCancel={() => setDelIdx(null)}
      />
    </>
  );
}
