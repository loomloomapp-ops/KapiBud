import { useState } from 'react';
import { useContentEditor } from '../lib/useContent';
import { useUnsavedGuard } from '../lib/toast';
import SaveBar from '../components/SaveBar';
import ConfirmDialog from '../components/ConfirmDialog';
import { IcPlus, IcTrash, IcGrip } from '../components/icons';

type QA = { q: string; a: string };

export default function FAQPage() {
  const { draft, setDraft, dirty, loading, saving, save, reset } =
    useContentEditor<QA[]>('faq', []);
  useUnsavedGuard(dirty);
  const [delIdx, setDelIdx] = useState<number | null>(null);
  const [dragIdx, setDragIdx] = useState<number | null>(null);

  if (loading) return <div className="center-screen"><div className="spinner" /></div>;
  const list = draft || [];

  function update(i: number, patch: Partial<QA>) {
    setDraft(list.map((it, k) => (k === i ? { ...it, ...patch } : it)));
  }
  function add() { setDraft([...list, { q: '', a: '' }]); }
  function remove(i: number) { setDraft(list.filter((_, k) => k !== i)); setDelIdx(null); }
  function move(from: number, to: number) {
    if (from === to) return;
    const arr = [...list];
    const [it] = arr.splice(from, 1);
    arr.splice(to, 0, it);
    setDraft(arr);
  }

  return (
    <>
      <div className="page-head">
        <div>
          <h1>FAQ</h1>
          <p>Питання та відповіді. Перетягуйте картки за ⋮⋮ щоб змінити порядок.</p>
        </div>
        <div className="page-actions">
          <button className="btn btn-primary" onClick={add}>
            <IcPlus size={14} /> Додати питання
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
              <h3>Питання №{i + 1}</h3>
            </div>
            <div className="row-card-actions">
              <button className="icon-btn danger" title="Видалити" onClick={() => setDelIdx(i)}>
                <IcTrash size={14} />
              </button>
            </div>
          </div>
          <div className="field-row">
            <div className="field-label">Питання</div>
            <input className="input" value={it.q} onChange={(e) => update(i, { q: e.target.value })} />
          </div>
          <div className="field-row">
            <div className="field-label">Відповідь</div>
            <textarea className="textarea" value={it.a} onChange={(e) => update(i, { a: e.target.value })} rows={3} />
          </div>
        </div>
      ))}

      {list.length === 0 && (
        <div className="card" style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--c-muted)' }}>
          Поки немає питань.
        </div>
      )}

      <SaveBar dirty={dirty} saving={saving} onSave={save} onReset={reset} />

      <ConfirmDialog
        open={delIdx !== null}
        title="Видалити питання?"
        danger confirmText="Видалити"
        onConfirm={() => delIdx !== null && remove(delIdx)}
        onCancel={() => setDelIdx(null)}
      />
    </>
  );
}
