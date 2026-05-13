import { useRef, useState } from 'react';
import { useContentEditor } from '../lib/useContent';
import { useToast, useTry, useUnsavedGuard } from '../lib/toast';
import { api } from '../lib/api';
import SaveBar from '../components/SaveBar';
import ConfirmDialog from '../components/ConfirmDialog';
import { IcPlus, IcTrash, IcUpload, IcImage } from '../components/icons';

type Plan = {
  name: string;
  price: string;
  items: string[];
  term: string;
  termSub?: string;
  ph: string;
};

const EMPTY: Plan = { name: '', price: '', items: [''], term: '', termSub: '', ph: '' };

export default function PlansPage() {
  const { draft, setDraft, dirty, loading, saving, save, reset } =
    useContentEditor<Plan[]>('plans', []);
  useUnsavedGuard(dirty);
  const t = useToast();
  const tryDo = useTry();
  const [delIdx, setDelIdx] = useState<number | null>(null);
  const fileRefs = useRef<Record<number, HTMLInputElement | null>>({});

  if (loading) return <div className="center-screen"><div className="spinner" /></div>;
  const list = draft || [];
  const canAdd = list.length < 3;

  function update(i: number, patch: Partial<Plan>) {
    setDraft(list.map((it, k) => (k === i ? { ...it, ...patch } : it)));
  }
  function updItem(planIdx: number, itemIdx: number, val: string) {
    const items = [...list[planIdx].items];
    items[itemIdx] = val;
    update(planIdx, { items });
  }
  function addItem(planIdx: number) {
    update(planIdx, { items: [...list[planIdx].items, ''] });
  }
  function delItem(planIdx: number, itemIdx: number) {
    const items = list[planIdx].items.filter((_, k) => k !== itemIdx);
    update(planIdx, { items });
  }
  function add() {
    if (!canAdd) return;
    setDraft([...list, { ...EMPTY, items: [''] }]);
  }
  function remove(i: number) {
    setDraft(list.filter((_, k) => k !== i));
    setDelIdx(null);
  }
  async function uploadImg(i: number, file: File) {
    const r = await tryDo(() => api.upload('plans', file));
    if (r) {
      update(i, { ph: r.url });
      t.ok('Зображення завантажено');
    }
  }

  return (
    <>
      <div className="page-head">
        <div>
          <h1>Тарифи / Прайс-лист</h1>
          <p>Картки в блоці тарифних пакетів. Максимум 3.</p>
        </div>
        <div className="page-actions">
          <button className="btn btn-primary" onClick={add} disabled={!canAdd}>
            <IcPlus size={14} /> Додати тариф
          </button>
        </div>
      </div>

      {!canAdd && <div className="tag warn" style={{ marginBottom: 12 }}>Досягнуто максимум 3 тарифи</div>}

      {list.map((p, i) => (
        <div className="row-card" key={i}>
          <div className="row-card-head">
            <h3>{p.name || `Тариф №${i + 1}`}</h3>
            <div className="row-card-actions">
              <button className="icon-btn danger" title="Видалити" onClick={() => setDelIdx(i)}>
                <IcTrash size={14} />
              </button>
            </div>
          </div>

          <div className="field-row">
            <div className="field-label">Назва</div>
            <input className="input" value={p.name} onChange={(e) => update(i, { name: e.target.value })} />
          </div>

          <div className="field-row">
            <div className="field-label">
              Зображення
              <span className="hint">Webp / JPG / PNG</span>
            </div>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              {p.ph
                ? <div className="img-preview" style={{ width: 100, height: 100, backgroundImage: `url(${p.ph})` }} />
                : <div className="img-preview" style={{ width: 100, height: 100, display: 'grid', placeItems: 'center', color: 'var(--c-muted)' }}><IcImage size={22} /></div>
              }
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <input
                  ref={(el) => { fileRefs.current[i] = el; }}
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) uploadImg(i, f);
                    e.target.value = '';
                  }}
                />
                <button className="btn btn-ghost btn-sm" onClick={() => fileRefs.current[i]?.click()}>
                  <IcUpload size={14} /> {p.ph ? 'Замінити' : 'Завантажити'}
                </button>
                <input
                  className="input"
                  style={{ fontSize: 11, padding: '6px 8px' }}
                  value={p.ph}
                  onChange={(e) => update(i, { ph: e.target.value })}
                  placeholder="/assets/...  або  /uploads/plans/..."
                />
              </div>
            </div>
          </div>

          <div className="field-row">
            <div className="field-label">Ціна</div>
            <input className="input" value={p.price} onChange={(e) => update(i, { price: e.target.value })} placeholder="880 грн/м²" />
          </div>

          <div className="field-row">
            <div className="field-label">
              Що входить
              <span className="hint">Список пунктів</span>
            </div>
            <div className="items-list">
              {p.items.map((it, k) => (
                <div className="it-row" key={k}>
                  <input className="input" value={it} onChange={(e) => updItem(i, k, e.target.value)} />
                  <button className="icon-btn danger" onClick={() => delItem(i, k)}><IcTrash size={14} /></button>
                </div>
              ))}
              <button className="btn btn-ghost btn-sm" onClick={() => addItem(i)} style={{ alignSelf: 'flex-start', marginTop: 4 }}>
                <IcPlus size={14} /> Додати пункт
              </button>
            </div>
          </div>

          <div className="field-row">
            <div className="field-label">Термін</div>
            <input className="input" value={p.term} onChange={(e) => update(i, { term: e.target.value })} placeholder="від 3-х тиж." />
          </div>
          <div className="field-row">
            <div className="field-label">
              Підпис під терміном
              <span className="hint">Необовʼязково</span>
            </div>
            <input className="input" value={p.termSub || ''} onChange={(e) => update(i, { termSub: e.target.value })} />
          </div>
        </div>
      ))}

      {list.length === 0 && (
        <div className="card" style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--c-muted)' }}>
          Поки немає тарифів.
        </div>
      )}

      <SaveBar dirty={dirty} saving={saving} onSave={save} onReset={reset} />

      <ConfirmDialog
        open={delIdx !== null}
        title="Видалити тариф?"
        danger confirmText="Видалити"
        onConfirm={() => delIdx !== null && remove(delIdx)}
        onCancel={() => setDelIdx(null)}
      />
    </>
  );
}
