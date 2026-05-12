import { useEffect, useState } from 'react';

// ── PRIME BUD preloader ──────────────────────────────────────────────
// Щоб поміняти бренд / кольори / тайминги:
//   • Текст: змініть константу BRAND нижче
//   • Кольори: див. CSS-блок `.preloader` у global.css (CSS-змінні --pre-*)
//   • Мінімальний час показу: MIN_DISPLAY_MS
//   • Запобіжник на випадок «зависання» window.load: SAFETY_TIMEOUT_MS
// ─────────────────────────────────────────────────────────────────────
const BRAND = 'PRIME BUD';
const MIN_DISPLAY_MS = 3200;
const SAFETY_TIMEOUT_MS = 7000;
const FADE_OUT_MS = 900;

export default function Preloader() {
  const [hidden, setHidden] = useState(false);
  const [removed, setRemoved] = useState(false);

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const minTime = reduceMotion ? 400 : MIN_DISPLAY_MS;
    const startedAt = performance.now();

    document.body.classList.add('is-loading');

    let hidTimer: number | undefined;
    let removeTimer: number | undefined;

    const hide = () => {
      const elapsed = performance.now() - startedAt;
      const wait = Math.max(0, minTime - elapsed);
      hidTimer = window.setTimeout(() => {
        setHidden(true);
        document.body.classList.remove('is-loading');
        document.body.classList.add('loaded');
        // Сповіщаємо інші компоненти (Hero), що прелоадер починає зникати.
        window.dispatchEvent(new CustomEvent('preloader-done'));
        removeTimer = window.setTimeout(() => setRemoved(true), FADE_OUT_MS);
      }, wait);
    };

    const onLoad = () => hide();

    if (document.readyState === 'complete') {
      hide();
    } else {
      window.addEventListener('load', onLoad);
    }
    const safety = window.setTimeout(hide, SAFETY_TIMEOUT_MS);

    return () => {
      window.removeEventListener('load', onLoad);
      window.clearTimeout(safety);
      if (hidTimer) window.clearTimeout(hidTimer);
      if (removeTimer) window.clearTimeout(removeTimer);
      document.body.classList.remove('is-loading');
    };
  }, []);

  if (removed) return null;

  return (
    <div className={`preloader ${hidden ? 'is-hidden' : ''}`} aria-hidden="true" role="presentation">
      <div className="preloader-bg" />
      <div className="preloader-grain" />
      <div className="preloader-content">
        <svg className="preloader-mark" viewBox="0 0 200 120" fill="none" aria-hidden="true">
          <path className="p-line" d="M10 100 L190 100" />
          <path className="p-house" d="M10 100 L10 60 L100 18 L190 60 L190 100" />
          <path className="p-door" d="M85 100 L85 72 L115 72 L115 100" />
          <path className="p-window-l" d="M30 78 L55 78 L55 90 L30 90 Z" />
          <path className="p-window-r" d="M145 78 L170 78 L170 90 L145 90 Z" />
        </svg>

        {/* Handwriting reveal: stroke-пропис → metallic gold fill */}
        <svg
          className="preloader-handwrite"
          viewBox="0 0 600 100"
          aria-label={BRAND}
          role="img"
        >
          <text x="50%" y="68" textAnchor="middle" className="hw-text">{BRAND}</text>
        </svg>

        <div className="preloader-progress">
          <div className="preloader-progress-bar" />
        </div>
      </div>
    </div>
  );
}
