import { useScrollReveal } from '../anim/useScrollReveal';
import { useContent } from '../lib/content';

type Partner = { cls: string; label: string; logo?: string };

const PARTNERS_FALLBACK: Partner[] = [
  { cls: 'AGROMAT',   label: 'АГРОМАТ' },
  { cls: 'REHAU',     label: 'REHAU' },
  { cls: 'TECE',      label: 'TECE' },
  { cls: 'KNAUF',     label: 'Knauf' },
  { cls: 'SONCE',     label: 'SONCE' },
  { cls: 'CERSANIT',  label: 'CERSANIT' },
  { cls: 'LEROY',     label: 'leroy merlin' },
  { cls: 'EPICENTRE', label: 'Епіцентр' },
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
