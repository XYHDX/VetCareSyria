'use client';

import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import { partners as seedPartners } from '@/data/partners';
import type { Product } from '@/app/api/admin/products/route';
import type { Partner as PartnerModel } from '@/app/api/admin/partners/route';

const Products = () => {
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
      } catch (e) {
        console.warn('Using fallback partners', e);
        setRemoteProducts([]);
      }
      try {
        const res = await fetch('/api/admin/partners', { cache: 'no-store' });
        if (!res.ok) throw new Error('Failed to fetch partners');
        const data = await res.json();
        setRemotePartners(data);
      } catch (e) {
        console.warn('Using fallback partners list', e);
        setRemotePartners([]);
      }
    };
    load();
  }, []);

  const partners = useMemo(() => {
    const partnersList = (remotePartners.length ? remotePartners : seedPartners).map((p) => ({
      id: p.id,
      name: p.name,
      website: p.website,
      logo: p.logo,
      products: [...(p as any).products || []] // seed partners carry products
    }));

    const products = remoteProducts.length
      ? remoteProducts
      : seedPartners.flatMap((p) =>
        p.products.map((prod) => ({
          id: `${p.id}-${prod}`,
          name: prod,
          partner: p.name
        }))
      );

    const grouped = partnersList.map((partner) => {
      const partnerProducts = products
        .filter((prod) => (prod.partner || '').toLowerCase() === partner.name.toLowerCase())
        .map((prod) => prod.name);
      return {
        ...partner,
        products: partnerProducts.length ? partnerProducts : partner.products
      };
    });

    return grouped;
  }, [remotePartners, remoteProducts]);

  return (
    <section id="products" className="py-16 bg-white scroll-mt-28" dir={isArabic ? 'rtl' : 'ltr'}>
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="max-w-3xl">
            <p className="text-sm uppercase tracking-[0.2em] text-emerald-700">
              {isArabic ? 'شركاؤنا' : 'Our partners'}
            </p>
            <h2 className="mt-2 text-3xl font-display font-semibold text-emerald-900">
              {isArabic ? 'شركاؤنا ومنتجاتهم' : 'Partners and their products'}
            </h2>
            <p className="mt-4 text-gray-700 leading-relaxed">
              {isArabic
                ? 'نقدم لمحة سريعة عن أبرز منتجات شركائنا. للمزيد من التفاصيل، استكشف صفحة شركائنا الكاملة.'
                : 'See a quick preview of our partners’ flagship products. For full details, explore the partners page.'}
            </p>
          </div>
          <Link
            href="/partners"
            className="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-[#064e3b] via-[#0f766e] to-[#14b8a6] text-white px-5 py-2.5 font-semibold shadow-md shadow-emerald-900/20 transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-emerald-900/30"
          >
            {isArabic ? 'عرض جميع الشركاء' : 'View full partners'}
          </Link>
        </div>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {partners.map((partner) => {
            const preview = partner.products.slice(0, 3);
            const extraCount = partner.products.length - preview.length;
            return (
              <div
                key={partner.id}
                className="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-5 shadow-sm shadow-emerald-900/5 hover:-translate-y-0.5 transition"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {partner.logo && (
                      <div className="relative h-10 w-10 rounded-md bg-white border border-emerald-100 overflow-hidden">
                        <Image src={partner.logo} alt={partner.name} fill className="object-contain p-1" />
                      </div>
                    )}
                    <h3 className="text-lg font-display font-semibold text-emerald-900">{partner.name}</h3>
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
                <ul className="mt-3 space-y-2 text-gray-800 text-sm leading-relaxed">
                  {preview.map((product) => (
                    <li key={product} className="rounded-md bg-white/70 px-3 py-2 border border-emerald-100">
                      {product}
                    </li>
                  ))}
                </ul>
                {extraCount > 0 && (
                  <div className="mt-3 text-sm text-emerald-800 flex items-center justify-between">
                    <span>
                      {isArabic ? `${extraCount} منتج إضافي` : `${extraCount} more product${extraCount > 1 ? 's' : ''}`}
                    </span>
                    <Link href={`/partners#${partner.id}`} className="text-emerald-700 font-semibold hover:text-emerald-900">
                      {isArabic ? 'عرض الكل' : 'See all'}
                    </Link>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Products;
