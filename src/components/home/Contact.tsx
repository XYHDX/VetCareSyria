'use client';

import React, { useEffect, useState } from 'react';
import { Mail, Phone, MapPin, Globe, Printer } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { defaultContactData, type Contact } from '@/lib/contact';

const Contact = () => {
  const { language } = useLanguage();
  const isArabic = language === 'ar';

  const [contact, setContact] = useState<Contact>(defaultContactData);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/admin/contact', { cache: 'no-store' });
        if (!res.ok) throw new Error('Failed contact fetch');
        const data: Contact = await res.json();
        setContact(data);
      } catch (err) {
        console.warn('Using default contact fallback', err);
      }
    };
    load();
  }, []);

  const contactLines = [
    contact.location && {
      icon: <MapPin className="h-5 w-5 text-emerald-600" />,
      label: isArabic ? 'المكتب الرئيسي' : 'Head Office',
      value: contact.location
    },
    contact.poBox && {
      icon: <Printer className="h-5 w-5 text-emerald-600" />,
      label: isArabic ? 'ص.ب' : 'P.O. Box',
      value: contact.poBox
    },
    contact.phone && {
      icon: <Phone className="h-5 w-5 text-emerald-600" />,
      label: isArabic ? 'هاتف' : 'Tel',
      value: contact.phone,
      href: `tel:${contact.phone.replace(/\\s+|-/g, '')}`
    },
    contact.phoneAlt && {
      icon: <Phone className="h-5 w-5 text-emerald-600" />,
      label: isArabic ? 'هاتف' : 'Tel',
      value: contact.phoneAlt,
      href: `tel:${contact.phoneAlt.replace(/\\s+|-/g, '')}`
    },
    contact.fax && {
      icon: <Printer className="h-5 w-5 text-emerald-600" />,
      label: isArabic ? 'فاكس' : 'Fax',
      value: contact.fax
    },
    contact.email && {
      icon: <Mail className="h-5 w-5 text-emerald-600" />,
      label: isArabic ? 'البريد الإلكتروني' : 'E-mail',
      value: contact.email,
      href: `mailto:${contact.email}`
    },
    contact.emailSecondary && {
      icon: <Mail className="h-5 w-5 text-emerald-600" />,
      label: isArabic ? 'البريد الإلكتروني' : 'E-mail',
      value: contact.emailSecondary,
      href: `mailto:${contact.emailSecondary}`
    },
    contact.website && {
      icon: <Globe className="h-5 w-5 text-emerald-600" />,
      label: isArabic ? 'الموقع الإلكتروني' : 'Website',
      value: contact.website,
      href: contact.website.startsWith('http') ? contact.website : `https://${contact.website}`
    },
    contact.linkedinUrl && {
      icon: <Globe className="h-5 w-5 text-emerald-600" />,
      label: 'LinkedIn',
      value: contact.linkedinUrl,
      href: contact.linkedinUrl
    },
    contact.facebookUrl && {
      icon: <Globe className="h-5 w-5 text-emerald-600" />,
      label: 'Facebook',
      value: contact.facebookUrl,
      href: contact.facebookUrl
    },
    contact.instagramUrl && {
      icon: <Globe className="h-5 w-5 text-emerald-600" />,
      label: 'Instagram',
      value: contact.instagramUrl,
      href: contact.instagramUrl
    }
  ].filter(Boolean) as {
    icon: React.ReactNode;
    label: string;
    value: string;
    href?: string;
  }[];

  return (
    <section id="contact" className="py-12 bg-secondary scroll-mt-28" dir={isArabic ? 'rtl' : 'ltr'}>
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-sm uppercase tracking-[0.2em] text-emerald-700">
            {isArabic ? 'التواصل' : 'Contact'}
          </p>
          <h2 className="mt-2 text-3xl font-bold text-gray-900">
            {isArabic ? 'تواصل معنا' : "Let's talk"}
          </h2>
          <p className="mt-3 text-gray-700 leading-relaxed">
            {isArabic
              ? 'تواصل معنا للاستفسار عن توافر المنتجات والالتزام التنظيمي والدعم الفني.'
              : 'Reach our team for product availability, compliance documentation, and technical support.'}
          </p>
        </div>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-4xl mx-auto">
          {contactLines.map((line) => (
            <div
              key={`${line.label}-${line.value}`}
              className="flex items-start gap-3 rounded-lg border border-emerald-100 bg-white p-4 shadow-sm"
            >
              <div className="mt-1">{line.icon}</div>
              <div className={isArabic ? 'text-right' : 'text-left'}>
                <div className="text-sm uppercase tracking-wide text-gray-500">{line.label}</div>
                {line.href ? (
                  <a href={line.href} className="text-gray-900 font-semibold hover:text-emerald-700">
                    {line.value}
                  </a>
                ) : (
                  <div className="text-gray-900 font-semibold">{line.value}</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Contact;
