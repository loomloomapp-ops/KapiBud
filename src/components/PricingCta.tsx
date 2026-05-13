import { useScrollReveal } from '../anim/useScrollReveal';

export default function PricingCta() {
  useScrollReveal('.pricing-cta .img');
  return (
    <section className="pricing-cta" id="pricelist">
      <div className="img pricing-cta-img" role="img" aria-label="Прайс-лист на ремонтні роботи PrimeBud" />
      <div>
        <span className="tag">прайс-лист</span>
        <h2>Прозорі ціни на ремонт у Києві та Київській області</h2>
        <p className="sub">
          Ознайомтесь із повним прайс-листом на всі види робіт — ми працюємо відкрито, тому ви заздалегідь розумієте, за що платите і який бюджет планувати
        </p>
        <div className="pricing-cta-actions">
          <a
            href="/assets/PRIMEBUD-pricelist.pdf"
            download
            className="btn btn-beige-solid"
          >
            Завантажити PDF
            <span className="ico-dl" aria-hidden="true">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 3v12" />
                <path d="m7 10 5 5 5-5" />
                <path d="M5 21h14" />
              </svg>
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
