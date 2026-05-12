export default function CtaBanner() {
  return (
    <section className="cta-banner">
      <div className="bg-zoom" role="img" aria-label="Інтер'єр житла після ремонту" />
      <div className="bg-scrim" aria-hidden="true" />
      <h2>Залишилось лише зробити крок до вашого ремонту</h2>
      <a href="#estimate" className="btn btn-glass">отримати прорахунок <span className="arr" /></a>
    </section>
  );
}
