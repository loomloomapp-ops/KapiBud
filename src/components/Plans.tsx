import { useScrollReveal } from '../anim/useScrollReveal';

const BASE_ITEMS = [
  'Виготовлення схем та креслень',
  'Підготовчий етап',
  'Демонтаж',
  'Монтаж',
  'Кондиціювання (укладання траси)',
  'Електромонтаж (укладання траси, складання щита, монтаж підрозетників)',
  'Сантехнічні роботи (виведення водяних точок, монтаж прихованих систем)',
  'Штукатурка',
  'Влаштування чорнової підлоги',
  'Укладання плитки',
  'Шпаклівка',
  'Монтаж натяжної стелі та міжкімнатних дверей',
  'Малярні роботи (фарбування поверхні, поклейка шпалер)',
  'Укладання підлогового покриття',
];

const STANDARD_EXTRAS = [
  'Встановлення блоків кондиціонерів',
  'Електромонтаж (монтаж розеток, вмикачів, освітлювальних приладів)',
  'Сантехнічні роботи (установка сантехнічних приладів)',
];

const PREMIUM_EXTRAS = [
  ...STANDARD_EXTRAS,
  'Складання меблів',
  'Підключення техніки + (декорування)',
  'Клінінг',
];

const PLANS = [
  {
    name: 'Тариф базовий',
    price: '5399 грн/м²',
    items: BASE_ITEMS,
    term: 'від 2-х міс',
    ph: '/assets/plan-1.jpg',
  },
  {
    name: 'Тариф стандарт',
    price: '6299 грн/м²',
    items: [...BASE_ITEMS, ...STANDARD_EXTRAS],
    term: 'від 2-х міс',
    ph: '/assets/plan-2.jpg',
  },
  {
    name: 'Тариф базовий',
    price: '5399 грн/м²',
    items: [...BASE_ITEMS, ...PREMIUM_EXTRAS],
    term: 'від 2-х міс',
    ph: '/assets/plan-3.jpg',
  },
];

export default function Plans() {
  useScrollReveal('.plan', { stagger: 0.1 });
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
              <div className="price">{p.price}</div>
              <ul>
                {p.items.map((it) => <li key={it}>{it}</li>)}
              </ul>
              <div className="term">
                <span className="t-label">Терміни виконання:</span>
                <span className="t-value">{p.term}</span>
              </div>
              <a href="#estimate" className="btn btn-dark plan-cta">Замовити</a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
