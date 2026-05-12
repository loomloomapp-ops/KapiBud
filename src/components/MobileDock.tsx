export default function MobileDock() {
  return (
    <nav className="dock" aria-label="Швидка навігація">
      <a className="nav-i" href="#prices">
        <svg viewBox="0 0 24 24" stroke="currentColor" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 7l9-4 9 4-9 4-9-4z" />
          <path d="M3 12l9 4 9-4" />
          <path d="M3 17l9 4 9-4" />
        </svg>
        <span>Послуги</span>
      </a>
      <a className="nav-i" href="#cases">
        <svg viewBox="0 0 24 24" stroke="currentColor" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="6" width="18" height="14" rx="2" />
          <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
        </svg>
        <span>Кейси</span>
      </a>
      <a className="dock-cta" href="#estimate">
        Залишити заявку
        <span style={{ width: 10, height: 10, borderRight: '1.5px solid #fff', borderTop: '1.5px solid #fff', transform: 'rotate(45deg)' }} />
      </a>
    </nav>
  );
}
