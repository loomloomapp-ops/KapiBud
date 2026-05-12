import Lenis from 'lenis';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { gsap } from 'gsap';

// Lenis-based smooth scroll, інтегрований з GSAP ScrollTrigger.
// Викликати один раз при маунті <App />.
// Повертає функцію cleanup і instance (на випадок anchor-навігації).

let lenisInstance: Lenis | null = null;

export function initSmoothScroll() {
  if (lenisInstance) return lenisInstance;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const lenis = new Lenis({
    duration: reduceMotion ? 0 : 1.05,
    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: !reduceMotion,
    wheelMultiplier: 1,
    touchMultiplier: 1.2,
  });

  // драйв lenis через GSAP ticker, щоб ScrollTrigger завжди був синхронним
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  lenisInstance = lenis;
  return lenis;
}

export function smoothScrollTo(target: HTMLElement | string | number, opts?: { offset?: number }) {
  if (!lenisInstance) return;
  lenisInstance.scrollTo(target, { offset: opts?.offset ?? -10, duration: 1.1 });
}

export function getLenis() {
  return lenisInstance;
}

// Зупиняє/відновлює глобальний smooth-scroll. Викликається при відкритті
// модалок (CaseModal, lead-popup) щоб wheel/touch скролили модалку, а не сайт.
export function pauseSmoothScroll() {
  lenisInstance?.stop();
}
export function resumeSmoothScroll() {
  lenisInstance?.start();
}
