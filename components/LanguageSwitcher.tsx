import React from 'react';

interface LanguageSwitcherProps {
  language: 'en' | 'zh';
  setLanguage: (lang: 'en' | 'zh') => void;
}

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ language, setLanguage }) => {
  const baseClasses = 'px-4 py-1.5 text-sm font-bold transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-opacity-75';
  const activeClasses = 'bg-purple-600 text-white shadow-md';
  const inactiveClasses = 'bg-white text-gray-700 hover:bg-purple-50';

  return (
    <div className="flex rounded-lg border border-gray-200 shadow-sm overflow-hidden" role="radiogroup" aria-label="Language selection">
      <button
        onClick={() => setLanguage('en')}
        className={`${baseClasses} rounded-l-md ${language === 'en' ? activeClasses : inactiveClasses}`}
        aria-checked={language === 'en'}
        role="radio"
      >
        EN
      </button>
      <button
        onClick={() => setLanguage('zh')}
        className={`${baseClasses} rounded-r-md ${language === 'zh' ? activeClasses : inactiveClasses}`}
        aria-checked={language === 'zh'}
        role="radio"
      >
        中文
      </button>
    </div>
  );
};

export default LanguageSwitcher;
