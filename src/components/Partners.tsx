import { useScrollReveal } from '../anim/useScrollReveal';
import { useContent } from '../lib/content';

type Partner = { cls: string; label: string; cap: string; logo?: string };

const PARTNERS_FALLBACK: Partner[] = [
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
  const PARTNERS = useContent<Partner[]>('partners', PARTNERS_FALLBACK);
  const TRACK = [...PARTNERS, ...PARTNERS];
  useScrollReveal('.partner-card', { stagger: 0.05 });
  return (
    <section className="partners" id="partners">
      <div className="partners-head">
        <h2>Працюємо з перевіреними партнерами</h2>
        <span className="tag tag-light">Партнери</span>
      </div>
      <div className="partner-marquee" aria-hidden="false">
        <div className="partner-track">
          {TRACK.map((p, i) => (
            <div className="partner-card" key={`${p.label}-${i}`}>
              {p.logo ? (
                <div className="lg lg-img">
                  <img src={p.logo} alt={p.label} loading="lazy" />
                </div>
              ) : (
                <div className={`lg ${p.cls}`}>{p.label}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
