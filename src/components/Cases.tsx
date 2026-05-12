import { useEffect, useState } from 'react';
import { cases, type CaseItem } from '../data/cases';
import { IconZoom, IconChevronLeft, IconChevron } from './Icons';
import { useScrollReveal } from '../anim/useScrollReveal';

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
  const [page, setPage] = useState(0);

  useEffect(() => { if (page > totalPages - 1) setPage(0); }, [perPage, page, totalPages]);
  useScrollReveal('.case-card', { stagger: 0.08 });

  const start = page * perPage;
  const visible = cases.slice(start, start + perPage);

  return (
    <section className="cases" id="cases">
      <div className="cases-head">
        <h2 className="h-title">Перегляньте наші нові кейси і оцініть результат</h2>
      </div>
      <div className="cases-wrap">
        <button
          className="case-nav prev"
          aria-label="Попередній"
          onClick={() => setPage((p) => Math.max(0, p - 1))}
          disabled={page === 0}
        >
          <IconChevronLeft />
        </button>
        <div className="case-track">
          {visible.map((c) => (
            <article key={c.slug} className="case-card" onClick={() => onOpen(c)}>
              <div
                className="ph"
                style={{ backgroundImage: `url(/cases/${c.slug}/${c.photos[0]})` }}
              >
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
        <button
          className="case-nav next"
          aria-label="Наступний"
          onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
          disabled={page >= totalPages - 1}
        >
          <IconChevron />
        </button>
      </div>
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
