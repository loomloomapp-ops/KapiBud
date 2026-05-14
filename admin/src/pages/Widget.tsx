import { useCallback, useEffect, useRef, useState } from 'react';
import { api } from '../lib/api';
import { useToast, useTry, useUnsavedGuard } from '../lib/toast';
import SaveBar from '../components/SaveBar';
import ConfirmDialog from '../components/ConfirmDialog';
import { IcPlus, IcTrash, IcGrip, IcUpload, IcImage } from '../components/icons';

type Messenger = {
  id: string;
  type: 'whatsapp' | 'viber' | 'telegram' | 'phone' | 'instagram' | 'facebook' | 'custom';
  label: string;
  url: string;
  enabled: boolean;
};

type WidgetConfig = {
  managerName: string;
  managerPhoto: string;
  intro: string;
  triggerText: string;
  messengers: Messenger[];
};

const DEFAULT: WidgetConfig = {
  managerName: 'Артем',
  managerPhoto: '/assets/avatar-1.png',
  intro: 'Привіт! Залиште контакти — підкажемо вартість ремонту та допоможемо обрати оптимальне рішення.',
  triggerText: 'Потрібна допомога?',
  messengers: [],
};

const TYPE_OPTIONS: { value: Messenger['type']; label: string }[] = [
  { value: 'whatsapp',  label: 'WhatsApp' },
  { value: 'viber',     label: 'Viber' },
  { value: 'telegram',  label: 'Telegram' },
  { value: 'phone',     label: 'Телефон' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'facebook',  label: 'Facebook' },
  { value: 'custom',    label: 'Інше' },
];

function newId(): string {
  return Math.random().toString(36).slice(2, 9);
}

export default function WidgetPage() {
  const t = useToast();
  const tryDo = useTry();

  const [draft, setDraft]   = useState<WidgetConfig>(DEFAULT);
  const [original, setOrig] = useState<WidgetConfig>(DEFAULT);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);
  const [delIdx, setDelIdx]   = useState<number | null>(null);
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const [pdfBusy, setPdfBusy] = useState(false);
  const [pdfTs, setPdfTs]     = useState<number>(() => Date.now());

  const photoInputRef = useRef<HTMLInputElement>(null);
  const pdfInputRef   = useRef<HTMLInputElement>(null);

  const dirty = JSON.stringify(draft) !== JSON.stringify(original);
  useUnsavedGuard(dirty);

  useEffect(() => {
    let alive = true;
    api.getObject('widget')
      .then((r) => {
        if (!alive) return;
        const d = (r.data && typeof r.data === 'object' && !Array.isArray(r.data))
          ? { ...DEFAULT, ...r.data, messengers: Array.isArray(r.data.messengers) ? r.data.messengers : DEFAULT.messengers }
          : DEFAULT;
        setOrig(d); setDraft(d);
      })
      .catch((e: any) => t.err(e?.message || 'Помилка завантаження'))
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const save = useCallback(async () => {
    if (saving) return;
    setSaving(true);
    try {
      await api.saveObject('widget', draft as unknown as Record<string, unknown>);
      setOrig(draft);
      t.ok('Збережено');
    } catch (e: any) {
      t.err(e?.message || 'Не вдалося зберегти');
    } finally {
      setSaving(false);
    }
  }, [draft, saving, t]);

  const reset = () => setDraft(original);

  const list = draft.messengers || [];

  function updateField<K extends keyof WidgetConfig>(key: K, value: WidgetConfig[K]) {
    setDraft({ ...draft, [key]: value });
  }
  function updateMsg(i: number, patch: Partial<Messenger>) {
    setDraft({ ...draft, messengers: list.map((m, k) => (k === i ? { ...m, ...patch } : m)) });
  }
  function addMsg() {
    setDraft({
      ...draft,
      messengers: [...list, { id: newId(), type: 'whatsapp', label: 'WhatsApp', url: '', enabled: true }],
    });
  }
  function removeMsg(i: number) {
    setDraft({ ...draft, messengers: list.filter((_, k) => k !== i) });
    setDelIdx(null);
  }
  function move(from: number, to: number) {
    if (from === to) return;
    const arr = [...list];
    const [it] = arr.splice(from, 1);
    arr.splice(to, 0, it);
    setDraft({ ...draft, messengers: arr });
  }

  async function uploadPhoto(file: File) {
    const r = await tryDo(() => api.upload('widget', file));
    if (r) {
      updateField('managerPhoto', r.url);
      t.ok('Фото завантажено');
    }
  }

  async function uploadPdf(file: File) {
    if (pdfBusy) return;
    setPdfBusy(true);
    const r = await tryDo(() => api.uploadPdf(file));
    if (r) {
      setPdfTs(Date.now());
      t.ok('PDF замінено');
    }
    setPdfBusy(false);
  }

  if (loading) return <div className="center-screen"><div className="spinner" /></div>;

  return (
    <>
      <div className="page-head">
        <div>
          <h1>Плаваючий віджет</h1>
          <p>Налаштування чат-кнопки у правому нижньому куті сайту: фото менеджера, імʼя, текст і месенджери.</p>
        </div>
      </div>

      <div className="card" style={{ padding: 20, marginBottom: 16 }}>
        <h3 style={{ marginTop: 0 }}>Менеджер</h3>

        <div className="field-row">
          <div className="field-label">
            Фото
            <span className="hint">PNG / JPG / WebP. Квадратне, ~200×200</span>
          </div>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            {draft.managerPhoto ? (
              <div className="img-preview" style={{ width: 100, height: 100, background: '#fff', display: 'grid', placeItems: 'center', padding: 4 }}>
                <img src={draft.managerPhoto} alt={draft.managerName} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'cover', borderRadius: '50%' }} />
              </div>
            ) : (
              <div className="img-preview" style={{ width: 100, height: 100, display: 'grid', placeItems: 'center', color: 'var(--c-muted)' }}><IcImage size={22} /></div>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flex: 1 }}>
              <input
                ref={photoInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp"
                style={{ display: 'none' }}
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) uploadPhoto(f);
                  e.target.value = '';
                }}
              />
              <div style={{ display: 'flex', gap: 6 }}>
                <button className="btn btn-ghost btn-sm" onClick={() => photoInputRef.current?.click()}>
                  <IcUpload size={14} /> {draft.managerPhoto ? 'Замінити' : 'Завантажити'}
                </button>
                {draft.managerPhoto && (
                  <button className="btn btn-ghost btn-sm" onClick={() => updateField('managerPhoto', '')}>Прибрати</button>
                )}
              </div>
              <input
                className="input"
                style={{ fontSize: 11, padding: '6px 8px' }}
                value={draft.managerPhoto}
                onChange={(e) => updateField('managerPhoto', e.target.value)}
                placeholder="/uploads/widget/..."
              />
            </div>
          </div>
        </div>

        <div className="field-row">
          <div className="field-label">Імʼя менеджера</div>
          <input className="input" value={draft.managerName} onChange={(e) => updateField('managerName', e.target.value)} placeholder="Артем" />
        </div>

        <div className="field-row">
          <div className="field-label">Текст на кнопці</div>
          <input className="input" value={draft.triggerText} onChange={(e) => updateField('triggerText', e.target.value)} placeholder="Потрібна допомога?" />
        </div>

        <div className="field-row">
          <div className="field-label">Вступний текст</div>
          <textarea className="textarea" rows={3} value={draft.intro} onChange={(e) => updateField('intro', e.target.value)} />
        </div>
      </div>

      <div className="card" style={{ padding: 20, marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <h3 style={{ margin: 0 }}>Месенджери</h3>
          <button className="btn btn-primary btn-sm" onClick={addMsg}>
            <IcPlus size={14} /> Додати
          </button>
        </div>
        <p style={{ color: 'var(--c-muted)', fontSize: 13, margin: '0 0 12px' }}>
          Перетягуйте за ⋮⋮ щоб змінити порядок. Зніміть галочку щоб приховати кнопку.
        </p>

        {list.map((m, i) => (
          <div
            className="row-card"
            key={m.id || i}
            draggable
            onDragStart={() => setDragIdx(i)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => { if (dragIdx !== null) move(dragIdx, i); setDragIdx(null); }}
            style={{ opacity: dragIdx === i ? 0.4 : 1 }}
          >
            <div className="row-card-head">
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span className="drag-handle"><IcGrip size={14} /></span>
                <h3>{m.label || TYPE_OPTIONS.find((o) => o.value === m.type)?.label || 'Месенджер'}</h3>
              </div>
              <div className="row-card-actions" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <label style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, cursor: 'pointer' }}>
                  <input type="checkbox" checked={!!m.enabled} onChange={(e) => updateMsg(i, { enabled: e.target.checked })} />
                  {m.enabled ? 'Активний' : 'Прихований'}
                </label>
                <button className="icon-btn danger" title="Видалити" onClick={() => setDelIdx(i)}>
                  <IcTrash size={14} />
                </button>
              </div>
            </div>

            <div className="field-row">
              <div className="field-label">Тип</div>
              <select className="input" value={m.type} onChange={(e) => updateMsg(i, { type: e.target.value as Messenger['type'] })}>
                {TYPE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>

            <div className="field-row">
              <div className="field-label">Підпис на кнопці</div>
              <input className="input" value={m.label} onChange={(e) => updateMsg(i, { label: e.target.value })} placeholder="WhatsApp / Подзвонити / ..." />
            </div>

            <div className="field-row">
              <div className="field-label">
                URL / номер
                <span className="hint">
                  WhatsApp: https://wa.me/380630282440 · Viber: viber://chat?number=%2B380630282440 ·
                  Telegram: https://t.me/username · Телефон: tel:+380630282440 · Instagram: https://instagram.com/...
                </span>
              </div>
              <input className="input" value={m.url} onChange={(e) => updateMsg(i, { url: e.target.value })} placeholder="https://..." />
            </div>
          </div>
        ))}

        {list.length === 0 && (
          <div className="card" style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--c-muted)' }}>
            Поки немає месенджерів. Додайте перший.
          </div>
        )}
      </div>

      <div className="card" style={{ padding: 20, marginBottom: 80 }}>
        <h3 style={{ marginTop: 0 }}>Прайс-лист (PDF)</h3>
        <p style={{ color: 'var(--c-muted)', fontSize: 13, margin: '0 0 12px' }}>
          Файл, який завантажується з блоку «Завантажити прайс-лист» на головній. Лімит — 25 MB.
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <a href={`/assets/PRIMEBUD-pricelist.pdf?v=${pdfTs}`} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
            Переглянути поточний PDF
          </a>
          <input
            ref={pdfInputRef}
            type="file"
            accept="application/pdf,.pdf"
            style={{ display: 'none' }}
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) uploadPdf(f);
              e.target.value = '';
            }}
          />
          <button className="btn btn-primary" onClick={() => pdfInputRef.current?.click()} disabled={pdfBusy}>
            <IcUpload size={14} /> {pdfBusy ? 'Завантаження…' : 'Замінити PDF'}
          </button>
        </div>
      </div>

      <SaveBar dirty={dirty} saving={saving} onSave={save} onReset={reset} />

      <ConfirmDialog
        open={delIdx !== null}
        title="Видалити месенджер?"
        danger confirmText="Видалити"
        onConfirm={() => delIdx !== null && removeMsg(delIdx)}
        onCancel={() => setDelIdx(null)}
      />
    </>
  );
}
