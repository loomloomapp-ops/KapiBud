import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import { useToast } from '../lib/toast';
import ConfirmDialog from '../components/ConfirmDialog';
import { IcPlus, IcTrash, IcEdit } from '../components/icons';

type CaseItem = {
  slug: string;
  title: string;
  fullTitle: string;
  category: 'Будинок' | 'Квартира' | 'Комерційний';
  location: string;
  date: string;
  budget: string;
  area: string;
  photos: string[];
  videos: string[];
};

const NEW_CASE: CaseItem = {
  slug: '',
  title: '',
  fullTitle: '',
  category: 'Квартира',
  location: '',
  date: '',
  budget: '',
  area: '',
  photos: [],
  videos: [],
};

export default function CasesPage() {
  const nav = useNavigate();
  const t = useToast();
  const [list, setList] = useState<CaseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [delSlug, setDelSlug] = useState<string | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [newSlug, setNewSlug] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [busy, setBusy] = useState(false);

  async function reload() {
    setLoading(true);
    try {
      const r = await api.get('cases');
      setList((r.data || []) as CaseItem[]);
    } catch (e: any) {
      t.err(e?.message || 'Помилка');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { reload(); }, []);

  function slugify(s: string) {
    return s.toLowerCase()
      .replace(/[аеіоуи]/g, (m) => ({ 'а':'a','е':'e','і':'i','о':'o','у':'u','и':'y' }[m] || m))
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .replace(/-+/g, '-')
      .slice(0, 60) || 'case';
  }

  async function createCase() {
    if (busy) return;
    const slug = (newSlug || slugify(newTitle)).trim();
    if (!slug) { t.err('Вкажи slug або назву'); return; }
    if (list.some((c) => c.slug === slug)) { t.err('Кейс з таким slug вже існує'); return; }
    setBusy(true);
    try {
      const next: CaseItem = { ...NEW_CASE, slug, title: newTitle || slug };
      await api.save('cases', [next, ...list]);
      t.ok('Кейс створено');
      setCreateOpen(false); setNewSlug(''); setNewTitle('');
      nav(`/cases/${encodeURIComponent(slug)}`);
    } catch (e: any) {
      t.err(e?.message || 'Не вдалося створити');
    } finally {
      setBusy(false);
    }
  }

  async function removeCase(slug: string) {
    setDelSlug(null);
    try {
      // Видаляємо файли + записи у JSON
      await api.caseDeleteCase(slug);
      const next = list.filter((c) => c.slug !== slug);
      await api.save('cases', next);
      setList(next);
      t.ok('Кейс видалено');
    } catch (e: any) {
      t.err(e?.message || 'Помилка');
    }
  }

  if (loading) return <div className="center-screen"><div className="spinner" /></div>;

  return (
    <>
      <div className="page-head">
        <div>
          <h1>Кейси</h1>
          <p>Реалізовані обʼєкти зі сторінки. Натисни на кейс щоб редагувати назву, метадані та галерею.</p>
        </div>
        <div className="page-actions">
          <button className="btn btn-primary" onClick={() => setCreateOpen(true)}>
            <IcPlus size={14} /> Новий кейс
          </button>
        </div>
      </div>

      <div className="list-table">
        <div className="list-row head">
          <div>Назва</div>
          <div>Локація</div>
          <div>Медіа</div>
          <div style={{ textAlign: 'right' }}>Дії</div>
        </div>
        {list.map((c) => (
          <div className="list-row" key={c.slug} onClick={() => nav(`/cases/${encodeURIComponent(c.slug)}`)}>
            <div>
              <div className="nm">{c.title || c.slug}</div>
              <div className="meta">/{c.slug}</div>
            </div>
            <div className="meta">{c.location || '—'}</div>
            <div className="meta">📷 {c.photos.length} · 🎬 {c.videos.length}</div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 6 }}>
              <button className="icon-btn" onClick={(e) => { e.stopPropagation(); nav(`/cases/${encodeURIComponent(c.slug)}`); }} title="Редагувати">
                <IcEdit size={14} />
              </button>
              <button className="icon-btn danger" onClick={(e) => { e.stopPropagation(); setDelSlug(c.slug); }} title="Видалити">
                <IcTrash size={14} />
              </button>
            </div>
          </div>
        ))}
        {list.length === 0 && (
          <div className="list-row" style={{ gridTemplateColumns: '1fr', cursor: 'default', textAlign: 'center', color: 'var(--c-muted)' }}>
            Поки немає кейсів. Створіть перший вгорі.
          </div>
        )}
      </div>

      <ConfirmDialog
        open={delSlug !== null}
        title="Видалити кейс?"
        message={`Будуть видалені всі фото та відео у /cases/${delSlug}/, а також сам запис.`}
        danger confirmText="Видалити назавжди"
        onConfirm={() => delSlug && removeCase(delSlug)}
        onCancel={() => setDelSlug(null)}
      />

      {createOpen && (
        <div className="modal-bg" onClick={() => setCreateOpen(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Новий кейс</h3>
            <p>Slug використовується у URL-шляху до медіа: <code>/cases/&lt;slug&gt;/</code></p>
            <div className="field" style={{ marginBottom: 12 }}>
              <label style={{ fontSize: 12, color: 'var(--c-muted)' }}>Назва</label>
              <input className="input" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} autoFocus />
            </div>
            <div className="field" style={{ marginBottom: 12 }}>
              <label style={{ fontSize: 12, color: 'var(--c-muted)' }}>Slug (URL)</label>
              <input className="input" value={newSlug} onChange={(e) => setNewSlug(e.target.value)} placeholder={newTitle ? slugify(newTitle) : 'my-case'} />
            </div>
            <div className="modal-actions">
              <button className="btn btn-ghost" onClick={() => setCreateOpen(false)}>Скасувати</button>
              <button className="btn btn-primary" onClick={createCase} disabled={busy}>
                {busy ? 'Створюємо…' : 'Створити'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
