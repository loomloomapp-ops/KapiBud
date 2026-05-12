import { useScrollReveal } from '../anim/useScrollReveal';

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

export default function Services({ onEstimateClick, onCasesClick }: Props) {
  useScrollReveal('.services .svc-card', { stagger: 0.1 });

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
            <button className="btn btn-dark" onClick={onCasesClick}>Переглянути Кейси</button>
          </div>
        ))}
      </div>
    </section>
  );
}
