import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

const Hero = () => {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);

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
          <button onClick={() => setIsModalOpen(true)} className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10">
            {t('home.hero.liveDemo')}
          </button>
        </div>
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg max-w-4xl w-full mx-4">
            <div className="flex justify-end mb-4">
              <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-gray-700">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <video controls className="w-full rounded-lg">
              <source src="/Expireo demo - Made with Clipchamp.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      )}
    </div>
  );
};

export default Hero;