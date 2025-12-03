'use client';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/home/Hero';
import ProfessionalSummary from '@/components/home/ProfessionalSummary';
import Products from '@/components/home/Products';
import Contact from '@/components/home/Contact';
import VisionMission from '@/components/home/VisionMission';
import { LanguageProvider } from '@/context/LanguageContext';

export default function Home() {
  return (
    <LanguageProvider>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow">
          <Hero />
          <ProfessionalSummary />
          <VisionMission />
          <Products />
          <Contact />
        </main>
        <Footer />
      </div>
    </LanguageProvider>
  );
}
