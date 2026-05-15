import { useEffect, useState } from 'react';
import { useScrollReveal } from '../anim/useScrollReveal';
import { useContent } from '../lib/content';
import { sendLead } from '../lib/lead';
import { formatPhone } from '../lib/phoneMask';
import { IconClose } from './Icons';
import { pauseSmoothScroll, resumeSmoothScroll } from '../anim/smoothScroll';

const MESSENGERS = ['Telegram', 'Viber', 'WhatsApp'] as const;
type Messenger = (typeof MESSENGERS)[number];

type Plan = {
  name: string;
  price: string;
  items: string[];
  term: string;
  termSub?: string;
  ph: string;
};

const PLANS_FALLBACK: Plan[] = [
  {
    name: 'Технічний дизайн-проєкт',
    price: '880 грн/м²',
    items: [
      'Обмірювальний план',
      'План демонтажу',
      'План монтажу',
      'План розміщення меблів',
      'План стелі',
      'План підлогових покриттів',
      'План дверних отворів',
      'План теплих підлог та опалювального обладнання',
      'Схема вентиляції та кондиціювання',
      'План обробки стін',
    ],
    term: 'від 3-х тиж.',
    termSub: 'Необхідні креслення для ремонту',
    ph: '/assets/design_1.webp',
  },
  {
    name: 'Стандартний дизайн-проєкт',
    price: '1275 грн/м²',
    items: [
      'Обмірювальний план',
      'План демонтажу',
      'План монтажу',
      'План розміщення меблів',
      'План стелі',
      'План підлогових покриттів',
      'План дверних отворів',
      'План теплих підлог та опалювального обладнання',
      'Схема вентиляції та кондиціювання',
      'План обробки стін',
      'Розгортки стін',
      'Креслення меблів',
      'Комплектація інтерʼєру',
      '3D візуалізація інтерʼєру',
    ],
    term: 'від 1,5 міс.',
    termSub: 'Креслення для ремонту + 3D візуалізація',
    ph: '/assets/design_2.jpg',
  },
  {
    name: 'Повний дизайн-проєкт',
    price: '2125 грн/м²',
    items: [
      'Обмірювальний план',
      'План демонтажу',
      'План монтажу',
      'План розміщення меблів',
      'План стелі',
      'План підлогових покриттів',
      'План дверних отворів',
      'План теплих підлог та опалювального обладнання',
      'Схема вентиляції та кондиціювання',
      'План обробки стін',
      'Розгортки стін',
      'Креслення меблів',
      'Комплектація інтерʼєру',
      '3D візуалізація інтерʼєру',
      'Авторський нагляд',
      'Знижки на матеріали від наших партнерів',
    ],
    term: 'від 1,5 міс.',
    termSub: 'Повний дизайн з авторським наглядом до завершення проєкту',
    ph: '/assets/design_3.jpg',
  },
];

export default function Plans() {
  const PLANS = useContent<Plan[]>('plans', PLANS_FALLBACK).slice(0, 3);
  useScrollReveal('.plan', { stagger: 0.1 });

  const [openFor, setOpenFor] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [channels, setChannels] = useState<Set<Messenger>>(new Set());
  const [status, setStatus] = useState<'idle' | 'sending' | 'ok' | 'err'>('idle');

  useEffect(() => {
    if (!openFor) return;
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
  }, [openFor]);

  function close() {
    setOpenFor(null);
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
      source: 'plan-popup',
      name, phone,
      service: openFor || undefined,
      contactChannel: [...channels].join(', '),
    });
    setStatus(r.ok ? 'ok' : 'err');
  }

  return (
    <section className="plans">
      <div className="plan-grid">
        {PLANS.map((p, i) => (
          <div className="plan" key={`${p.name}-${i}`}>
            <div className="ph">
              <div
                className="ph-img"
                role="img"
                aria-label={`Приклад інтер'єру — ${p.name}`}
                style={{ backgroundImage: `url(${p.ph})` }}
              />
            </div>
            <div className="plan-body">
              <div className="name">{p.name}</div>
              <div className="plan-sub">Перелік робіт, які входять до пакету</div>
              <ul>
                {p.items.map((it) => <li key={it}>{it}</li>)}
              </ul>
              <div className="plan-price-row">
                <span className="t-label">Вартість робіт:</span>
                <span className="price">{p.price}</span>
              </div>
              <div className="term">
                <span className="t-label">Терміни виконання:</span>
                <span className="t-value">{p.term}</span>
              </div>
              {p.termSub && <div className="term-sub">{p.termSub}</div>}
              <button type="button" className="btn btn-dark plan-cta" onClick={() => setOpenFor(p.name)}>Замовити</button>
            </div>
          </div>
        ))}
      </div>

      {openFor && (
        <div className="modal-overlay" onClick={close} data-lenis-prevent>
          <div className="lead-popup" onClick={(e) => e.stopPropagation()} data-lenis-prevent>
            <button className="x" type="button" onClick={close} aria-label="Закрити"><IconClose /></button>
            <h3>Замовити дизайн-проєкт</h3>
            <p className="sub">Пакет: <b>{openFor}</b>. Залиште контакти — ми зателефонуємо й уточнимо деталі.</p>
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
                <div className="lp-msg-label">Зручний месенджер для звʼязку</div>
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
              {status === 'ok' && <div className="hf-success">Дякуємо! Менеджер передзвонить найближчим часом.</div>}
              {status === 'err' && <div className="hf-error">Помилка відправки. Спробуйте ще раз.</div>}
              <button className="hf-submit" type="submit" disabled={status === 'sending'}>
                {status === 'sending' ? 'Відправляємо…' : 'Замовити'} <span className="arr" />
              </button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
