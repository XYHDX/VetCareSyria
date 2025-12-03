'use client';

import { useLanguage } from '@/context/LanguageContext';

const ProfessionalSummary = () => {
  const { language } = useLanguage();
  const isArabic = language === 'ar';

  const profileSummary = isArabic
    ? 'شركة VETCARESYRIA مملوكة ومؤسسة من قبل د. هيثم ضميرية والمهندس أنس نشواتي في دمشق، سوريا عام 2005. حققت VETCARESYRIA نجاحاً كبيراً في السوق السوري عبر استيراد وتوزيع أدوية ولقاحات بيطرية وإضافات علفية عالية الجودة من شركات دولية معروفة حول العالم.'
    : 'VETCARESYRIA is owned and established by Dr. Haysam Demeriah & Eng. Anas Al Nachawati in Damascus, Syria in the year 2005. VETCARESYRIA has made great success in the Syrian market through importing and distributing high-quality veterinary medicines, veterinary vaccines, and feed additives from well-known international companies all over the world.';

  const points = isArabic
    ? [
      'التوريد من شركاء دوليين موثوقين وباعتماد GMP.',
      'دعم فني متوفر في معظم المدن السورية.',
      'التزام كامل بلوائح الاستيراد البيطرية السورية.'
    ]
    : [
      'Supply from trusted international partners with GMP certification.',
      'Technical support available across major Syrian cities.',
      'Full compliance with Syrian veterinary import regulations.'
    ];

  const atGlance = isArabic
    ? [
      { label: 'التأسيس:', value: '2005' },
      { label: 'القيادة:', value: 'د. هيثم ضميرية والمهندس أنس نشواتي' },
      { label: 'الموقع:', value: 'دمشق، سوريا' },
      { label: 'التركيز:', value: 'أدوية بيطرية، لقاحات، إضافات علفية' },
      { label: 'الالتزام:', value: 'اعتماد GMP والالتزام باللوائح' }
    ]
    : [
      { label: 'Founded:', value: '2005' },
      { label: 'Leadership:', value: 'Dr. Haysam Demeriah & Eng. Anas Al Nachawati' },
      { label: 'Location:', value: 'Damascus, Syria' },
      { label: 'Focus:', value: 'Veterinary medicines, vaccines, feed additives' },
      { label: 'Commitment:', value: 'GMP-certified and regulatory compliance' }
    ];

  const vision = isArabic
    ? 'أن نكون الشركة الرائدة في مجال الأدوية البيطرية محلياً وإقليمياً.'
    : 'To be the leading company in veterinary medicine locally and regionally.';

  const mission = isArabic
    ? 'تقديم مستحضرات دوائية عالية الجودة تلبي باستمرار متطلبات السوق السوري.'
    : 'To provide high-quality pharmaceuticals that continuously meet the requirements of the Syrian market.';

  return (
    <section id="about" className="py-16 bg-gradient-to-b from-white via-emerald-50/60 to-white scroll-mt-28">
      <div className="container mx-auto px-4" dir={isArabic ? 'rtl' : 'ltr'}>
        <div className="flex flex-col lg:flex-row gap-12 items-start">
          <div className="flex-1 space-y-4">
            <p className="text-sm uppercase tracking-[0.25em] text-emerald-700">
              {isArabic ? 'من نحن' : 'Who we are'}
            </p>
            <h2 className="text-3xl md:text-4xl font-display font-semibold text-emerald-900 tracking-tight">
              {isArabic ? 'عن السورية للرعاية البيطرية' : 'About VetcareSyria'}
            </h2>
            <p className="text-gray-700 leading-relaxed text-lg">{profileSummary}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {points.map((item) => (
                <div
                  key={item}
                  className="rounded-2xl bg-white border border-emerald-100/80 p-4 shadow-sm shadow-emerald-900/5 hover:-translate-y-0.5 transition"
                >
                  <p className="text-gray-800 leading-relaxed">{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="w-full lg:w-80 bg-white/90 backdrop-blur border border-emerald-100 rounded-2xl p-6 shadow-sm shadow-emerald-900/5">
            <h3 className="text-xl font-display font-semibold text-emerald-900 mb-4">
              {isArabic ? 'نظرة سريعة' : 'At a glance'}
            </h3>
            <ul className="space-y-3 text-gray-800">
              {atGlance.map((item) => (
                <li key={item.label}>
                  <span className="font-semibold text-emerald-900">{item.label} </span>
                  {item.value}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProfessionalSummary;
