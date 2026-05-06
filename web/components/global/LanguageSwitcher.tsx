'use client';

import { useLanguage } from '@/context/LanguageContext';

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex bg-muted/40 rounded-lg p-0.5 border border-border/40 shrink-0 select-none">
      <button
        onClick={() => setLanguage('EN')}
        type="button"
        className={`px-2.5 py-1 text-[10px] font-bold rounded-md transition-all ${
          language === 'EN' ? 'bg-primary text-white shadow-sm' : 'text-muted-foreground hover:text-white'
        }`}
      >
        EN
      </button>
      <button
        onClick={() => setLanguage('HI')}
        type="button"
        className={`px-2.5 py-1 text-[10px] font-bold rounded-md transition-all ${
          language === 'HI' ? 'bg-primary text-white shadow-sm' : 'text-muted-foreground hover:text-white'
        }`}
      >
        हिंदी
      </button>
      <button
        onClick={() => setLanguage('HN')}
        type="button"
        className={`px-2.5 py-1 text-[10px] font-bold rounded-md transition-all ${
          language === 'HN' ? 'bg-primary text-white shadow-sm' : 'text-muted-foreground hover:text-white'
        }`}
      >
        Hinglish
      </button>
    </div>
  );
}
