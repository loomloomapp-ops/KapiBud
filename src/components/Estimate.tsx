import { useState } from 'react';
import { IconHome, IconLayout, IconEdit, IconChat } from './Icons';
import { sendLead } from '../lib/lead';

const STEP1 = [
  { id: 'apartment', t: 'Квартира', d: 'Первинне або вторинне житло', Ico: IconHome },
  { id: 'house',     t: 'Будинок',  d: 'Заміський або котедж', Ico: IconLayout },
  { id: 'commerce',  t: 'Комерційне приміщення', d: 'Офіс, магазин, заклад', Ico: IconEdit },
];

const STEP2 = [
  { id: 'have',     t: 'Так, є готовий проєкт', d: 'Беремо проєкт та реалізуємо', Ico: IconLayout },
  { id: 'no',       t: 'Ще немає',               d: 'Потрібна консультація та планування', Ico: IconEdit },
  { id: 'need',     t: 'Потрібна допомога з дизайном', d: 'Створимо дизайн-проєкт та візьмемо процес на себе', Ico: IconChat },
];

export default function Estimate() {
  const [step, setStep] = useState(1);
  const [s1, setS1] = useState('');
  const [s2, setS2] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [area, setArea] = useState('');
  const [comment, setComment] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'ok' | 'err'>('idle');

  const canNext = step === 1 ? !!s1 : step === 2 ? !!s2 : !!(name && phone);

  async function submit() {
    if (status === 'sending') return;
    setStatus('sending');
    const r = await sendLead({
      source: 'quiz',
      name, phone,
      objectType: STEP1.find((x) => x.id === s1)?.t,
      message: comment,
      step1: s1, step2: s2,
      step3: { area },
    });
    setStatus(r.ok ? 'ok' : 'err');
  }

  return (
    <section className="estimate" id="estimate">
      <div className="col-l">
        <h2>Зробіть перший крок до ремонту без стресу</h2>
        <p className="sub">
          Залиште заявку — підкажемо рішення, прорахуємо бюджет і покажемо, як це буде виглядати у вашому просторі в Києві та області
        </p>
        <div className="info">
          <div><div className="h">Адреса</div><div className="v">{`вул. Антоновича, 66\nКиїв, Україна, 02000`}</div></div>
          <div><div className="h">Телефон</div><div className="v"><a href="tel:+380630282440">+380 63 028 2440</a></div></div>
        </div>
      </div>

      <div className="quiz" id="quiz">
        <div className="steps">
          <div className={`step ${step === 1 ? 'active' : step > 1 ? 'done' : ''}`}>1</div>
          <div className="bar"><i style={{ width: step >= 2 ? '100%' : step === 1 ? '50%' : '0%' }} /></div>
          <div className={`step ${step === 2 ? 'active' : step > 2 ? 'done' : ''}`}>2</div>
          <div className="bar"><i style={{ width: step >= 3 ? '100%' : step === 2 ? '50%' : '0%' }} /></div>
          <div className={`step ${step === 3 ? 'active' : ''}`}>3</div>
        </div>
        <div className="div" />

        {step === 1 && (
          <>
            <div className="field" style={{ gap: 20 }}>
              <label>Тип об'єкта</label>
              <div className="options">
                {STEP1.map((o) => (
                  <div key={o.id} className={`option ${s1 === o.id ? 'checked' : ''}`} onClick={() => setS1(o.id)}>
                    <div className="rd" />
                    <div className="ico"><o.Ico /></div>
                    <div className="body"><div className="t">{o.t}</div><div className="d">{o.d}</div></div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {step === 2 && (
          <div className="field" style={{ gap: 20 }}>
            <label>Чи є у вас дизайн-проєкт?</label>
            <div className="options">
              {STEP2.map((o) => (
                <div key={o.id} className={`option ${s2 === o.id ? 'checked' : ''}`} onClick={() => setS2(o.id)}>
                  <div className="rd" />
                  <div className="ico"><o.Ico /></div>
                  <div className="body"><div className="t">{o.t}</div><div className="d">{o.d}</div></div>
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="grid-2">
              <div className="field">
                <label>Ім'я*</label>
                <div className="ctl"><input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ваше ім'я" /></div>
              </div>
              <div className="field">
                <label>Телефон*</label>
                <div className="ctl"><input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+38 (0__) ___ __ __" /></div>
              </div>
            </div>
            <div className="field">
              <label>Площа (м²)</label>
              <div className="ctl"><input value={area} onChange={(e) => setArea(e.target.value)} placeholder="Наприклад: 65" /></div>
            </div>
            <div className="field">
              <label>Коментар</label>
              <textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Розкажіть про ваші побажання" />
            </div>
            {status === 'ok' && <div className="hf-success">Дякуємо! Менеджер передзвонить найближчим часом.</div>}
            {status === 'err' && <div className="hf-error">Помилка відправки. Спробуйте ще раз.</div>}
          </div>
        )}

        <div className="nav-row">
          <button className="back" onClick={() => setStep((s) => Math.max(1, s - 1))} disabled={step === 1}>Назад</button>
          {step < 3 ? (
            <button className="btn btn-beige" disabled={!canNext} onClick={() => setStep((s) => s + 1)}>
              Далі <span className="arr" />
            </button>
          ) : (
            <button className="btn btn-beige" disabled={!canNext || status === 'sending'} onClick={submit}>
              {status === 'sending' ? 'Відправляємо…' : 'Відправити'} <span className="arr" />
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
