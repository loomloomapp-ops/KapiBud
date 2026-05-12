import { useEffect, useMemo, useState } from 'react';
import { IconChevron, IconChevronLeft } from './Icons';
import { useScrollReveal } from '../anim/useScrollReveal';
import { useSlider } from '../anim/useSlider';

const REVIEWS = [
  { nm: 'Іван Коваленко', when: '2 дні тому',    av: 'av-1', text: 'Дуже задоволений роботою. Все зробили в обумовлені терміни, без затримок і "сюрпризів" по бюджету. Команда реально знає свою справу' },
  { nm: 'Олена І.',       when: 'тиждень тому',   av: '#C8B89F', text: 'Команда відповідальна, чітко тримала строки. Дуже сподобалось, що менеджер тримав мене в курсі кожного етапу робіт' },
  { nm: 'Дмитро Зайцев',  when: '3 тижні тому',   av: '#B7A48A', text: 'Зробили ремонт квартири під оренду — все підрахували заздалегідь, обійшлось без додаткових витрат. Чесно і професійно' },
  { nm: 'Марина Д.',      when: 'місяць тому',    av: '#A39177', text: 'Дуже вдячна команді KapiBud. Якісно, чесно і з повагою до кожної дрібниці. Рекомендую всім, хто шукає надійних підрядників' },
  { nm: 'Олександр П.',   when: 'місяць тому',    av: '#C8B89F', text: 'Ремонт зробили дуже швидко, без проколів. Все під ключ — від чорнової до фінальної. Дуже задоволений!' },
  { nm: 'Юлія К.',        when: '2 місяці тому',  av: '#B7A48A', text: 'Спасибі за уважність до деталей. Кожен крок узгоджували, ніяких неочікуваних витрат. Раджу!' },
];

function useCols() {
  const [n, setN] = useState(4);
  useEffect(() => {
    const calc = () => {
      const w = window.innerWidth;
      setN(w <= 640 ? 1 : w <= 1280 ? 2 : 4);
    };
    calc();
    window.addEventListener('resize', calc);
    return () => window.removeEventListener('resize', calc);
  }, []);
  return n;
}

export default function Reviews() {
  const cols = useCols();
  const totalPages = Math.ceil(REVIEWS.length / cols);
  const { page, setPage, viewportRef, dragging, trackStyle, handlers } = useSlider(totalPages);
  useScrollReveal('.reviews-track > .review-cards:first-child .r-card', { stagger: 0.06, y: 0, duration: 0.6 });
  useEffect(() => { if (page > totalPages - 1) setPage(0); }, [cols, page, totalPages, setPage]);

  const groups = useMemo(() => {
    const arr: typeof REVIEWS[] = [];
    for (let i = 0; i < REVIEWS.length; i += cols) arr.push(REVIEWS.slice(i, i + cols));
    return arr;
  }, [cols]);

  return (
    <section className="reviews" id="reviews">
      <h2>Відгуки, які говорять краще за будь-яку рекламу</h2>
      <p className="sub">
        Реальні відгуки клієнтів, які вже пройшли цей шлях з нами — без стресу, затримок і неприємних сюрпризів, отримавши результат, який перевершив очікування
      </p>

      <div className="reviews-wrap">
        <button className="arrow-btn" aria-label="prev" onClick={() => setPage((p) => p - 1)}>
          <IconChevronLeft />
        </button>
        <div
          className={`reviews-viewport ${dragging ? 'is-dragging' : ''}`}
          ref={viewportRef}
          {...handlers}
        >
          <div className="reviews-track" style={trackStyle}>
            {groups.map((group, gi) => (
              <div className="review-cards" key={gi} style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
                {group.map((r) => (
                  <div className="r-card" key={r.nm + r.when}>
                    <div className="hd">
                      <div
                        className={`av ${r.av.startsWith('#') ? '' : r.av}`}
                        style={r.av.startsWith('#') ? { background: r.av } : undefined}
                      />
                      <div>
                        <div className="nm">{r.nm}</div>
                        <div className="when">{r.when}</div>
                      </div>
                      <svg className="more" viewBox="0 0 20 20" fill="currentColor">
                        <circle cx="4" cy="10" r="1.5" />
                        <circle cx="10" cy="10" r="1.5" />
                        <circle cx="16" cy="10" r="1.5" />
                      </svg>
                    </div>
                    <div className="stars">★★★★★</div>
                    <p>{r.text}</p>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
        <button className="arrow-btn" aria-label="next" onClick={() => setPage((p) => p + 1)}>
          <IconChevron />
        </button>
      </div>
      <div className="pagination">
        {Array.from({ length: totalPages }).map((_, i) => (
          <span key={i} className={i === page ? 'on' : ''} />
        ))}
      </div>
    </section>
  );
}
