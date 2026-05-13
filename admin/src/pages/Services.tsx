import { useState } from 'react';
import { useContentEditor } from '../lib/useContent';
import { useUnsavedGuard } from '../lib/toast';
import SaveBar from '../components/SaveBar';
import ConfirmDialog from '../components/ConfirmDialog';
import { IcPlus, IcTrash } from '../components/icons';

type Service = {
  name: string;
  desc: string;
  includes: string;
  materials: string;
  price: string;
};

const EMPTY: Service = { name: '', desc: '', includes: '', materials: '', price: '' };

export default function ServicesPage() {
  const { draft, setDraft, dirty, loading, saving, save, reset } =
    useContentEditor<Service[]>('services', []);
  useUnsavedGuard(dirty);
  const [delIdx, setDelIdx] = useState<number | null>(null);

  if (loading) return <div className="center-screen"><div className="spinner" /></div>;

  const list = draft || [];
  const canAdd = list.length < 3;

  function update(i: number, patch: Partial<Service>) {
    setDraft(list.map((it, k) => (k === i ? { ...it, ...patch } : it)));
  }
  function add() {
    if (!canAdd) return;
    setDraft([...list, { ...EMPTY }]);
  }
  function remove(i: number) {
    setDraft(list.filter((_, k) => k !== i));
    setDelIdx(null);
  }

  return (
    <>
      <div className="page-head">
        <div>
          <h1>Послуги</h1>
          <p>Картки в блоці «Послуги» на головній. Максимум 3 — це обмеження дизайну.</p>
        </div>
        <div className="page-actions">
          <button className="btn btn-primary" onClick={add} disabled={!canAdd}>
            <IcPlus size={14} /> Додати послугу
          </button>
        </div>
      </div>

      {!canAdd && <div className="tag warn" style={{ marginBottom: 12 }}>Досягнуто максимум 3 послуги</div>}

      {list.map((s, i) => (
        <div className="row-card" key={i}>
          <div className="row-card-head">
            <h3>{s.name || `Послуга №${i + 1}`}</h3>
            <div className="row-card-actions">
              <button className="icon-btn danger" title="Видалити" onClick={() => setDelIdx(i)}>
                <IcTrash size={14} />
              </button>
            </div>
          </div>

          <div className="field-row">
            <div className="field-label">Назва</div>
            <input className="input" value={s.name} onChange={(e) => update(i, { name: e.target.value })} />
          </div>
          <div className="field-row">
            <div className="field-label">
              Короткий опис
              <span className="hint">Один рядок під назвою</span>
            </div>
            <input className="input" value={s.desc} onChange={(e) => update(i, { desc: e.target.value })} />
          </div>
          <div className="field-row">
            <div className="field-label">
              Що входить
              <span className="hint">Кожний пункт з нового рядка</span>
            </div>
            <textarea className="textarea" value={s.includes} onChange={(e) => update(i, { includes: e.target.value })} rows={4} />
          </div>
          <div className="field-row">
            <div className="field-label">Рівень матеріалів</div>
            <input className="input" value={s.materials} onChange={(e) => update(i, { materials: e.target.value })} />
          </div>
          <div className="field-row">
            <div className="field-label">Ціна</div>
            <input className="input" value={s.price} onChange={(e) => update(i, { price: e.target.value })} placeholder="від 450 $/м²" />
          </div>
        </div>
      ))}

      {list.length === 0 && (
        <div className="card" style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--c-muted)' }}>
          Поки немає послуг. Натисніть «Додати послугу» вгорі.
        </div>
      )}

      <SaveBar dirty={dirty} saving={saving} onSave={save} onReset={reset} />

      <ConfirmDialog
        open={delIdx !== null}
        title="Видалити послугу?"
        message={delIdx !== null ? `«${list[delIdx]?.name || 'Без назви'}» буде видалено.` : ''}
        confirmText="Видалити"
        danger
        onConfirm={() => delIdx !== null && remove(delIdx)}
        onCancel={() => setDelIdx(null)}
      />
    </>
  );
}
