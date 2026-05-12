import { useEffect, useRef, useState } from 'react';
import { IconPhone, IconClose } from './Icons';

const Logo = () => (
  <a href="#top" className="logo" aria-label="KapiBud — на головну">
    <div className="mark" role="img" aria-label="Логотип KapiBud" />
  </a>
);

type Props = { onCtaClick: () => void };

export default function Header({ onCtaClick }: Props) {
  const ref = useRef<HTMLElement>(null);
  const lastY = useRef(0);
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

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

  // lock body scroll while drawer is open + Esc to close
  useEffect(() => {
    if (!menuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setMenuOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => { document.body.style.overflow = prev; window.removeEventListener('keydown', onKey); };
  }, [menuOpen]);

  const cls = [
    'site',
    scrolled ? 'is-scrolled' : '',
    hidden ? 'is-hidden' : '',
  ].filter(Boolean).join(' ');

  function closeAndScroll(handler?: () => void) {
    return () => {
      setMenuOpen(false);
      handler?.();
    };
  }

  return (
    <>
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
            <button
              className={`menu-btn ${menuOpen ? 'is-open' : ''}`}
              aria-label={menuOpen ? 'Закрити меню' : 'Меню'}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((v) => !v)}
            >
              <span /><span /><span />
            </button>
          </div>
        </div>
      </header>

      <div className={`menu-drawer ${menuOpen ? 'is-open' : ''}`} aria-hidden={!menuOpen}>
        <button className="md-close" aria-label="Закрити" onClick={() => setMenuOpen(false)}>
          <IconClose />
        </button>
        <nav className="md-nav">
          <a href="#cases" onClick={closeAndScroll()}>Проєкти</a>
          <a href="#reviews" onClick={closeAndScroll()}>Відгуки</a>
          <a href="#prices" onClick={closeAndScroll()}>Ціни</a>
          <a href="#faq" onClick={closeAndScroll()}>FaQ</a>
        </nav>
        <div className="md-foot">
          <a className="md-phone" href="tel:+380630282440">
            <IconPhone /> +380 63 028 2440
          </a>
          <button
            className="btn btn-beige md-cta"
            onClick={closeAndScroll(onCtaClick)}
          >
            отримати прорахунок <span className="arr" />
          </button>
        </div>
      </div>
      <div
        className={`menu-backdrop ${menuOpen ? 'is-open' : ''}`}
        onClick={() => setMenuOpen(false)}
        aria-hidden="true"
      />
    </>
  );
}

export { Logo };
