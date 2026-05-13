import { useEffect, useState } from 'react';
import { sendLead } from '../lib/lead';
import { formatPhone } from '../lib/phoneMask';

const PHONE_DIGITS = '380630282440';

export default function FloatingWidgets() {
  const [open, setOpen] = useState(false);
  const [showTop, setShowTop] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'ok' | 'err'>('idle');

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 600);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status === 'sending') return;
    if (!name.trim() || !phone.trim()) return;
    setStatus('sending');
    const r = await sendLead({ source: 'floating-widget', name, phone });
    setStatus(r.ok ? 'ok' : 'err');
    if (r.ok) { setName(''); setPhone(''); }
  }

  function scrollTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <>
      <div className="fw">
        {!open && (
          <button className="fw-trigger" type="button" onClick={() => setOpen(true)} aria-label="Відкрити чат">
            <div className="fw-trigger-avatar" />
            <div className="fw-trigger-text">
              <span>Потрібна допомога?</span>
              <span className="fw-trigger-status"><span className="fw-dot" />Зараз онлайн</span>
            </div>
          </button>
        )}

        {open && (
          <div className="fw-panel" role="dialog" aria-label="Швидкий контакт">
            <button className="fw-close" aria-label="Закрити" type="button" onClick={() => setOpen(false)}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
            <div className="fw-head">
              <div className="fw-avatar" />
              <div>
                <div className="fw-agent-name">Олена</div>
                <div className="fw-status"><span className="fw-dot" />Зараз онлайн</div>
              </div>
            </div>
            <p className="fw-intro">Привіт! Залиште контакти — підкажемо вартість ремонту та допоможемо обрати оптимальне рішення.</p>
            <form onSubmit={onSubmit} noValidate>
              <div className="fw-field">
                <input
                  placeholder="Ваше імʼя"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="fw-field">
                <input
                  placeholder="+38 (0__) ___ __ __"
                  type="tel"
                  inputMode="tel"
                  value={phone}
                  onChange={(e) => setPhone(formatPhone(e.target.value))}
                  onFocus={() => { if (!phone) setPhone('+38 (0'); }}
                  required
                />
              </div>
              {status === 'ok' && <div className="fw-msg ok">Дякуємо! Зателефонуємо найближчим часом.</div>}
              {status === 'err' && <div className="fw-msg err">Помилка відправки. Спробуйте ще раз.</div>}
              <button type="submit" className="fw-submit" disabled={status === 'sending'}>
                {status === 'sending' ? 'Відправляємо…' : 'Отримати консультацію'}
              </button>
            </form>
            <div className="fw-alts">
              <a href={`https://wa.me/${PHONE_DIGITS}`} className="fw-alt fw-wa" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
                <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.118 1.523 5.847L.057 23.882a.5.5 0 0 0 .611.61l6.101-1.456A11.945 11.945 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.891 0-3.667-.498-5.2-1.37l-.373-.214-3.868.924.944-3.786-.234-.389A9.953 9.953 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/></svg>
                WhatsApp
              </a>
              <a href={`viber://chat?number=%2B${PHONE_DIGITS}`} className="fw-alt fw-viber" aria-label="Viber">
                <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M19.4 4.6C17.8 3 15.1 2 12 2 8.9 2 6.2 3 4.6 4.6 3 6.3 2.3 8.7 2.3 11.5c0 2.7.7 5 2.1 6.7v3.2c0 .3.3.5.6.4l2.6-1.2c1.4.5 2.9.7 4.4.7 3.1 0 5.8-1 7.5-2.6 1.6-1.7 2.3-4 2.3-6.8 0-2.8-.7-5.2-2.4-7.3z"/></svg>
                Viber
              </a>
              <a href={`tel:+${PHONE_DIGITS}`} className="fw-alt fw-tg" aria-label="Телефон">
                <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M20 15.5c-1.2 0-2.4-.2-3.6-.6-.3-.1-.7 0-1 .2l-2 2c-2.6-1.3-4.8-3.5-6.2-6.2l2-2c.2-.3.3-.7.2-1-.4-1.1-.6-2.3-.6-3.5 0-.6-.5-1-1-1H4.5c-.6 0-1.1.4-1.1 1C3.4 13.4 10.6 20.6 19.5 20.6c.6 0 1-.5 1-1.1V16.5c0-.5-.4-1-1-1z"/></svg>
                Телефон
              </a>
            </div>
          </div>
        )}
      </div>

      <button
        className={`scroll-top ${showTop ? 'visible' : ''}`}
        type="button"
        onClick={scrollTop}
        aria-label="Догори"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m18 15-6-6-6 6" />
        </svg>
      </button>
    </>
  );
}
