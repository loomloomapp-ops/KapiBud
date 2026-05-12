import { useEffect, useRef, useState } from 'react';
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
  const lastY = useRef(0);
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const ctx = gsap.context(() => {
      // Селектори без префіксу .site — scope обмежено самим header'ом
      gsap.from('.logo, .nav a, .header-r > *', {
        y: -16, opacity: 0, duration: 0.6, ease: 'power3.out', stagger: 0.05, delay: 0.05,
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  // Sticky + hide-on-scroll-down
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 30);
      if (y > 200 && y > lastY.current + 4) setHidden(true);
      else if (y < lastY.current - 4) setHidden(false);
      else if (y <= 60) setHidden(false);
      lastY.current = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const cls = [
    'site',
    scrolled ? 'is-scrolled' : '',
    hidden ? 'is-hidden' : '',
  ].filter(Boolean).join(' ');

  return (
    <header className={cls} ref={ref}>
      <div className="site-inner">
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
      </div>
    </header>
  );
}

export { Logo };
