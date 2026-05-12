import { useEffect, useState } from 'react';
import type { CaseItem } from '../data/cases';
import { IconClose, IconChevron, IconChevronLeft } from './Icons';

type Props = { item: CaseItem | null; onClose: () => void; onEstimate: () => void };

export default function CaseModal({ item, onClose, onEstimate }: Props) {
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

  // Body-scroll lock — окремий effect, dep лише `item`. Раніше у dep був
  // lightboxIdx → cleanup скидав overflow на кожну зміну індексу, і браузер
  // мерехтів від скролбару, що зникав-зʼявлявся (layout shift).
  useEffect(() => {
    if (!item) return;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, [item]);

  // Keyboard навігація — може перереєструватись при кожному зміненні стану.
  useEffect(() => {
    if (!item) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (lightboxIdx !== null) setLightboxIdx(null);
        else onClose();
      } else if (lightboxIdx !== null) {
        const n = allMedia(item).length;
        if (e.key === 'ArrowRight') setLightboxIdx((i) => (i === null ? 0 : (i + 1) % n));
        if (e.key === 'ArrowLeft')  setLightboxIdx((i) => (i === null ? 0 : (i - 1 + n) % n));
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [item, lightboxIdx, onClose]);

  if (!item) return null;
  const media = allMedia(item);

  return (
    <>
      <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
        <div className="case-modal" onClick={(e) => e.stopPropagation()}>
          <div className="head">
            <div>
              <h2>{item.fullTitle}</h2>
              <div className="meta">
                {[item.category, item.location, item.area && `${item.area}`, item.date]
                  .filter(Boolean).join(' · ')}
                {item.budget && <><br />Бюджет: {item.budget}</>}
              </div>
            </div>
            <div className="x" aria-label="Закрити" onClick={onClose}>
              <IconClose width={22} height={22} />
            </div>
          </div>

          <div className="imgs">
            {media.map((m, idx) => (
              <div
                key={`${m.kind}-${m.src}`}
                className={`cell ${m.kind === 'video' ? 'is-video' : ''}`}
                style={m.kind === 'image' ? { backgroundImage: `url(${m.src})` } : undefined}
                role={m.kind === 'image' ? 'img' : undefined}
                aria-label={m.kind === 'image' ? `${item.title} — фото ${idx + 1}` : `${item.title} — відео ${idx + 1}`}
                onClick={() => setLightboxIdx(idx)}
              >
                {m.kind === 'video' && (
                  <>
                    <span className="play" aria-hidden="true">▶</span>
                    <span className="vlabel">Відео</span>
                  </>
                )}
              </div>
            ))}
          </div>

          <div className="actions">
            <button className="btn btn-beige" onClick={onEstimate}>
              отримати прорахунок <span className="arr" />
            </button>
            <button className="btn btn-outline" onClick={onClose}>закрити</button>
          </div>
        </div>
      </div>

      {lightboxIdx !== null && (
        <div className="lightbox" onClick={() => setLightboxIdx(null)}>
          <button className="lb-close" onClick={(e) => { e.stopPropagation(); setLightboxIdx(null); }}>
            <IconClose width={20} height={20} />
          </button>
          <button className="lb-prev" onClick={(e) => {
            e.stopPropagation();
            setLightboxIdx((i) => (i === null ? 0 : (i - 1 + media.length) % media.length));
          }}>
            <IconChevronLeft />
          </button>
          {media[lightboxIdx].kind === 'image' ? (
            <img
              src={media[lightboxIdx].src}
              alt={`${item.title} — фото ${lightboxIdx + 1} з ${media.length}`}
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <video
              src={media[lightboxIdx].src}
              controls
              autoPlay
              aria-label={`${item.title} — відео`}
              onClick={(e) => e.stopPropagation()}
            />
          )}
          <button className="lb-next" onClick={(e) => {
            e.stopPropagation();
            setLightboxIdx((i) => (i === null ? 0 : (i + 1) % media.length));
          }}>
            <IconChevron />
          </button>
          <div className="lb-counter">{lightboxIdx + 1} / {media.length}</div>
        </div>
      )}
    </>
  );
}

function allMedia(item: CaseItem): Array<{ kind: 'image' | 'video'; src: string }> {
  return [
    ...item.photos.map((p) => ({ kind: 'image' as const, src: `/cases/${item.slug}/${p}` })),
    ...item.videos.map((v) => ({ kind: 'video' as const, src: `/cases/${item.slug}/${v}` })),
  ];
}
