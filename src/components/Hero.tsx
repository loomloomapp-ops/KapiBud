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

  // Mobile mini-quiz state (показується ≤640px замість full form)
  const [mStep, setMStep] = useState<1 | 2>(1);
  const [mObj, setMObj] = useState('');
  const [mName, setMName] = useState('');
  const [mPhone, setMPhone] = useState('');
  const [mStatus, setMStatus] = useState<'idle' | 'sending' | 'ok' | 'err'>('idle');

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let started = false;
    let safety: number | undefined;

    const ctx = gsap.context(() => {
      gsap.set('h1, .lede, .hero-ctas .btn, .trust .it, .hero-form, .hero-quiz-m', { opacity: 0 });
    }, heroRef);

    const runIntro = () => {
      if (started) return;
      started = true;
      window.removeEventListener('preloader-done', runIntro);
      if (safety) window.clearTimeout(safety);
      gsap.context(() => {
        gsap.fromTo('h1', { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 1.1, ease: 'power3.out', delay: 0.1 });
        gsap.fromTo('.lede', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: 'power3.out', delay: 0.3 });
        gsap.fromTo('.hero-ctas .btn', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', stagger: 0.1, delay: 0.55 });
        gsap.fromTo('.trust .it', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out', stagger: 0.08, delay: 0.7 });
        gsap.fromTo('.hero-form, .hero-quiz-m', { x: 60, opacity: 0 }, { x: 0, opacity: 1, duration: 1.1, ease: 'power3.out', delay: 0.25 });
        if (bgRef.current) {
          gsap.fromTo(bgRef.current, { scale: 1.12 }, { scale: 1, duration: 2.4, ease: 'power2.out' });
        }
      }, heroRef);
    };

    if (document.body.classList.contains('loaded')) {
      runIntro();
    } else {
      window.addEventListener('preloader-done', runIntro);
      safety = window.setTimeout(runIntro, 7000);
    }

    return () => {
      window.removeEventListener('preloader-done', runIntro);
      if (safety) window.clearTimeout(safety);
      ctx.revert();
    };
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

  async function onMobileSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (mStatus === 'sending') return;
    if (!mName.trim() || !mPhone.trim()) return;
    setMStatus('sending');
    const r = await sendLead({
      source: 'hero-form',
      name: mName, phone: mPhone,
      objectType: mObj,
    });
    setMStatus(r.ok ? 'ok' : 'err');
  }

  return (
    <section className="hero" ref={heroRef} id="top">
      <div className="bg" ref={bgRef} role="img" aria-label="Сучасний інтер'єр після ремонту KapiBud" />
      <div className="scrim" aria-hidden="true" />
      <div className="hero-grid">
        <div className="hero-l">
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

        {/* Десктоп / планшет — повна форма */}
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

        {/* Мобільний — компактний 2-кроковий квіз */}
        <form className="hero-quiz-m" onSubmit={onMobileSubmit}>
          <div className="hqm-head">
            <span className="hqm-step">Крок {mStep}/2</span>
            <h3>{mStep === 1 ? 'Що ремонтуємо?' : 'Куди вам зателефонувати?'}</h3>
          </div>

          {mStep === 1 && (
            <>
              <div className="hqm-opts">
                {OBJECT_TYPES.map((t) => (
                  <button
                    key={t}
                    type="button"
                    className={`hqm-opt ${mObj === t ? 'active' : ''}`}
                    onClick={() => { setMObj(t); setMStep(2); }}
                  >
                    {t}
                  </button>
                ))}
              </div>
              <p className="hqm-hint">Оберіть тип об'єкта — далі лише ім'я і телефон</p>
            </>
          )}

          {mStep === 2 && (
            <>
              <div className="hqm-field">
                <IconUser />
                <input value={mName} onChange={(e) => setMName(e.target.value)} placeholder="Ваше ім'я" required />
              </div>
              <div className="hqm-field">
                <IconCallSmall />
                <input value={mPhone} onChange={(e) => setMPhone(e.target.value)} placeholder="+38 (0__) ___ __ __" type="tel" required />
              </div>
              {mStatus === 'ok' && <div className="hf-success">Дякуємо! Ми зателефонуємо вам найближчим часом.</div>}
              {mStatus === 'err' && <div className="hf-error">Помилка відправки. Спробуйте ще раз.</div>}
              <div className="hqm-row">
                <button type="button" className="hqm-back" onClick={() => setMStep(1)}>Назад</button>
                <button className="hqm-submit" type="submit" disabled={mStatus === 'sending'}>
                  {mStatus === 'sending' ? 'Відправляємо…' : 'Залишити заявку'}
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </section>
  );
}
