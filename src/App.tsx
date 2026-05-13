import { useCallback, useEffect, useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Services from './components/Services';
import Cases from './components/Cases';
import CaseModal from './components/CaseModal';
import Estimate from './components/Estimate';
import Work from './components/Work';
import Reviews from './components/Reviews';
import PricingCta from './components/PricingCta';
import Plans from './components/Plans';
import FAQ from './components/FAQ';
import CtaBanner from './components/CtaBanner';
import Partners from './components/Partners';
import Footer from './components/Footer';
import MobileDock from './components/MobileDock';
import Preloader from './components/Preloader';
import FloatingWidgets from './components/FloatingWidgets';
import type { CaseItem } from './data/cases';
import { initSmoothScroll, smoothScrollTo } from './anim/smoothScroll';

export default function App() {
  const [openCase, setOpenCase] = useState<CaseItem | null>(null);

  useEffect(() => {
    initSmoothScroll();
    // плавний скрол для звичайних якорних посилань
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement)?.closest('a[href^="#"]') as HTMLAnchorElement | null;
      if (!a) return;
      const href = a.getAttribute('href');
      if (!href || href === '#' || href.length < 2) return;
      const el = document.querySelector(href) as HTMLElement | null;
      if (!el) return;
      e.preventDefault();
      smoothScrollTo(el, { offset: -20 });
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  const scrollToEstimate = useCallback(() => {
    const el = document.getElementById('estimate');
    if (el) smoothScrollTo(el, { offset: -20 });
    setOpenCase(null);
  }, []);

  const scrollToCases = useCallback(() => {
    const el = document.getElementById('cases');
    if (el) smoothScrollTo(el, { offset: -20 });
  }, []);

  return (
    <>
      <Preloader />
      <div className="page">
        <Header onCtaClick={scrollToEstimate} />
        <Hero />
        <Services onEstimateClick={scrollToEstimate} onCasesClick={scrollToCases} />
        <Cases onOpen={setOpenCase} />
        <Estimate />
        <Work />
        <Reviews />
        <PricingCta />
        <Plans />
        <FAQ />
        <CtaBanner />
        <Partners />
        <Footer />
        <MobileDock />
        <CaseModal item={openCase} onClose={() => setOpenCase(null)} onEstimate={scrollToEstimate} />
        <FloatingWidgets />
      </div>
    </>
  );
}
