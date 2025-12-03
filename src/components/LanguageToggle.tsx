'use client';

import { useLanguage } from '@/context/LanguageContext';

const LanguageToggle = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-100 rounded-full p-1">
      <button
        type="button"
        onClick={() => setLanguage('en')}
        className={`px-3 py-1 text-sm font-semibold rounded-full transition-colors ${
          language === 'en'
            ? 'bg-white text-emerald-800 shadow-sm'
            : 'text-emerald-700 hover:text-emerald-900'
        }`}
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => setLanguage('ar')}
        className={`px-3 py-1 text-sm font-semibold rounded-full transition-colors ${
          language === 'ar'
            ? 'bg-white text-emerald-800 shadow-sm'
            : 'text-emerald-700 hover:text-emerald-900'
        }`}
      >
        AR
      </button>
    </div>
  );
};

export default LanguageToggle;
