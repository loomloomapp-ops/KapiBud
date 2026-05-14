import { useRef, useState } from 'react';
import { useContentEditor } from '../lib/useContent';
import { useToast, useTry, useUnsavedGuard } from '../lib/toast';
import { api } from '../lib/api';
import SaveBar from '../components/SaveBar';
import ConfirmDialog from '../components/ConfirmDialog';
import { IcPlus, IcTrash, IcGrip, IcUpload, IcImage } from '../components/icons';

type Review = { nm: string; when: string; av: string; text: string };
const EMPTY: Review = { nm: '', when: '', av: '#C8B89F', text: '' };

const AV_PALETTE = ['#C8B89F', '#B7A48A', '#A39177', '#8E7B5F', '#D9C8A8', '#9B815E'];

const isImg = (v: string) => /^(\/|https?:\/\/|data:image\/)/.test(v);

export default function ReviewsPage() {
  const { draft, setDraft, dirty, loading, saving, save, reset } =
    useContentEditor<Review[]>('reviews', []);
  useUnsavedGuard(dirty);
  const t = useToast();
  const tryDo = useTry();
  const [delIdx, setDelIdx] = useState<number | null>(null);
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const fileRefs = useRef<Record<number, HTMLInputElement | null>>({});
  const list = draft || [];

  if (loading) return <div className="center-screen"><div className="spinner" /></div>;

  function update(i: number, patch: Partial<Review>) {
    setDraft(list.map((it, k) => (k === i ? { ...it, ...patch } : it)));
  }
  function add() { setDraft([{ ...EMPTY }, ...list]); }
  function remove(i: number) { setDraft(list.filter((_, k) => k !== i)); setDelIdx(null); }
  function move(from: number, to: number) {
    if (from === to) return;
    const arr = [...list];
    const [it] = arr.splice(from, 1);
    arr.splice(to, 0, it);
    setDraft(arr);
  }
  async function uploadAvatar(i: number, file: File) {
    const r = await tryDo(() => api.upload('reviews', file));
    if (r) {
      update(i, { av: r.url });
      t.ok('Аватар завантажено');
    }
  }

  return (
    <>
      <div className="page-head">
        <div>
          <h1>Відгуки</h1>
          <p>Картки відгуків клієнтів. Перетягуйте за ⋮⋮ щоб впорядкувати.</p>
        </div>
        <div className="page-actions">
          <button className="btn btn-primary" onClick={add}>
            <IcPlus size={14} /> Додати відгук
          </button>
        </div>
      </div>

      {list.map((r, i) => {
        const hasImg = isImg(r.av);
        return (
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
              <h3>{r.nm || `Відгук №${i + 1}`}</h3>
            </div>
            <div className="row-card-actions">
              <button className="icon-btn danger" onClick={() => setDelIdx(i)}><IcTrash size={14} /></button>
            </div>
          </div>

          <div className="field-row">
            <div className="field-label">Імʼя</div>
            <input className="input" value={r.nm} onChange={(e) => update(i, { nm: e.target.value })} />
          </div>
          <div className="field-row">
            <div className="field-label">Коли</div>
            <input className="input" value={r.when} onChange={(e) => update(i, { when: e.target.value })} placeholder="тиждень тому" />
          </div>

          <div className="field-row">
            <div className="field-label">
              Аватар
              <span className="hint">Завантажте фото або задайте HEX-колір кружечка</span>
            </div>
            <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              {hasImg ? (
                <div
                  className="img-preview"
                  style={{ width: 72, height: 72, borderRadius: '50%', overflow: 'hidden', flexShrink: 0 }}
                >
                  <img src={r.av} alt={r.nm} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              ) : (
                <div
                  className="avatar-swatch"
                  style={{
                    width: 72, height: 72, borderRadius: '50%', flexShrink: 0,
                    background: r.av.startsWith('#') ? r.av : 'var(--c-hover)',
                    display: 'grid', placeItems: 'center', color: 'var(--c-muted)',
                  }}
                >
                  {!r.av.startsWith('#') && <IcImage size={22} />}
                </div>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flex: 1 }}>
                <input
                  ref={(el) => { fileRefs.current[i] = el; }}
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/svg+xml,.svg"
                  style={{ display: 'none' }}
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) uploadAvatar(i, f);
                    e.target.value = '';
                  }}
                />
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  <button className="btn btn-ghost btn-sm" onClick={() => fileRefs.current[i]?.click()}>
                    <IcUpload size={14} /> {hasImg ? 'Замінити фото' : 'Завантажити фото'}
                  </button>
                  {hasImg && (
                    <button className="btn btn-ghost btn-sm" onClick={() => update(i, { av: '#C8B89F' })}>
                      Прибрати фото
                    </button>
                  )}
                </div>

                <input
                  className="input"
                  value={r.av}
                  onChange={(e) => update(i, { av: e.target.value })}
                  placeholder="#C8B89F або /uploads/reviews/..."
                  style={{ fontSize: 12 }}
                />

                {!hasImg && (
                  <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                    {AV_PALETTE.map((c) => (
                      <button key={c}
                        title={c}
                        onClick={() => update(i, { av: c })}
                        style={{
                          width: 22, height: 22, borderRadius: '50%',
                          background: c, border: '1px solid var(--c-border)', cursor: 'pointer',
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="field-row">
            <div className="field-label">Текст відгуку</div>
            <textarea className="textarea" value={r.text} onChange={(e) => update(i, { text: e.target.value })} rows={3} />
          </div>
        </div>
        );
      })}

      {list.length === 0 && (
        <div className="card" style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--c-muted)' }}>
          Поки немає відгуків.
        </div>
      )}

      <SaveBar dirty={dirty} saving={saving} onSave={save} onReset={reset} />

      <ConfirmDialog
        open={delIdx !== null}
        title="Видалити відгук?"
        danger confirmText="Видалити"
        onConfirm={() => delIdx !== null && remove(delIdx)}
        onCancel={() => setDelIdx(null)}
      />
    </>
  );
}
