import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../lib/api';
import { useToast, useTry, useUnsavedGuard } from '../lib/toast';
import SaveBar from '../components/SaveBar';
import ConfirmDialog from '../components/ConfirmDialog';
import { IcArrowLeft, IcUpload, IcTrash, IcCheck } from '../components/icons';

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

type Media = { photos: string[]; videos: string[] };

export default function CaseEdit() {
  const { slug = '' } = useParams();
  const nav = useNavigate();
  const t = useToast();
  const tryDo = useTry();

  const [allCases, setAllCases] = useState<CaseItem[]>([]);
  const [original, setOrig] = useState<CaseItem | null>(null);
  const [draft, setDraft] = useState<CaseItem | null>(null);
  const [media, setMedia] = useState<Media>({ photos: [], videos: [] });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [delMedia, setDelMedia] = useState<{ kind: 'photo' | 'video'; name: string } | null>(null);
  const [drag, setDrag] = useState(false);
  const [bust, setBust] = useState(0);
  const fileRef = useRef<HTMLInputElement>(null);

  const mediaDirty = !!original && (
    JSON.stringify(media.photos) !== JSON.stringify(original.photos || []) ||
    JSON.stringify(media.videos) !== JSON.stringify(original.videos || [])
  );
  const dirty = JSON.stringify(draft) !== JSON.stringify(original) || mediaDirty;
  useUnsavedGuard(dirty);

  // Зливаємо: спочатку файли в порядку JSON (які ще існують на диску),
  // потім нові з FS, яких немає в JSON — у хвіст. Так збережений порядок
  // редактора не губиться після reload.
  function mergeOrder(jsonList: string[] | undefined, fsList: string[]): string[] {
    const fsSet = new Set(fsList);
    const ordered = (jsonList || []).filter((n) => fsSet.has(n));
    const orderedSet = new Set(ordered);
    const extras = fsList.filter((n) => !orderedSet.has(n));
    return [...ordered, ...extras];
  }

  const reloadMedia = useCallback(async () => {
    const [m, cRes] = await Promise.all([
      tryDo(() => api.caseListMedia(slug)),
      tryDo(() => api.get('cases')),
    ]);
    if (cRes) {
      const cases = (cRes.data || []) as CaseItem[];
      const c = cases.find((x) => x.slug === slug);
      setAllCases(cases);
      if (c && m) {
        const photos = mergeOrder(c.photos, m.photos || []);
        const videos = mergeOrder(c.videos, m.videos || []);
        setMedia({ photos, videos });
        setBust(Date.now());
        setOrig((prev) => prev ? { ...prev, photos, videos } : { ...c, photos, videos });
        setDraft((prev) => prev ? { ...prev, photos, videos } : { ...c, photos, videos });
      } else if (m) {
        setMedia({ photos: m.photos || [], videos: m.videos || [] });
        setBust(Date.now());
      }
    } else if (m) {
      setMedia({ photos: m.photos || [], videos: m.videos || [] });
      setBust(Date.now());
    }
  }, [slug, tryDo]);

  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      try {
        const [cRes, mRes] = await Promise.all([api.get('cases'), api.caseListMedia(slug)]);
        if (!alive) return;
        let cases = (cRes.data || []) as CaseItem[];
        const fsPhotos: string[] = mRes.photos || [];
        const fsVideos: string[] = mRes.videos || [];
        let c = cases.find((x) => x.slug === slug) || null;

        // Авто-синк: тримаємо порядок із JSON, з FS додаємо лиш ті, яких бракує.
        if (c) {
          const mergedPhotos = mergeOrder(c.photos, fsPhotos);
          const mergedVideos = mergeOrder(c.videos, fsVideos);
          const changed =
            JSON.stringify(mergedPhotos) !== JSON.stringify(c.photos || []) ||
            JSON.stringify(mergedVideos) !== JSON.stringify(c.videos || []);
          if (changed) {
            const updated = { ...c, photos: mergedPhotos, videos: mergedVideos };
            cases = cases.map((x) => x.slug === slug ? updated : x);
            await api.save('cases', cases).catch(() => {});
            c = updated;
          }
        }

        setAllCases(cases);
        setOrig(c);
        setDraft(c ? structuredClone(c) : null);
        setMedia({ photos: c?.photos || fsPhotos, videos: c?.videos || fsVideos });
      } catch (e: any) {
        t.err(e?.message || 'Помилка завантаження');
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [slug]);

  if (loading) return <div className="center-screen"><div className="spinner" /></div>;
  if (!draft) return (
    <>
      <div className="page-head">
        <div>
          <h1>Кейс не знайдено</h1>
          <p>Slug: <code>{slug}</code></p>
        </div>
        <div className="page-actions">
          <button className="btn btn-ghost" onClick={() => nav('/cases')}><IcArrowLeft size={14} /> Назад</button>
        </div>
      </div>
    </>
  );

  function upd<K extends keyof CaseItem>(k: K, v: CaseItem[K]) {
    setDraft({ ...draft!, [k]: v });
  }

  // Зберігаємо: оновлюємо запис у списку та надсилаємо повний список
  async function save() {
    if (saving || !draft) return;
    setSaving(true);
    try {
      const updated: CaseItem = {
        ...draft,
        photos: media.photos,
        videos: media.videos,
      };
      const next = allCases.map((c) => c.slug === slug ? updated : c);
      await api.save('cases', next);
      setAllCases(next);
      setOrig(updated);
      setDraft(updated);
      t.ok('Збережено');
    } catch (e: any) {
      t.err(e?.message || 'Не вдалося зберегти');
    } finally {
      setSaving(false);
    }
  }

  async function uploadFiles(files: FileList | File[]) {
    const arr = Array.from(files);
    let okCnt = 0;
    for (const f of arr) {
      const r = await tryDo(() => api.caseUpload(slug, f));
      if (r) okCnt++;
    }
    if (okCnt) {
      t.ok(`Завантажено: ${okCnt}`);
      await reloadMedia();
    }
  }

  function movePhoto(idx: number, dir: -1 | 1) {
    setMedia((m) => {
      const arr = [...m.photos];
      const j = idx + dir;
      if (j < 0 || j >= arr.length) return m;
      [arr[idx], arr[j]] = [arr[j], arr[idx]];
      return { ...m, photos: arr };
    });
  }

  function setCover(idx: number) {
    setMedia((m) => {
      if (idx <= 0 || idx >= m.photos.length) return m;
      const arr = [...m.photos];
      const [picked] = arr.splice(idx, 1);
      arr.unshift(picked);
      return { ...m, photos: arr };
    });
  }

  async function removeMediaFile() {
    if (!delMedia) return;
    const r = await tryDo(() => api.caseDeleteMedia(slug, delMedia.name));
    if (r) {
      t.ok('Видалено');
      await reloadMedia();
    }
    setDelMedia(null);
  }

  // Cache-buster для img/video src — оновлюється після reloadMedia(),
  // щоб новозалиті файли не натикались на 404, який кешує браузер.
  const baseUrl = `/cases/${slug}`;

  return (
    <>
      <div className="page-head">
        <div>
          <h1>{draft.title || slug}</h1>
          <p><code>/{slug}</code> — фото та відео живуть у <code>/cases/{slug}/</code></p>
        </div>
        <div className="page-actions">
          <button className="btn btn-ghost" onClick={() => nav('/cases')}><IcArrowLeft size={14} /> До списку</button>
        </div>
      </div>

      <div className="row-card">
        <div className="row-card-head">
          <h3>Інформація</h3>
        </div>
        <div className="field-row">
          <div className="field-label">Назва (коротка)</div>
          <input className="input" value={draft.title} onChange={(e) => upd('title', e.target.value)} />
        </div>
        <div className="field-row">
          <div className="field-label">
            Повна назва
            <span className="hint">У модалці кейсу</span>
          </div>
          <input className="input" value={draft.fullTitle} onChange={(e) => upd('fullTitle', e.target.value)} />
        </div>
        <div className="field-row">
          <div className="field-label">Категорія</div>
          <select className="select" value={draft.category} onChange={(e) => upd('category', e.target.value as CaseItem['category'])}>
            <option>Квартира</option>
            <option>Будинок</option>
            <option>Комерційний</option>
          </select>
        </div>
        <div className="field-row">
          <div className="field-label">Локація</div>
          <input className="input" value={draft.location} onChange={(e) => upd('location', e.target.value)} />
        </div>
        <div className="field-row">
          <div className="field-label">Дата</div>
          <input className="input" value={draft.date} onChange={(e) => upd('date', e.target.value)} placeholder="2025 рік" />
        </div>
        <div className="field-row">
          <div className="field-label">Бюджет</div>
          <input className="input" value={draft.budget} onChange={(e) => upd('budget', e.target.value)} placeholder="6400000 грн" />
        </div>
        <div className="field-row">
          <div className="field-label">Площа</div>
          <input className="input" value={draft.area} onChange={(e) => upd('area', e.target.value)} placeholder="360м2" />
        </div>
      </div>

      <div className="row-card">
        <div className="row-card-head">
          <h3>Медіа</h3>
          <div className="row-card-actions">
            <input
              ref={fileRef}
              type="file"
              accept="image/*,video/*"
              multiple
              style={{ display: 'none' }}
              onChange={(e) => { if (e.target.files) uploadFiles(e.target.files); e.target.value = ''; }}
            />
            <button className="btn btn-ghost btn-sm" onClick={() => fileRef.current?.click()}>
              <IcUpload size={14} /> Завантажити
            </button>
          </div>
        </div>

        <div
          className={`dropzone ${drag ? 'drag' : ''}`}
          onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
          onDragLeave={() => setDrag(false)}
          onDrop={(e) => { e.preventDefault(); setDrag(false); if (e.dataTransfer.files.length) uploadFiles(e.dataTransfer.files); }}
          onClick={() => fileRef.current?.click()}
          style={{ marginBottom: 16 }}
        >
          Перетягніть фото/відео сюди або клікніть, щоб обрати
        </div>

        {(media.photos.length > 0 || media.videos.length > 0) ? (
          <div className="media-grid">
            {media.photos.map((n, i) => (
              <div className={`media-tile ${i === 0 ? 'is-cover' : ''}`} key={`p:${n}`}>
                <img
                  key={`p:${n}:${bust}`}
                  src={`${baseUrl}/${n}${bust ? `?v=${bust}` : ''}`}
                  alt={n}
                  loading="lazy"
                />
                <span className="badge">{i === 0 ? 'обкладинка' : `фото · ${i + 1}`}</span>
                <div className="media-ord">
                  <button type="button" title="Вліво" disabled={i === 0} onClick={() => movePhoto(i, -1)}>‹</button>
                  <button type="button" title="Вправо" disabled={i === media.photos.length - 1} onClick={() => movePhoto(i, 1)}>›</button>
                  {i !== 0 && (
                    <button type="button" className="cover-btn" title="Зробити обкладинкою" onClick={() => setCover(i)}>
                      <IcCheck size={12} />
                    </button>
                  )}
                </div>
                <button className="del" title="Видалити" onClick={() => setDelMedia({ kind: 'photo', name: n })}>
                  <IcTrash size={12} />
                </button>
              </div>
            ))}
            {media.videos.map((n) => (
              <div className="media-tile" key={`v:${n}`}>
                <video
                  key={`v:${n}:${bust}`}
                  src={`${baseUrl}/${n}${bust ? `?v=${bust}` : ''}`}
                  muted
                  preload="metadata"
                />
                <span className="badge">відео</span>
                <button className="del" title="Видалити" onClick={() => setDelMedia({ kind: 'video', name: n })}>
                  <IcTrash size={12} />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', color: 'var(--c-muted)', padding: '40px 0' }}>
            Поки немає медіа. Завантажте перші файли.
          </div>
        )}
      </div>

      <SaveBar dirty={dirty} saving={saving} onSave={save} />

      <ConfirmDialog
        open={!!delMedia}
        title="Видалити файл?"
        message={delMedia?.name}
        danger confirmText="Видалити"
        onConfirm={removeMediaFile}
        onCancel={() => setDelMedia(null)}
      />
    </>
  );
}
