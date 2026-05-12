import { useScrollReveal } from '../anim/useScrollReveal';

const PLANS = [
  {
    name: 'Тариф базовий',
    price: '6 399 грн/м²',
    items: [
      'Заміри та технічне обстеження',
      'Планувальне рішення',
      'Демонтаж',
      'План меблів',
      'План з розміщенням сантехніки',
      'План з розміщенням розеток та вимикачів',
      'Креслення стелі',
    ],
    term: '14–21 дн.',
    btn: 'btn-beige',
    ph: 'ph-1',
  },
  {
    name: 'Тариф стандарт',
    price: '6 299 грн/м²',
    items: [
      'Все, що в базовому',
      '3D візуалізація',
      'Адаптовані креслення під виконання',
      'Креслення сан. вузла',
      'Креслення кухні',
      'Підбір матеріалів',
      'Авторський нагляд (4 виїзди)',
    ],
    term: 'від 30 дн.',
    btn: 'btn-dark',
    ph: 'ph-2',
  },
  {
    name: 'Тариф преміум',
    price: '6 499 грн/м²',
    items: [
      'Все, що в стандарті',
      'Авторський супровід',
      'Підбір меблів та декору',
      'Креслення підлоги',
      'Креслення стелі',
      'Розгортки санвузла',
      'Підбір сантехніки та плитки',
    ],
    term: 'від 60 дн.',
    btn: 'btn-beige',
    ph: 'ph-3',
  },
];

export default function Plans() {
  useScrollReveal('.plan', { stagger: 0.1 });
  return (
    <section className="plans">
      <h2>Створимо дизайн і візьмемо все на себе</h2>
      <p className="sub">Врахуємо ваші побажання, підготуємо проєкт і допоможемо реалізувати його без зайвого стресу</p>
      <div className="plan-grid">
        {PLANS.map((p) => (
          <div className="plan" key={p.name + p.price}>
            <div className={`ph ${p.ph}`} />
            <div className="name">{p.name}</div>
            <div className="price">{p.price}</div>
            <ul>
              {p.items.map((i) => <li key={i}>{i}</li>)}
            </ul>
            <div className="foot">
              <div className="meta">Термін виконання<br />{p.term}</div>
            </div>
            <a href="#estimate" className={`btn ${p.btn}`}>Замовити <span className="arr" /></a>
          </div>
        ))}
      </div>
    </section>
  );
}
