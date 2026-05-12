import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Hook: легке появлення елементів при scroll
export function useScrollReveal(selector: string, opts: gsap.TweenVars = {}) {
  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return;
    const els = gsap.utils.toArray<HTMLElement>(selector);
    const triggers: ScrollTrigger[] = [];
    els.forEach((el) => {
      gsap.from(el, {
        y: 40,
        opacity: 0,
        duration: 0.9,
        ease: 'power3.out',
        ...opts,
        scrollTrigger: {
          trigger: el,
          start: 'top 88%',
          toggleActions: 'play none none reverse',
          onEnter: (st) => triggers.push(st),
        },
      });
    });
    return () => {
      triggers.forEach((t) => t.kill());
      ScrollTrigger.refresh();
    };
  }, [selector, opts]);
}

export { gsap, ScrollTrigger };
