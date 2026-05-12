import { useScrollReveal } from '../anim/useScrollReveal';

const PARTNERS = [
  { cls: 'AGROMAT',   label: 'АГРОМАТ',  cap: 'доступ до надійних постачальників і виробників' },
  { cls: 'REHAU',     label: 'REHAU',     cap: 'вигідніші ціни та спеціальні умови' },
  { cls: 'TECE',      label: 'TECE',      cap: 'гарантована якість матеріалів і рішень' },
  { cls: 'KNAUF',     label: 'Knauf',     cap: 'стабільні терміни виконання робіт' },
  { cls: 'SONCE',     label: 'SONCE',     cap: 'широкий вибір рішень під будь-які потреби' },
  { cls: 'CERSANIT',  label: 'CERSANIT',  cap: 'оптимальне поєднання ціни та якості' },
  { cls: 'LEROY',     label: 'leroy merlin', cap: 'мінімізацію ризиків та непередбачених ситуацій' },
  { cls: 'EPICENTRE', label: 'Епіцентр', cap: 'економію вашого часу та ресурсів' },
];

export default function Partners() {
  useScrollReveal('.partner-card', { stagger: 0.05 });
  return (
    <section className="partners" id="partners">
      <div className="partners-head">
        <h2>Працюємо з перевіреними партнерами</h2>
        <span className="tag tag-light">Партнери</span>
      </div>
      <div className="partner-row">
        {PARTNERS.map((p) => (
          <div className="partner-card" key={p.label}>
            <div className={`lg ${p.cls}`}>{p.label}</div>
            <div className="cap">{p.cap}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
