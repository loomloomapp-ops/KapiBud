import { useEffect, useRef } from 'react';
import { gsap } from '../anim/useScrollReveal';
import { IconPhone } from './Icons';

const Logo = () => (
  <a href="#top" className="logo" aria-label="KapiBud">
    <div className="mark" />
    <div className="tagline">
      <span>ремонт</span><span className="dot" /><span>дизайн</span><span className="dot" /><span>будівництво</span>
    </div>
  </a>
);

type Props = { onCtaClick: () => void };

export default function Header({ onCtaClick }: Props) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const ctx = gsap.context(() => {
      gsap.from('.site .logo, .site .nav a, .site .header-r > *', {
        y: -16, opacity: 0, duration: 0.7, ease: 'power3.out', stagger: 0.06, delay: 0.05,
      });
    }, ref);
    return () => ctx.revert();
  }, []);
  return (
    <header className="site" ref={ref}>
      <div className="header-l">
        <Logo />
        <nav className="nav">
          <a href="#cases">Проєкти</a>
          <a href="#reviews">Відгуки</a>
          <a href="#prices">Ціни</a>
          <a href="#faq">FaQ</a>
        </nav>
      </div>
      <div className="header-r">
        <a className="phone-tag" href="tel:+380630282440">
          <IconPhone />
          +380 63 028 2440
        </a>
        <button className="btn btn-glass" onClick={onCtaClick}>
          отримати прорахунок <span className="arr" />
        </button>
        <button className="menu-btn" aria-label="Меню" onClick={onCtaClick}>
          <span /><span /><span />
        </button>
      </div>
    </header>
  );
}

export { Logo };
