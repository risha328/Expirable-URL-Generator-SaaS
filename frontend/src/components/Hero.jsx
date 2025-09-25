import React from 'react';
import { useTranslation } from 'react-i18next';

const Hero = () => {
  const { t } = useTranslation();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 text-center">
      <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
        {t('home.hero.title')} <span className="text-indigo-600">{t('home.hero.titleHighlight')}</span>
      </h1>
      <p className="mt-4 max-w-3xl mx-auto text-xl text-gray-600">
        {t('home.hero.subtitle')} 
      </p>
      <div className="mt-10 flex justify-center">
        <div className="rounded-md shadow">
          <a href="/dashboard" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10">
            {t('home.hero.getStarted')} 
          </a>
        </div>
        <div className="ml-3 rounded-md shadow">
          <a href="#" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10">
            {t('home.hero.liveDemo')}
          </a>
        </div>
      </div>
    </div>
  );
};

export default Hero;