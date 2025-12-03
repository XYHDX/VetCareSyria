'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { partners as fallbackPartners } from '@/data/partners';
import type { Product } from '@/app/api/admin/products/route';
import type { Partner as PartnerModel } from '@/app/api/admin/partners/route';
import { useLanguage, LanguageProvider } from '@/context/LanguageContext';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

type PartnerGroup = {
  id: string;
  name: string;
  website?: string;
  logo?: string;
  products: string[];
};

const mapProductsToPartners = (products: Product[], partners: PartnerModel[]): PartnerGroup[] => {
  const partnersSource = partners.length ? partners : fallbackPartners;
  const partnerInfo = new Map(partnersSource.map((p) => [p.name.toLowerCase(), p]));
  const grouped: Record<string, PartnerGroup> = {};

  products.forEach((p) => {
    const key = p.partner || 'Partner';
    const match = partnerInfo.get(key.toLowerCase());
    if (!grouped[key]) {
      grouped[key] = {
        id: match?.id || key.toLowerCase().replace(/\s+/g, '-'),
        name: match?.name || key,
        website: p.origin || match?.website,
        logo: match?.logo,
        products: []
      };
    }
    grouped[key].products.push(p.name);
  });

  const groups = Object.values(grouped);
  if (groups.length === 0) {
    return partnersSource.map((p) => ({
      id: p.id,
      name: p.name,
      website: p.website,
      logo: p.logo,
      products: ((p as any).products as string[]) || []
    }));
  }
  return groups;
};

const PartnersContent = () => {
  const { language } = useLanguage();
  const isArabic = language === 'ar';
  const [remoteProducts, setRemoteProducts] = useState<Product[]>([]);
  const [remotePartners, setRemotePartners] = useState<PartnerModel[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/admin/products', { cache: 'no-store' });
        if (!res.ok) throw new Error('Failed to fetch products');
        const data = await res.json();
        setRemoteProducts(data);
      } catch (err) {
        console.warn('Partners page using fallback products', err);
        setRemoteProducts([]);
      }
      try {
        const res = await fetch('/api/admin/partners', { cache: 'no-store' });
        if (!res.ok) throw new Error('Failed to fetch partners');
        const data = await res.json();
        setRemotePartners(data);
      } catch (err) {
        console.warn('Partners page using fallback partners list', err);
        setRemotePartners([]);
      }
    };
    load();
  }, []);

  const groups = useMemo(
    () => mapProductsToPartners(remoteProducts, remotePartners),
    [remoteProducts, remotePartners]
  );

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-emerald-50 to-white" dir={isArabic ? 'rtl' : 'ltr'}>
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-14 space-y-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="space-y-3">
              <p className="text-sm uppercase tracking-[0.2em] text-emerald-700">
                {isArabic ? 'شركاؤنا' : 'Our partners'}
              </p>
              <h1 className="text-4xl font-display font-semibold text-emerald-900">
                {isArabic ? 'شركاؤنا ومنتجاتهم' : 'Partners and their products'}
              </h1>
              <p className="text-gray-700 max-w-3xl leading-relaxed">
                {isArabic
                  ? 'تعرف على الشركاء الدوليين الذين نعمل معهم وأبرز منتجاتهم المتاحة في السوق السوري.'
                  : 'Explore the international partners we work with and the flagship products we bring to the Syrian market.'}
              </p>
            </div>
            <Link
              href="/#products"
              className="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-[#064e3b] via-[#0f766e] to-[#14b8a6] text-white px-5 py-2.5 font-semibold shadow-md shadow-emerald-900/20 transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-emerald-900/30"
            >
              {isArabic ? 'عودة إلى الصفحة الرئيسية' : 'Back to homepage'}
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
            {groups.map((partner) => (
              <div
                key={partner.id}
                id={partner.id}
                className="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-5 shadow-sm shadow-emerald-900/5 hover:-translate-y-0.5 transition"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    {partner.logo ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={partner.logo}
                        alt={partner.name}
                        className="h-12 w-12 rounded-xl border border-emerald-100 bg-emerald-50 object-contain p-1"
                      />
                    ) : (
                      <div className="h-12 w-12 rounded-xl border border-emerald-100 bg-emerald-50 flex items-center justify-center text-sm text-emerald-700">
                        Logo
                      </div>
                    )}
                    <div>
                      <h2 className="text-lg font-display font-semibold text-emerald-900">{partner.name}</h2>
                      {partner.website && (
                        <div className="text-xs text-emerald-700 break-all">{partner.website}</div>
                      )}
                    </div>
                  </div>
                  {partner.website && (
                    <a
                      href={partner.website}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center rounded-md bg-gradient-to-r from-[#064e3b] via-[#0f766e] to-[#14b8a6] text-white px-3 py-1.5 text-xs font-semibold shadow-sm shadow-emerald-900/15 transition hover:-translate-y-0.5 hover:shadow-md hover:shadow-emerald-900/25"
                    >
                      {isArabic ? 'الموقع' : 'Website'}
                    </a>
                  )}
                </div>
                <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {partner.products.map((product) => (
                    <span
                      key={product}
                      className="rounded-md bg-white/80 px-3 py-2 text-sm text-emerald-900 border border-emerald-100"
                    >
                      {product}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

const PartnersPage = () => (
  <LanguageProvider>
    <PartnersContent />
  </LanguageProvider>
);

export default PartnersPage;
