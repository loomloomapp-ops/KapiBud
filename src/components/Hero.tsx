import { useEffect, useRef, useState } from 'react';
import { gsap } from '../anim/useScrollReveal';
import { IconHex, IconUser, IconCallSmall } from './Icons';
import { sendLead } from '../lib/lead';

const CHANNELS = [
  'Зателефонуйте мені',
  'Напишіть на WhatsApp',
  'Напишіть на Telegram',
  'Напишіть на Viber',
];

const OBJECT_TYPES = ['Квартира', 'Будинок', 'Комерційне приміщення', 'Інше'];

export default function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [objectType, setObjectType] = useState('');
  const [channel, setChannel] = useState(CHANNELS[0]);
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'ok' | 'err'>('idle');

  // Hero intro animation + parallax background
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const ctx = gsap.context(() => {
      gsap.from('.hero h1', { y: 40, opacity: 0, duration: 1.1, ease: 'power3.out', delay: 0.1 });
      gsap.from('.hero .lede', { y: 30, opacity: 0, duration: 1, ease: 'power3.out', delay: 0.3 });
      gsap.from('.hero-ctas .btn', { y: 20, opacity: 0, duration: 0.8, ease: 'power3.out', stagger: 0.1, delay: 0.55 });
      gsap.from('.trust .it', { y: 20, opacity: 0, duration: 0.7, ease: 'power3.out', stagger: 0.08, delay: 0.7 });
      gsap.from('.hero-form', { x: 60, opacity: 0, duration: 1.1, ease: 'power3.out', delay: 0.25 });
      // background slow zoom-out
      if (bgRef.current) {
        gsap.fromTo(bgRef.current, { scale: 1.12 }, { scale: 1, duration: 2.4, ease: 'power2.out' });
      }
    }, heroRef);
    return () => ctx.revert();
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status === 'sending') return;
    if (!name.trim() || !phone.trim()) return;
    setStatus('sending');
    const r = await sendLead({
      source: 'hero-form',
      name, phone,
      objectType,
      contactChannel: channel,
      message,
    });
    setStatus(r.ok ? 'ok' : 'err');
    if (r.ok) {
      setName(''); setPhone(''); setMessage('');
    }
  }

  return (
    <section className="hero" ref={heroRef} id="top">
      <div className="bg" ref={bgRef} />
      <div className="scrim" />
      <div className="hero-grid">
        <div>
          <h1>Ремонт, який не зламає вам нерви</h1>
          <p className="lede">
            Просто залиште заявку — і ми повністю візьмемо ремонт на себе: від планування та підбору матеріалів до здачі готового простору в Києві та області без зайвих витрат і затримок
          </p>
          <div className="hero-ctas">
            <a href="#estimate" className="btn btn-glass">Отримати прорахунок <span className="arr" /></a>
            <a href="#prices" className="btn btn-ghost-light">Послуги <span className="arr" /></a>
          </div>
          <div className="trust">
            <div className="it"><span className="ico"><IconHex /></span>Точні терміни без затягувань</div>
            <div className="it"><span className="ico"><IconHex /></span>Ви не контролюєте — ми відповідаємо</div>
            <div className="it"><span className="ico"><IconHex /></span>Результат, яким хочеться пишатися</div>
          </div>
        </div>

        <form className="hero-form" onSubmit={onSubmit}>
          <h3>Отримайте безкоштовну консультацію</h3>
          <p className="sub">Залиште заявку — ми зв'яжемося з вами, уточнимо деталі та підготуємо попередній розрахунок вартості ремонту</p>
          <div className="hf-row">
            <div className="hf-field">
              <label>Ім'я*</label>
              <div className="ctl">
                <IconUser />
                <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Введіть ваше ім'я" required />
              </div>
            </div>
            <div className="hf-field">
              <label>Номер телефону*</label>
              <div className="ctl">
                <IconCallSmall />
                <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+38 (0__) ___ __ __" type="tel" required />
              </div>
            </div>
          </div>
          <div className="hf-field">
            <label>Тип об'єкта</label>
            <div className="ctl">
              <select value={objectType} onChange={(e) => setObjectType(e.target.value)}>
                <option value="">Оберіть тип об'єкта</option>
                {OBJECT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>
          <div>
            <div className="hf-group-label">Оберіть варіант зв'язку:</div>
            <div className="hf-channels" style={{ marginTop: 10 }}>
              {CHANNELS.map((c) => (
                <label key={c} className={`hf-radio ${channel === c ? 'checked' : ''}`}>
                  <input type="radio" name="channel" checked={channel === c} onChange={() => setChannel(c)} />
                  <span className="rd" />
                  {c}
                </label>
              ))}
            </div>
          </div>
          <textarea
            className="hf-textarea"
            placeholder="Додатковий коментар"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          {status === 'ok' && <div className="hf-success">Дякуємо! Ми зателефонуємо вам найближчим часом.</div>}
          {status === 'err' && <div className="hf-error">Помилка відправки. Спробуйте ще раз або зателефонуйте нам.</div>}
          <button className="hf-submit" type="submit" disabled={status === 'sending'}>
            {status === 'sending' ? 'Відправляємо…' : 'Відправити'} <span className="arr" />
          </button>
        </form>
      </div>
    </section>
  );
}
