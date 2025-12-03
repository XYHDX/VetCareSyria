'use client';

import { useLanguage } from '@/context/LanguageContext';

const VisionMission = () => {
  const { language } = useLanguage();
  const isArabic = language === 'ar';

  const vision = isArabic
    ? 'أن نكون الشركة الرائدة في مجال الأدوية البيطرية محلياً وإقليمياً.'
    : 'To be the leading company in veterinary medicine locally and regionally.';

  const mission = isArabic
    ? 'تقديم مستحضرات دوائية عالية الجودة تلبي باستمرار متطلبات السوق السوري.'
    : 'To provide high-quality pharmaceuticals that continuously meet the requirements of the Syrian market.';

  return (
    <section
      id="vision"
      className="py-16"
      dir={isArabic ? 'rtl' : 'ltr'}
    >
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-2xl text-white p-8 shadow-lg shadow-emerald-900/20
            bg-gradient-to-br from-[#064e3b] via-[#0f766e] to-[#14b8a6]">
            <p className="text-sm uppercase tracking-[0.25em] text-emerald-50 mb-3">
              {isArabic ? 'الرؤية' : 'Vision'}
            </p>
            <h3 className="text-2xl md:text-3xl font-display font-semibold mb-3">
              {isArabic ? 'رؤيتنا' : 'Our vision'}
            </h3>
            <p className="text-base md:text-lg leading-relaxed text-emerald-50/90">{vision}</p>
          </div>
          <div className="rounded-2xl text-white p-8 shadow-lg shadow-emerald-900/20
            bg-gradient-to-br from-[#064e3b] via-[#0f766e] to-[#14b8a6]">
            <p className="text-sm uppercase tracking-[0.25em] text-emerald-50 mb-3">
              {isArabic ? 'الرسالة' : 'Mission'}
            </p>
            <h3 className="text-2xl md:text-3xl font-display font-semibold mb-3">
              {isArabic ? 'مهمتنا' : 'Our mission'}
            </h3>
            <p className="text-base md:text-lg leading-relaxed text-emerald-50/90">{mission}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VisionMission;
