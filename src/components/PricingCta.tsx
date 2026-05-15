import { useEffect, useState } from 'react';
import { useScrollReveal } from '../anim/useScrollReveal';
import { sendLead } from '../lib/lead';
import { formatPhone } from '../lib/phoneMask';
import { IconClose } from './Icons';
import { pauseSmoothScroll, resumeSmoothScroll } from '../anim/smoothScroll';

const MESSENGERS = ['Telegram', 'Viber', 'WhatsApp'] as const;
type Messenger = (typeof MESSENGERS)[number];

export default function PricingCta() {
  useScrollReveal('.pricing-cta .img');

  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [channels, setChannels] = useState<Set<Messenger>>(new Set());
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
    setStatus('idle');
    setName(''); setPhone(''); setChannels(new Set());
  }

  function toggleCh(c: Messenger) {
    setChannels((s) => {
      const next = new Set(s);
      if (next.has(c)) next.delete(c); else next.add(c);
      return next;
    });
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (status === 'sending') return;
    if (!name.trim() || !phone.trim()) return;
    setStatus('sending');
    const r = await sendLead({
      source: 'pdf-popup',
      name, phone,
      contactChannel: [...channels].join(', '),
      message: 'Запит PDF-презентації',
    });
    setStatus(r.ok ? 'ok' : 'err');
  }

  return (
    <section className="pricing-cta" id="pricelist">
      <div className="img pricing-cta-img" role="img" aria-label="Прайс-лист на ремонтні роботи PrimeBud" />
      <div>
        <span className="tag">прайс-лист</span>
        <h2>Прозорі ціни на ремонт у Києві та Київській області</h2>
        <p className="sub">
          Ознайомтесь із повним прайс-листом на всі види робіт — ми працюємо відкрито, тому ви заздалегідь розумієте, за що платите і який бюджет планувати
        </p>
        <div className="pricing-cta-actions">
          <button type="button" className="btn btn-beige-solid" onClick={() => setOpen(true)}>
            Отримати PDF презентацію
            <span className="ico-dl" aria-hidden="true">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 3v12" />
                <path d="m7 10 5 5 5-5" />
                <path d="M5 21h14" />
              </svg>
            </span>
          </button>
        </div>
      </div>

      {open && (
        <div className="modal-overlay" onClick={close} data-lenis-prevent>
          <div className="lead-popup" onClick={(e) => e.stopPropagation()} data-lenis-prevent>
            <button className="x" type="button" onClick={close} aria-label="Закрити"><IconClose /></button>
            <h3>Отримати презентацію</h3>
            <p className="sub">Залиште ім'я, телефон і оберіть зручний месенджер — ми надішлемо PDF-презентацію</p>
            <form onSubmit={submit} className="lead-form">
              <div className="hf-field">
                <label>Ім'я*</label>
                <div className="ctl"><input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ваше ім'я" required /></div>
              </div>
              <div className="hf-field">
                <label>Номер телефону*</label>
                <div className="ctl"><input value={phone} onChange={(e) => setPhone(formatPhone(e.target.value))} onFocus={() => { if (!phone) setPhone('+38 (0'); }} placeholder="+38 (0__) ___ __ __" type="tel" inputMode="tel" required /></div>
              </div>
              <div className="lp-msg">
                <div className="lp-msg-label">Зручний для Вас месенджер для відправки презентації</div>
                <div className="lp-msg-row">
                  {MESSENGERS.map((c) => (
                    <label key={c} className={`lp-check ${channels.has(c) ? 'on' : ''}`}>
                      <input type="checkbox" checked={channels.has(c)} onChange={() => toggleCh(c)} />
                      <span className="bx" />
                      {c}
                    </label>
                  ))}
                </div>
              </div>
              {status === 'ok' && <div className="hf-success">Дякуємо! Презентація буде надіслана найближчим часом.</div>}
              {status === 'err' && <div className="hf-error">Помилка відправки. Спробуйте ще раз.</div>}
              <button className="hf-submit" type="submit" disabled={status === 'sending'}>
                {status === 'sending' ? 'Відправляємо…' : 'Отримати презентацію'} <span className="arr" />
              </button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
