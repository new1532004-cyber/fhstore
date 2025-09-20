import React from 'react';
import { Globe } from 'lucide-react';
import { useLanguage, Language } from '../contexts/LanguageContext';

export default function LanguageSelector() {
  const { language, setLanguage } = useLanguage();
  
  const languages: { code: Language; name: string; flag: string }[] = [
    { code: 'ar', name: 'العربية', flag: '🇩🇿' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'en', name: 'English', flag: '🇺🇸' }
  ];
  
  return (
    <div className="relative">
      <button className="flex items-center space-x-2 p-3 hover:bg-white/20 rounded-full transition-all duration-300 smooth-hover glow-pink group">
        <Globe className="h-5 w-5" />
        <span className="text-lg">
          {languages.find(l => l.code === language)?.flag}
        </span>
        <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 bg-white rounded-xl shadow-modern p-2 min-w-[140px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => setLanguage(lang.code)}
              className={`w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-left transition-all duration-200 text-sm ${
                language === lang.code
                  ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white glow-pink'
                  : 'hover:bg-pink-50 text-gray-700'
              }`}
            >
              <span className="text-base">{lang.flag}</span>
              <span className="font-medium">{lang.name}</span>
            </button>
          ))}
        </div>
      </button>
    </div>
  );
}