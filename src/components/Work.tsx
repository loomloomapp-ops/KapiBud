import { IconHex } from './Icons';
import { useScrollReveal } from '../anim/useScrollReveal';

const CELLS = [
  { nm: 'Прозорий бюджет',      dsc: 'Повністю прозорий кошторис без прихованих витрат' },
  { nm: 'Чіткі терміни',         dsc: 'Ремонт, який здається точно в обіцяний термін' },
  { nm: 'Наша відповідальність', dsc: 'Мінімум вашої участі — максимум нашої відповідальності' },
  { nm: 'Готовий результат',     dsc: 'Готовий простір, у який хочеться заїхати одразу' },
];

export default function Work() {
  useScrollReveal('.work-cell', { stagger: 0.1 });
  return (
    <section className="work">
      <div className="work-inner">
        <div className="work-tag-row"><span className="tag tag-light">Що Ви Отримаєте</span></div>
        <div className="work-head">
          <h2>Працюючи з нами</h2>
          <p>Працюючи з нами над ремонтом у Києві чи Київській області, ви отримуєте продуманий і контрольований процес — від бюджету до фінального результату</p>
        </div>
        <div className="work-row">
          {CELLS.map((c) => (
            <div key={c.nm} className="work-cell">
              <div className="ico"><IconHex width={44} height={44} /></div>
              <div className="nm">{c.nm}</div>
              <div className="dsc">{c.dsc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
