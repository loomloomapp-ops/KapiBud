import { useScrollReveal } from '../anim/useScrollReveal';

const PLANS = [
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
              <a href="#estimate" className="btn btn-dark plan-cta">Замовити</a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
