import { useScrollReveal } from '../anim/useScrollReveal';

export default function PricingCta() {
  useScrollReveal('.pricing-cta .img');
  return (
    <section className="pricing-cta">
      <div className="img" role="img" aria-label="Прайс-лист на ремонтні роботи PrimeBud" />
      <div>
        <span className="tag">прайс-лист</span>
        <h2>Прозорі ціни на ремонт у Києві та Київській області</h2>
        <p className="sub">
          Ознайомтесь із повним прайс-листом на всі види робіт — ми працюємо відкрито, тому ви заздалегідь розумієте, за що платите і який бюджет планувати
        </p>
        <div className="pricing-cta-actions">
          <a href="#estimate" className="btn btn-beige-solid">переглянути прайс-лист <span className="arr" /></a>
        </div>
      </div>
    </section>
  );
}
