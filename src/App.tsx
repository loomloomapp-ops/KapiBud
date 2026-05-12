import { useCallback, useState } from 'react';
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
import type { CaseItem } from './data/cases';

export default function App() {
  const [openCase, setOpenCase] = useState<CaseItem | null>(null);

  const scrollToEstimate = useCallback(() => {
    document.getElementById('estimate')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setOpenCase(null);
  }, []);

  const scrollToCases = useCallback(() => {
    document.getElementById('cases')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  return (
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
    </div>
  );
}
