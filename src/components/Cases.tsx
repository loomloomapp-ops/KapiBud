import { useEffect, useMemo, useState } from 'react';
import { cases, type CaseItem } from '../data/cases';
import { IconZoom, IconChevronLeft, IconChevron } from './Icons';
import { useScrollReveal } from '../anim/useScrollReveal';
import { useSlider } from '../anim/useSlider';

type Props = { onOpen: (c: CaseItem) => void };

function useColsPerPage() {
  const [n, setN] = useState(3);
  useEffect(() => {
    const calc = () => {
      const w = window.innerWidth;
      setN(w <= 640 ? 1 : w <= 1024 ? 2 : 3);
    };
    calc();
    window.addEventListener('resize', calc);
    return () => window.removeEventListener('resize', calc);
  }, []);
  return n;
}

export default function Cases({ onOpen }: Props) {
  const perPage = useColsPerPage();
  const totalPages = Math.ceil(cases.length / perPage);
  const { page, setPage, viewportRef, dragging, trackStyle, handlers } = useSlider(totalPages);

  useEffect(() => { if (page > totalPages - 1) setPage(0); }, [perPage, page, totalPages, setPage]);
  // Reveal лише першу сторінку — щоб не було «східцевих» offsets на інших слайдах.
  // y:0 (тільки opacity), бо translateY клiпається оверфлоу-вьюпортом і обрізає низ карток.
  useScrollReveal('.case-page:first-child .case-card', { stagger: 0.08, y: 0, duration: 0.6 });

  const groups = useMemo(() => {
    const arr: CaseItem[][] = [];
    for (let i = 0; i < cases.length; i += perPage) arr.push(cases.slice(i, i + perPage));
    return arr;
  }, [perPage]);

  return (
    <section className="cases" id="cases">
      <div className="cases-head">
        <h2 className="h-title">Перегляньте наші нові кейси і оцініть результат</h2>
      </div>
      <div className="cases-wrap">
        <button
          className="case-nav prev"
          aria-label="Попередній"
          onClick={() => setPage((p) => p - 1)}
          disabled={page === 0}
        >
          <IconChevronLeft />
        </button>
        <div
          className={`case-viewport ${dragging ? 'is-dragging' : ''}`}
          ref={viewportRef}
          {...handlers}
        >
          <div className="case-track" style={trackStyle}>
            {groups.map((group, gi) => (
              <div className="case-page" key={gi}>
                {group.map((c) => (
                  <article key={c.slug} className="case-card" onClick={() => onOpen(c)}>
                    <div className="ph">
                      <div
                        className="ph-img"
                        style={{ backgroundImage: `url(/cases/${c.slug}/${c.photos[0]})` }}
                      />
                      <span className="zoom"><IconZoom /></span>
                    </div>
                    <div className="cc-body">
                      <h3>{c.title}</h3>
                      <div className="div" />
                      <div className="meta">
                        <div><div className="k">Бюджет</div><div className="v">{c.budget || '—'}</div></div>
                        <div><div className="k">Дата</div><div className="v">{c.date || '—'}</div></div>
                        <div><div className="k">Площа</div><div className="v">{c.area || '—'}</div></div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            ))}
          </div>
        </div>
        <button
          className="case-nav next"
          aria-label="Наступний"
          onClick={() => setPage((p) => p + 1)}
          disabled={page >= totalPages - 1}
        >
          <IconChevron />
        </button>
      </div>
      {totalPages > 1 && (
        <div className={`swipe-hint ${page > 0 ? 'is-hidden' : ''}`} aria-hidden="true">
          <svg viewBox="0 0 48 28" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M16 14h22" />
            <path d="M30 6l8 8-8 8" />
            <path d="M14 8c-3 2-5 4-5 6s2 4 5 6" opacity=".5" />
          </svg>
          <span>Гортайте</span>
        </div>
      )}
      <div className="case-dots">
        {Array.from({ length: totalPages }).map((_, i) => (
          <span
            key={i}
            className={i === page ? 'on' : ''}
            onClick={() => setPage(i)}
            style={{ cursor: 'pointer' }}
          />
        ))}
      </div>
    </section>
  );
}
