import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../lib/auth';
import {
  IcLayers, IcFolderOpen, IcMessageSquare, IcTag, IcHelp, IcUsers, IcLogout, IcMessageCircle,
} from './icons';

const NAV = [
  { to: '/services', label: 'Послуги', Ico: IcLayers },
  { to: '/cases',    label: 'Кейси',   Ico: IcFolderOpen },
  { to: '/plans',    label: 'Тарифи',  Ico: IcTag },
  { to: '/reviews',  label: 'Відгуки', Ico: IcMessageSquare },
  { to: '/faq',      label: 'FAQ',     Ico: IcHelp },
  { to: '/partners', label: 'Партнери',Ico: IcUsers },
  { to: '/widget',   label: 'Віджет/PDF', Ico: IcMessageCircle },
];

export default function Layout() {
  const { user, logout } = useAuth();
  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark" />
          <div className="brand-text">
            PrimeBud
            <small>Адмін-панель</small>
          </div>
        </div>
        {NAV.map(({ to, label, Ico }) => (
          <NavLink key={to} to={to} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <span className="icon"><Ico size={16} /></span>
            <span className="lbl">{label}</span>
          </NavLink>
        ))}
        <div className="spacer" />
        <button className="logout" type="button" onClick={() => { void logout(); }}>
          <IcLogout size={14} />
          <span>Вийти ({user})</span>
        </button>
      </aside>
      <main className="main">
        <Outlet />
      </main>
    </div>
  );
}
