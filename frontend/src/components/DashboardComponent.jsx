import React from 'react';
import { useTranslation } from 'react-i18next';

const DashboardComponent = () => {
  const { t } = useTranslation();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
      <div className="lg:grid lg:grid-cols-2 lg:gap-8 items-center">
        <div>
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            {t('home.dashboard.title')}
          </h2>
          <p className="mt-3 max-w-3xl text-lg text-gray-600">
            {t('home.dashboard.description')}
          </p>
          <div className="mt-8 space-y-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                  <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <h5 className="text-lg font-medium text-gray-900">{t('home.dashboard.features.password.title')}</h5>
                <p className="text-gray-600">{t('home.dashboard.features.password.description')}</p>
              </div>
            </div>
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                  <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <h5 className="text-lg font-medium text-gray-900">{t('home.dashboard.features.expiration.title')}</h5>
                <p className="text-gray-600">{t('home.dashboard.features.expiration.description')}</p>
              </div>
            </div>
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                  <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <h5 className="text-lg font-medium text-gray-900">{t('home.dashboard.features.fileSharing.title')}</h5>
                <p className="text-gray-600">{t('home.dashboard.features.fileSharing.description')}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-10 lg:mt-0">
          <div className="relative max-w-md mx-auto bg-white rounded-xl shadow-2xl overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-indigo-500"></div>
            <div className="px-6 py-5 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">{t('home.dashboard.links.yourLinks')}</h3>
            </div>
            <div className="divide-y divide-gray-200">
              <div className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                      <svg className="h-5 w-5 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <h4 className="text-sm font-medium text-gray-900">{t('home.dashboard.links.financialReport')}</h4>
                      <p className="text-xs text-gray-500">expireo.link/fin-report-2023</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      {t('home.dashboard.links.active')}
                    </span>
                  </div>
                </div>
                <div className="mt-2 flex justify-between text-xs text-gray-500">
                  <span>{t('home.dashboard.links.expires')} 2 {t('home.dashboard.links.days')}</span>
                  <span>{t('home.dashboard.links.clicks')}: 12</span>
                </div>
              </div>
              <div className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                      <svg className="h-5 w-5 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <h4 className="text-sm font-medium text-gray-900">{t('home.dashboard.links.clientProposal')}</h4>
                      <p className="text-xs text-gray-500">expireo.link/acme-proposal</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                      {t('home.dashboard.links.expiring')}
                    </span>
                  </div>
                </div>
                <div className="mt-2 flex justify-between text-xs text-gray-500">
                  <span>{t('home.dashboard.links.expires')} 5 {t('home.dashboard.links.hours')}</span>
                  <span>{t('home.dashboard.links.clicks')}: 3</span>
                </div>
              </div>
              <div className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                      <svg className="h-5 w-5 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <h4 className="text-sm font-medium text-gray-900">{t('home.dashboard.links.privatePhotos')}</h4>
                      <p className="text-xs text-gray-500">expireo.link/wedding-photos</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                      {t('home.dashboard.links.expired')}
                    </span>
                  </div>
                </div>
                <div className="mt-2 flex justify-between text-xs text-gray-500">
                  <span>{t('home.dashboard.links.expiredAgo')} 2 {t('home.dashboard.links.daysAgo')}</span>
                  <span>{t('home.dashboard.links.clicks')}: 8</span>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 bg-gray-50">
              <button className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                {t('home.dashboard.links.createNew')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardComponent;
