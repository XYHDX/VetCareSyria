'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Mail, Phone, MapPin, Globe, Printer } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { getNavLinks } from '@/config/navigation';
import type { Contact } from '@/lib/contact';

const defaultContact = {
  address: 'Syria, Damascus suburb, Adra industrial city, chemical zone, building No 710',
  poBox: 'P.O. Box 8446, Damascus, Syria',
  phone: '+963115852338',
  phoneDisplay: '00963-11-5852338 / 5852339',
  fax: '+963115852340',
  emailPrimary: 'vetcaresyria@scs-net.org',
  emailSecondary: 'vetcaresyria@gmail.com',
  website: 'www.vetcaresyria.com'
};

const Footer = () => {
  const { language } = useLanguage();
  const isArabic = language === 'ar';
  const [contactDetails, setContactDetails] = useState(defaultContact);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/admin/contact', { cache: 'no-store' });
        if (!res.ok) throw new Error('Failed to load contact');
        const data: Contact = await res.json();
        setContactDetails((prev) => ({
          ...prev,
          address: data.location || prev.address,
          phone: data.phone || prev.phone,
          phoneDisplay: data.phone || prev.phoneDisplay,
          emailPrimary: data.email || prev.emailPrimary
        }));
      } catch (err) {
        console.warn('Footer using default contact', err);
      }
    };
    load();
  }, []);

  return (
    <footer className="relative overflow-hidden text-white py-12" dir={isArabic ? 'rtl' : 'ltr'}>
      <div className="absolute inset-0 bg-gradient-to-br from-[#064e3b] via-[#0f766e] to-[#14b8a6]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.12),transparent_32%),radial-gradient(circle_at_80%_15%,rgba(255,255,255,0.1),transparent_26%),radial-gradient(circle_at_50%_80%,rgba(255,255,255,0.08),transparent_30%)]" />
      <div className="relative container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <h3 className="text-xl font-semibold mb-4">
              {isArabic ? 'السورية للرعاية البيطرية' : 'VetcareSyria'}
            </h3>
            <p className="text-emerald-100 leading-relaxed">
              {isArabic
                ? 'منذ 2005 نوفر أدوية ولقاحات وإضافات علفية موثوقة مدعومة بخبرة فنية والتزام باللوائح السورية.'
                : 'Since 2005, VetcareSyria has supplied veterinarians and livestock producers with trusted medicines, vaccines, and feed additives backed by technical expertise and compliance.'}
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4">{isArabic ? 'التواصل' : 'Contact'}</h3>
            <ul className="space-y-3 text-emerald-50">
              <li className="flex items-start gap-3">
                <MapPin className="mt-1 h-5 w-5 text-emerald-300" />
                <span>{isArabic ? 'سوريا، ضواحي دمشق، المدينة الصناعية بعدرا، المنطقة الكيماوية، مبنى 710' : contactDetails.address}</span>
              </li>
              <li className="flex items-start gap-3">
                <Printer className="mt-1 h-5 w-5 text-emerald-300" />
                <span>{contactDetails.poBox}</span>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="mt-1 h-5 w-5 text-emerald-300" />
                <div>
                  <a href={`tel:${contactDetails.phone}`} className="hover:text-white transition-colors">
                    {contactDetails.phoneDisplay}
                  </a>
                  <div className="text-sm text-emerald-200">
                    {isArabic ? 'فاكس:' : 'Fax:'} {contactDetails.fax.replace('+', '')}
                  </div>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="mt-1 h-5 w-5 text-emerald-300" />
                <div className="flex flex-col">
                  <a href={`mailto:${contactDetails.emailPrimary}`} className="hover:text-white transition-colors">
                    {contactDetails.emailPrimary}
                  </a>
                  <a href={`mailto:${contactDetails.emailSecondary}`} className="hover:text-white transition-colors">
                    {contactDetails.emailSecondary}
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Globe className="mt-1 h-5 w-5 text-emerald-300" />
                <a
                  href={`https://${contactDetails.website}`}
                  className="hover:text-white transition-colors"
                  target="_blank"
                  rel="noreferrer"
                >
                  {contactDetails.website}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4">{isArabic ? 'روابط' : 'Navigate'}</h3>
            <ul className="space-y-2 text-emerald-50">
              {getNavLinks(isArabic).map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/20 mt-10 pt-6 text-center text-emerald-100">
          <p>&copy; {new Date().getFullYear()} VetcareSyria. {isArabic ? 'جميع الحقوق محفوظة.' : 'All rights reserved.'}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
