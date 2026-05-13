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
                <span className="fw-alt-ico">
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                    <path d="M.057 24l1.687-6.163a11.867 11.867 0 0 1-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.817 11.817 0 0 1 8.413 3.488 11.824 11.824 0 0 1 3.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 0 1-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 0 0 1.51 5.26l-.999 3.648 3.978-.607zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.296-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                  </svg>
                </span>
                <span className="fw-alt-lbl">WhatsApp</span>
              </a>
              <a href={`viber://chat?number=%2B${PHONE_DIGITS}`} className="fw-alt fw-viber" aria-label="Viber">
                <span className="fw-alt-ico">
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                    <path d="M11.398.002C9.473.028 5.331.344 3.014 2.467 1.293 4.187.687 6.7.621 9.819c-.06 3.11-.144 8.946 5.481 10.541v2.42s-.041.97.6 1.169c.78.241 1.234-.502 1.97-1.303l1.42-1.603c3.844.319 6.795-.42 7.131-.529.776-.252 5.166-.815 5.879-6.642.736-6.008-.36-9.808-2.34-11.521-.595-.547-2.989-2.291-8.328-2.311 0 0-.395-.025-1.236-.013zm.066 1.711c.713-.004 1.045.013 1.045.013 4.518.016 6.682 1.378 7.187 1.836 1.674 1.434 2.527 4.861 1.905 9.881-.602 4.871-4.16 5.181-4.816 5.39-.279.092-2.871.736-6.131.524 0 0-2.428 2.931-3.186 3.694-.117.124-.258.166-.348.146-.131-.031-.166-.183-.166-.404l.025-4.013c-4.756-1.317-4.479-6.286-4.428-8.884.055-2.598.547-4.726 2.004-6.167 1.957-1.769 5.475-2 6.908-2.013l.002-.002zm.563 2.503c-.225 0-.225.344 0 .344 1.733.018 3.156.617 4.299 1.741 1.187 1.187 1.776 2.779 1.797 4.755 0 .219.344.219.344 0v-.005c-.025-2.069-.645-3.717-1.886-4.946-1.198-1.188-2.715-1.79-4.554-1.889zm.062 1.198c-.221.018-.232.354-.005.358 2.305.157 3.41 1.297 3.65 3.667.023.221.343.215.343-.005l-.005-.001c.026-2.483-1.302-3.864-3.984-4.018zm.151 1.231c-.221.005-.244.343-.026.354 1.396.082 2.077.78 2.146 2.252.005.219.343.215.348-.006v-.005c-.078-1.685-.93-2.567-2.467-2.594zm-4.834.563a.96.96 0 0 0-.661.224h-.005c-.428.359-.732.832-1.026 1.413-.292.566-.452 1.142-.516 1.706-.024.323.044.654.197.948.275.617.747 1.205 1.225 1.737 1.225 1.376 2.747 2.398 4.469 2.999.354.119.713.182 1.076.205.297.013.594-.083.836-.247.412-.276.78-.61 1.073-.985.18-.198.292-.456.323-.738.014-.18-.024-.354-.119-.5-.144-.198-.348-.354-.566-.5-.464-.292-.948-.567-1.413-.806-.292-.156-.583-.156-.806.118l-.481.6c-.245.297-.713.292-.713.292-3.41-.872-4.321-4.326-4.321-4.326 0-.005.005-.473.297-.713l.6-.481c.275-.224.275-.515.119-.806-.246-.464-.515-.948-.806-1.413-.119-.18-.275-.405-.485-.566a.83.83 0 0 0-.498-.171z"/>
                  </svg>
                </span>
                <span className="fw-alt-lbl">Viber</span>
              </a>
              <a href={`tel:+${PHONE_DIGITS}`} className="fw-alt fw-tel" aria-label="Телефон">
                <span className="fw-alt-ico">
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                  </svg>
                </span>
                <span className="fw-alt-lbl">Подзвонити</span>
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
