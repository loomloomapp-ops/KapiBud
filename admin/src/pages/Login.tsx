import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/auth';

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr('');
    setBusy(true);
    try {
      await login(user, pass);
      nav('/services', { replace: true });
    } catch (e: any) {
      setErr(e?.message || 'Помилка входу');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="login-screen">
      <form className="login-card" onSubmit={onSubmit}>
        <h1>PrimeBud · Адмінка</h1>
        <p className="sub">Увійдіть, щоб редагувати контент сайту.</p>
        <div className="field">
          <label>Логін</label>
          <input className="input" autoComplete="username" autoFocus
                 value={user} onChange={(e) => setUser(e.target.value)} />
        </div>
        <div className="field">
          <label>Пароль</label>
          <input className="input" type="password" autoComplete="current-password"
                 value={pass} onChange={(e) => setPass(e.target.value)} />
        </div>
        {err && <div className="err">{err}</div>}
        <button className="btn btn-primary" type="submit" disabled={busy}
                style={{ width: '100%', marginTop: 12 }}>
          {busy ? 'Входимо…' : 'Увійти'}
        </button>
      </form>
    </div>
  );
}
