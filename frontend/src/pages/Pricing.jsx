import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import toast, { Toaster } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

const Pricing = () => {
  const { t } = useTranslation();
  const [isAnnual, setIsAnnual] = useState(true);
  const { user, updateSubscription } = useContext(AuthContext);
  const navigate = useNavigate();

  const plans = [
    {
      name: t('pricing.plans.free.name'),
      description: t('pricing.plans.free.description'),
      price: { monthly: 0, annual: 0 },
      features: [
        t('pricing.plans.free.features.1'),
        t('pricing.plans.free.features.2'),
        t('pricing.plans.free.features.3'),
        t('pricing.plans.free.features.4'),
        t('pricing.plans.free.features.5')
      ],
      cta: t('pricing.plans.free.cta'),
      popular: false
    },
    {
      name: t('pricing.plans.pro.name'),
      description: t('pricing.plans.pro.description'),
      price: { monthly: 4, annual: 40 },
      features: [
        t('pricing.plans.pro.features.1'),
        t('pricing.plans.pro.features.2'),
        t('pricing.plans.pro.features.3'),
        t('pricing.plans.pro.features.4'),
        t('pricing.plans.pro.features.5'),
        t('pricing.plans.pro.features.6'),
        t('pricing.plans.pro.features.7')
      ],
      cta: t('pricing.plans.pro.cta'),
      popular: true
    },
    {
      name: t('pricing.plans.business.name'),
      description: t('pricing.plans.business.description'),
      price: { monthly: 10, annual: 100 },
      features: [
        t('pricing.plans.business.features.1'),
        t('pricing.plans.business.features.2'),
        t('pricing.plans.business.features.3'),
        t('pricing.plans.business.features.4'),
        t('pricing.plans.business.features.5'),
        t('pricing.plans.business.features.6'),
        t('pricing.plans.business.features.7'),
        t('pricing.plans.business.features.8')
      ],
      cta: t('pricing.plans.business.cta'),
      popular: false
    },
    {
      name: t('pricing.plans.enterprise.name'),
      description: t('pricing.plans.enterprise.description'),
      price: { monthly: t('pricing.plans.enterprise.custom'), annual: t('pricing.plans.enterprise.custom') },
      features: [
        t('pricing.plans.enterprise.features.1'),
        t('pricing.plans.enterprise.features.2'),
        t('pricing.plans.enterprise.features.3'),
        t('pricing.plans.enterprise.features.4'),
        t('pricing.plans.enterprise.features.5'),
        t('pricing.plans.enterprise.features.6'),
        t('pricing.plans.enterprise.features.7'),
        t('pricing.plans.enterprise.features.8')
      ],
      cta: t('pricing.plans.enterprise.cta'),
      popular: false
    }
  ];

  const toggleBilling = () => {
    setIsAnnual(!isAnnual);
  };

  const handlePayNow = async (planName) => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (planName === 'Pro') {
      try {
        await updateSubscription(true, planName);
        toast.success(t('pricing.toast.success'));
        navigate('/dashboard');
      } catch (error) {
        toast.error(t('pricing.toast.error'));
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
            {t('pricing.header')}
          </h1>
          <p className="mt-5 max-w-xl mx-auto text-xl text-gray-600">
            {t('pricing.description')}
          </p>

          {/* Billing Toggle */}
          <div className="mt-8 flex justify-center items-center">
            <span className={`text-lg font-medium ${!isAnnual ? 'text-indigo-600' : 'text-gray-500'}`}>{t('pricing.billing.monthly')}</span>
            <button
              onClick={toggleBilling}
              className="mx-4 relative inline-flex items-center h-6 rounded-full w-12 bg-indigo-600 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <span className="sr-only">{t('pricing.billing.toggle')}</span>
              <span
                className={`${
                  isAnnual ? 'translate-x-6' : 'translate-x-1'
                } inline-block w-4 h-4 transform bg-white rounded-full transition-transform`}
              />
            </button>
            <div className="flex items-center">
              <span className={`text-lg font-medium ${isAnnual ? 'text-indigo-600' : 'text-gray-500'}`}>{t('pricing.billing.annual')}</span>
              <span className="ml-2 px-2 py-1 text-xs font-semibold text-green-800 bg-green-100 rounded-full">
                {t('pricing.billing.discount')}
              </span>
            </div>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="mt-16 space-y-12 lg:space-y-0 lg:grid lg:grid-cols-4 lg:gap-x-8">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative p-8 bg-white rounded-2xl shadow-sm border ${
                plan.popular ? 'border-indigo-500 ring-2 ring-indigo-500' : 'border-gray-200'
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 py-1.5 px-4 bg-indigo-500 rounded-full text-xs font-semibold uppercase tracking-wide text-white transform -translate-y-1/2">
                  {t('pricing.popular')}
                </div>
              )}

              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900">{plan.name}</h2>
                <p className="mt-2 text-gray-600">{plan.description}</p>
              </div>

              <div className="mb-6">
                <div className="flex items-baseline">
                  {typeof plan.price[isAnnual ? 'annual' : 'monthly'] === 'number' ? (
                    <>
                      <span className="text-4xl font-extrabold tracking-tight text-gray-900">
                        ${isAnnual ? plan.price.annual : plan.price.monthly}
                      </span>
                      <span className="ml-1 text-xl font-semibold text-gray-500">
                        {isAnnual ? t('pricing.billing.perYear') : t('pricing.billing.perMonth')}
                      </span>
                    </>
                  ) : (
                    <span className="text-3xl font-extrabold tracking-tight text-gray-900">
                      {plan.price[isAnnual ? 'annual' : 'monthly']}
                    </span>
                  )}
                </div>
                {typeof plan.price[isAnnual ? 'annual' : 'monthly'] === 'number' && isAnnual && (
                  <p className="mt-1 text-sm text-gray-500">{t('pricing.billing.billedAnnually')}</p>
                )}
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <svg
                      className="flex-shrink-0 w-5 h-5 text-green-500"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="ml-3 text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>

              {plan.name === 'Pro' ? (
                <button
                  onClick={() => handlePayNow(plan.name)}
                  className={`block w-full py-3 px-6 text-center rounded-md text-base font-semibold ${
                    plan.popular
                      ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                >
                  {t('pricing.payNow')}
                </button>
              ) : (
                <a
                  href="#"
                  className={`block w-full py-3 px-6 text-center rounded-md text-base font-semibold ${
                    plan.popular
                      ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                >
                  {plan.cta}
                </a>
              )}
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="mt-24">
          <h2 className="text-3xl font-extrabold text-gray-900 text-center">{t('pricing.faq.header')}</h2>
          <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-2">
            <div>
              <h3 className="text-lg font-medium text-gray-900">{t('pricing.faq.changePlans.question')}</h3>
              <p className="mt-2 text-base text-gray-600">
                {t('pricing.faq.changePlans.answer')}
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">{t('pricing.faq.nonProfits.question')}</h3>
              <p className="mt-2 text-base text-gray-600">
                {t('pricing.faq.nonProfits.answer')}
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">{t('pricing.faq.paymentMethods.question')}</h3>
              <p className="mt-2 text-base text-gray-600">
                {t('pricing.faq.paymentMethods.answer')}
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">{t('pricing.faq.setupFee.question')}</h3>
              <p className="mt-2 text-base text-gray-600">
                {t('pricing.faq.setupFee.answer')}
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">{t('pricing.faq.refund.question')}</h3>
              <p className="mt-2 text-base text-gray-600">
                {t('pricing.faq.refund.answer')}
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">{t('pricing.faq.customPlans.question')}</h3>
              <p className="mt-2 text-base text-gray-600">
                {t('pricing.faq.customPlans.answer')}
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-24 bg-indigo-700 rounded-2xl p-8 text-center">
          <h2 className="text-3xl font-extrabold text-white">{t('pricing.cta.questions')}</h2>
          <p className="mt-4 text-xl text-indigo-200">
            {t('pricing.cta.description')}
          </p>
          <div className="mt-8">
            <a
              href="#"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-white hover:bg-indigo-50"
            >
              {t('pricing.cta.contactSales')}
            </a>
            <a
              href="#"
              className="ml-4 inline-flex items-center px-6 py-3 border border-white text-base font-medium rounded-md text-white hover:bg-indigo-600"
            >
              {t('pricing.cta.scheduleDemo')}
            </a>
          </div>
        </div>
      </div>
      <Toaster />
    </div>
  );
};

export default Pricing;
