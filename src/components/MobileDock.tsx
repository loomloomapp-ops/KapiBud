import { useEffect, useState } from 'react';
import { IconClose, IconUser, IconCallSmall } from './Icons';
import { sendLead } from '../lib/lead';
import { formatPhone } from '../lib/phoneMask';
import { pauseSmoothScroll, resumeSmoothScroll } from '../anim/smoothScroll';

export default function MobileDock() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [comment, setComment] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'ok' | 'err'>('idle');

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    pauseSmoothScroll();
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') close(); };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      resumeSmoothScroll();
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  function close() {
    setOpen(false);
    setTimeout(() => {
      setStatus('idle');
      setName(''); setPhone(''); setComment('');
    }, 200);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (status === 'sending') return;
    if (!name.trim() || !phone.trim()) return;
    setStatus('sending');
    const r = await sendLead({
      source: 'cta',
      name, phone, message: comment,
    });
    setStatus(r.ok ? 'ok' : 'err');
  }

  return (
    <>
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
        <button type="button" className="dock-cta" onClick={() => setOpen(true)}>
          Залишити заявку
          <span style={{ width: 10, height: 10, borderRight: '1.5px solid #fff', borderTop: '1.5px solid #fff', transform: 'rotate(45deg)' }} />
        </button>
      </nav>

      {open && (
        <div className="modal-overlay" onClick={close} data-lenis-prevent>
          <div className="lead-popup" onClick={(e) => e.stopPropagation()} data-lenis-prevent>
            <button className="x" type="button" onClick={close} aria-label="Закрити"><IconClose /></button>
            <h3>Залишити заявку</h3>
            <p className="sub">Залиште контакти — ми зателефонуємо вам найближчим часом та підготуємо прорахунок.</p>
            <form onSubmit={submit} className="lead-form">
              <div className="hf-field">
                <label>Ім'я*</label>
                <div className="ctl">
                  <IconUser />
                  <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ваше ім'я" required />
                </div>
              </div>
              <div className="hf-field">
                <label>Номер телефону*</label>
                <div className="ctl">
                  <IconCallSmall />
                  <input value={phone} onChange={(e) => setPhone(formatPhone(e.target.value))} onFocus={() => { if (!phone) setPhone('+38 (0'); }} placeholder="+38 (0__) ___ __ __" type="tel" inputMode="tel" required />
                </div>
              </div>
              <div className="hf-field">
                <label>Додатковий коментар</label>
                <textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Коротко опишіть ваш об'єкт" />
              </div>
              {status === 'ok' && <div className="hf-success">Дякуємо! Менеджер передзвонить найближчим часом.</div>}
              {status === 'err' && <div className="hf-error">Помилка відправки. Спробуйте ще раз.</div>}
              <button className="hf-submit" type="submit" disabled={status === 'sending'}>
                {status === 'sending' ? 'Відправляємо…' : 'Залишити заявку'} <span className="arr" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
