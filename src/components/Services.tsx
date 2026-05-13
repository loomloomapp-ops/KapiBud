import { useEffect, useState } from 'react';
import { useScrollReveal } from '../anim/useScrollReveal';
import { sendLead } from '../lib/lead';
import { formatPhone } from '../lib/phoneMask';
import { IconClose } from './Icons';
import { pauseSmoothScroll, resumeSmoothScroll } from '../anim/smoothScroll';

const SERVICES = [
  {
    name: 'Готово під здачу',
    desc: 'Швидке та практичне рішення для оренди',
    includes: 'Чорнові матеріали\nЧистові матеріали\nПовний комплекс ремонтних робіт',
    materials: 'базовий, практичний',
    price: 'від 450 $/м²',
  },
  {
    name: 'Комфорт плюс',
    desc: 'Оптимальний баланс ціни та якості для життя',
    includes: 'Чорнові матеріали\nЧистові матеріали\nПовний комплекс ремонтних робіт',
    materials: 'середній, підвищений комфорт',
    price: 'від 600 $/м²',
  },
  {
    name: 'Прайм',
    desc: 'Преміальний ремонт для максимального комфорту',
    includes: 'Чорнові матеріали\nЧистові матеріали\nПовний комплекс ремонтних робіт',
    materials: 'преміум сегмент, дизайнерські рішення',
    price: 'від 750 $/м²',
  },
];

type Props = { onEstimateClick: () => void; onCasesClick: () => void };

export default function Services({ onEstimateClick }: Props) {
  useScrollReveal('.services .svc-card', { stagger: 0.1, y: 0 });
  const [openFor, setOpenFor] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [comment, setComment] = useState('');
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
    setName(''); setPhone(''); setComment('');
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (status === 'sending') return;
    if (!name.trim() || !phone.trim()) return;
    setStatus('sending');
    const r = await sendLead({
      source: 'services-popup',
      name, phone,
      message: comment,
      service: openFor || undefined,
    });
    setStatus(r.ok ? 'ok' : 'err');
  }

  return (
    <section className="services" id="prices">
      <div className="section-head">
        <div className="left"><span className="tag">Послуги</span></div>
        <div className="right">
          <h2 className="h-title">Усе для ремонту — в одній команді</h2>
          <p className="h-sub">
            Виконуємо повний комплекс ремонтних робіт під ключ у Києві та області — від чорнових процесів до фінальних деталей, щоб вам не довелося шукати підрядників чи контролювати етапи
          </p>
          <div className="head-actions">
            <button className="btn btn-beige" onClick={onEstimateClick}>
              отримати прорахунок <span className="arr" />
            </button>
          </div>
        </div>
      </div>
      <div className="service-cards">
        {SERVICES.map((s) => (
          <div className="svc-card" key={s.name}>
            <div>
              <div className="name">{s.name}</div>
              <div className="desc">{s.desc}</div>
            </div>
            <div className="row">
              <div className="label">Що входить:</div>
              <div className="val">{s.includes}</div>
            </div>
            <div className="row">
              <div className="label">Рівень матеріалів:</div>
              <div className="val">{s.materials}</div>
            </div>
            <div className="price">{s.price}</div>
            <button className="btn btn-dark" onClick={() => setOpenFor(s.name)}>Залишити заявку</button>
          </div>
        ))}
      </div>

      {openFor && (
        <div className="modal-overlay" onClick={close} data-lenis-prevent>
          <div className="lead-popup" onClick={(e) => e.stopPropagation()} data-lenis-prevent>
            <button className="x" type="button" onClick={close} aria-label="Закрити"><IconClose /></button>
            <h3>Залишити заявку</h3>
            <p className="sub">Тариф: <b>{openFor}</b>. Залиште контакти — ми зателефонуємо й уточнимо деталі.</p>
            <form onSubmit={submit} className="lead-form">
              <div className="hf-field">
                <label>Ім'я*</label>
                <div className="ctl"><input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ваше ім'я" required /></div>
              </div>
              <div className="hf-field">
                <label>Номер телефону*</label>
                <div className="ctl"><input value={phone} onChange={(e) => setPhone(formatPhone(e.target.value))} onFocus={() => { if (!phone) setPhone('+38 (0'); }} placeholder="+38 (0__) ___ __ __" type="tel" inputMode="tel" required /></div>
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
    </section>
  );
}
