import React from 'react';
import { useTranslation } from 'react-i18next';

const Features = () => {
  const { t } = useTranslation();

  const features = [
    {
      category: t('features.categories.linkManagement'),
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
        </svg>
      ),
      features: [
        {
          title: t('features.linkManagement.urlShortening.title'),
          description: t('features.linkManagement.urlShortening.description'),
          icon: "🔗"
        },
        {
          title: t('features.linkManagement.expirationSettings.title'),
          description: t('features.linkManagement.expirationSettings.description'),
          icon: "⏱️"
        },
        {
          title: t('features.linkManagement.passwordProtection.title'),
          description: t('features.linkManagement.passwordProtection.description'),
          icon: "🔒"
        },
        {
          title: t('features.linkManagement.bulkCreation.title'),
          description: t('features.linkManagement.bulkCreation.description'),
          icon: "📦"
        }
      ]
    },
    {
      category: t('features.categories.fileSharing'),
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      features: [
        {
          title: t('features.fileSharing.secureTransfer.title'),
          description: t('features.fileSharing.secureTransfer.description'),
          icon: "📁"
        },
        {
          title: t('features.fileSharing.oneTimeDownloads.title'),
          description: t('features.fileSharing.oneTimeDownloads.description'),
          icon: "1️⃣"
        },
        {
          title: t('features.fileSharing.largeFileSupport.title'),
          description: t('features.fileSharing.largeFileSupport.description'),
          icon: "💾"
        },
        {
          title: t('features.fileSharing.autoExpiration.title'),
          description: t('features.fileSharing.autoExpiration.description'),
          icon: "🗑️"
        }
      ]
    },
    {
      category: t('features.categories.analytics'),
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      features: [
        {
          title: t('features.analytics.clickAnalytics.title'),
          description: t('features.analytics.clickAnalytics.description'),
          icon: "📊"
        },
        {
          title: t('features.analytics.geographicData.title'),
          description: t('features.analytics.geographicData.description'),
          icon: "🌎"
        },
        {
          title: t('features.analytics.deviceInfo.title'),
          description: t('features.analytics.deviceInfo.description'),
          icon: "💻"
        },
        {
          title: t('features.analytics.referrerTracking.title'),
          description: t('features.analytics.referrerTracking.description'),
          icon: "🔍"
        }
      ]
    },
    {
      category: t('features.categories.security'),
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      features: [
        {
          title: t('features.security.endToEndEncryption.title'),
          description: t('features.security.endToEndEncryption.description'),
          icon: "🔐"
        },
        {
          title: t('features.security.twoFactorAuth.title'),
          description: t('features.security.twoFactorAuth.description'),
          icon: "📱"
        },
        {
          title: t('features.security.customPolicies.title'),
          description: t('features.security.customPolicies.description'),
          icon: "📝"
        },
        {
          title: t('features.security.compliance.title'),
          description: t('features.security.compliance.description'),
          icon: "✅"
        }
      ]
    },
    {
      category: t('features.categories.teamCollaboration'),
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      features: [
        {
          title: t('features.teamCollaboration.teamWorkspaces.title'),
          description: t('features.teamCollaboration.teamWorkspaces.description'),
          icon: "👥"
        },
        {
          title: t('features.teamCollaboration.roleBasedAccess.title'),
          description: t('features.teamCollaboration.roleBasedAccess.description'),
          icon: "🎭"
        },
        {
          title: t('features.teamCollaboration.sharedLibraries.title'),
          description: t('features.teamCollaboration.sharedLibraries.description'),
          icon: "📚"
        },
        {
          title: t('features.teamCollaboration.activityLogs.title'),
          description: t('features.teamCollaboration.activityLogs.description'),
          icon: "📋"
        }
      ]
    },
    {
      category: t('features.categories.monetization'),
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      features: [
        {
          title: t('features.monetization.adSupported.title'),
          description: t('features.monetization.adSupported.description'),
          icon: "💰"
        },
        {
          title: t('features.monetization.premiumOptions.title'),
          description: t('features.monetization.premiumOptions.description'),
          icon: "⭐"
        },
        {
          title: t('features.monetization.revenueAnalytics.title'),
          description: t('features.monetization.revenueAnalytics.description'),
          icon: "📈"
        },
        {
          title: t('features.monetization.paymentIntegration.title'),
          description: t('features.monetization.paymentIntegration.description'),
          icon: "💳"
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
            {t('features.header')}
          </h1>
          <p className="mt-5 max-w-3xl mx-auto text-xl text-gray-600">
            {t('features.description')}
          </p>
        </div>

        {/* Features Grid */}
        <div className="mt-16">
          {features.map((category, categoryIdx) => (
            <div key={categoryIdx} className={`py-12 ${categoryIdx % 2 === 0 ? 'bg-white' : 'bg-gray-50'} rounded-lg mb-8`}>
              <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="lg:text-center">
                  <div className="flex items-center justify-center w-12 h-12 bg-indigo-500 text-white rounded-md mx-auto">
                    {category.icon}
                  </div>
                  <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                    {category.category}
                  </h2>
                </div>

                <div className="mt-10">
                  <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
                    {category.features.map((feature, featureIdx) => (
                      <div key={featureIdx} className="relative">
                        <dt>
                          <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-100 text-2xl">
                            {feature.icon}
                          </div>
                          <p className="ml-16 text-lg leading-6 font-medium text-gray-900">
                            {feature.title}
                          </p>
                        </dt>
                        <dd className="mt-2 ml-16 text-base text-gray-600">
                          {feature.description}
                        </dd>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="bg-indigo-700 rounded-2xl py-12 px-8 mt-16">
          <div className="max-w-4xl mx-auto">
            <div className="lg:text-center">
              <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                {t('features.stats.trusted')}
              </h2>
              <p className="mt-4 max-w-2xl text-xl text-indigo-200 lg:mx-auto">
                {t('features.stats.description')}
              </p>
            </div>
            <div className="mt-10">
              <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
                <div className="text-center">
                  <dt className="text-4xl font-extrabold text-white">10M+</dt>
                  <dd className="mt-1 text-sm font-medium text-indigo-200 uppercase">{t('features.stats.linksCreated')}</dd>
                </div>
                <div className="text-center">
                  <dt className="text-4xl font-extrabold text-white">500K+</dt>
                  <dd className="mt-1 text-sm font-medium text-indigo-200 uppercase">{t('features.stats.activeUsers')}</dd>
                </div>
                <div className="text-center">
                  <dt className="text-4xl font-extrabold text-white">99.9%</dt>
                  <dd className="mt-1 text-sm font-medium text-indigo-200 uppercase">{t('features.stats.uptime')}</dd>
                </div>
                <div className="text-center">
                  <dt className="text-4xl font-extrabold text-white">24/7</dt>
                  <dd className="mt-1 text-sm font-medium text-indigo-200 uppercase">{t('features.stats.support')}</dd>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            {t('features.cta.ready')}
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-600">
            {t('features.cta.description')}
          </p>
          <div className="mt-8 flex justify-center">
            <div className="inline-flex rounded-md shadow">
              <a
                href="#"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                {t('features.cta.getStarted')}
              </a>
            </div>
            <div className="ml-3 inline-flex">
              <a
                href="#"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
              >
                {t('features.cta.scheduleDemo')}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Features;
