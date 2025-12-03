'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

type Settings = {
  siteName: string;
  siteDescription: string;
  heroNote?: string;
  primaryCta?: string;
};

const Hero = () => {
  const { language } = useLanguage();
  const isArabic = language === 'ar';

  const [settings, setSettings] = useState<Settings>({
    siteName: 'VetcareSyria',
    siteDescription: 'Trusted veterinary medicines, vaccines, and feed additives.',
    heroNote: isArabic ? 'منذ 2005 • دمشق، سوريا' : 'Since 2005 • Damascus, Syria',
    primaryCta: isArabic ? 'تواصل معنا' : 'Contact us'
  });

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/admin/settings', { cache: 'no-store' });
        if (!res.ok) throw new Error('Failed settings fetch');
        const data = await res.json();
        setSettings((prev) => ({
          ...prev,
          ...data,
          heroNote: data.heroNote || prev.heroNote,
          primaryCta: data.primaryCta || prev.primaryCta
        }));
      } catch (err) {
        console.warn('Using default settings fallback', err);
      }
    };
    load();
  }, [isArabic]);

  const headline = isArabic
    ? `${settings.siteName} — أدوية ولقاحات وإضافات علفية موثوقة.`
    : `${settings.siteName} — ${settings.siteDescription}`;

  const subtext = isArabic
    ? 'تحت قيادة الدكتور هيثم ضميرية والمهندس أنس نشواتي، نوفر منتجات عالية الجودة من شركاء دوليين موثوقين مع دعم فني في معظم المدن السورية وامتثال كامل للوائح الاستيراد البيطرية.'
    : 'Founded by Dr. Haysam Demeriah and Eng. Anas Al Nachawati, we deliver high-quality products from renowned international partners, backed by technical support across Syrian cities and full compliance with veterinary import regulations.';

  return (
    <section id="home" className="relative overflow-hidden text-slate-900 scroll-mt-28" dir={isArabic ? 'rtl' : 'ltr'}>
      <div className="absolute inset-0 bg-gradient-to-br from-[#064e3b] via-[#0f766e] to-[#14b8a6]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.15),transparent_35%),radial-gradient(circle_at_80%_15%,rgba(255,255,255,0.12),transparent_28%),radial-gradient(circle_at_50%_80%,rgba(255,255,255,0.1),transparent_32%)]" />
      <div className="relative container mx-auto px-4 py-16 md:py-24 text-white">
        <div className="max-w-5xl">
          {settings.heroNote && (
            <p className="inline-flex items-center rounded-full bg-white/15 px-4 py-2 text-sm font-semibold ring-1 ring-white/30 backdrop-blur">
              {settings.heroNote}
            </p>
          )}
          <h1 className="mt-6 text-4xl md:text-6xl font-bold leading-tight font-display tracking-tight drop-shadow-sm">
            {headline}
          </h1>
          <p className="mt-6 text-lg md:text-xl text-emerald-50/90 max-w-3xl leading-relaxed">
            {subtext}
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="#contact"
              className="rounded-lg bg-white text-emerald-900 px-6 py-3 font-semibold shadow-lg shadow-emerald-900/20 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-emerald-900/30"
            >
              {settings.primaryCta || (isArabic ? 'تواصل معنا' : 'Contact us')}
            </Link>
            <Link
              href="#products"
              className="rounded-lg bg-white/15 px-6 py-3 font-semibold text-white ring-1 ring-white/30 transition hover:bg-white/25 hover:-translate-y-0.5"
            >
              {isArabic ? 'استكشف شركاءنا' : 'Explore our partners'}
            </Link>
          </div>

          <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl">
            {[
              isArabic ? 'شركاء عالميون موثوقون' : 'Trusted global partners',
              isArabic ? 'دعم فني في معظم المدن' : 'Technical support nationwide',
              isArabic ? 'منتجات معتمدة GMP' : 'GMP-certified products'
            ].map((item) => (
              <div
                key={item}
                className="rounded-xl bg-white/10 px-4 py-3 text-sm font-semibold ring-1 ring-white/20 backdrop-blur-sm"
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
