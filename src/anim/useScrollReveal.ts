import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Хук для scroll-reveal анімацій.
 *
 * Раніше була бага: `opts` в dep-масиві → ефект перезапускався на кожному рендері,
 * убивав тви на середині, і елементи зависали напівпрозорі.
 *
 * Виправлення:
 *  - dep лише `selector` (опції беруться при першому маунті)
 *  - `once: true` — анімація грає лише раз, далі ScrollTrigger себе вбиває
 *  - `start: 'top 92%'` — спрацьовує раніше, поки користувач ще доскролює
 *  - cleanup через `gsap.context()` — гарантовано відкочує всі стилі
 */
export function useScrollReveal(selector: string, opts: gsap.TweenVars = {}) {
  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return;

    const ctx = gsap.context(() => {
      const els = gsap.utils.toArray<HTMLElement>(selector);
      if (!els.length) return;
      gsap.from(els, {
        y: 40,
        opacity: 0,
        duration: 0.9,
        ease: 'power3.out',
        ...opts,
        scrollTrigger: {
          trigger: els[0],
          start: 'top 92%',
          once: true,
        },
      });
    });

    // Після того як зображення кейсів довантажились — пересчитати позиції trigger'ів
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener('load', refresh);
    const t = setTimeout(refresh, 300);

    return () => {
      window.removeEventListener('load', refresh);
      clearTimeout(t);
      ctx.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selector]);
}

export { gsap, ScrollTrigger };
