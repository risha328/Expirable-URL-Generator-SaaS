import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import toast, { Toaster } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import api from '../api/api';
import { loadRazorpayScript, openRazorpayCheckout } from '../utils/razorpay';

const Pricing = () => {
  const { t } = useTranslation();
  const [isAnnual, setIsAnnual] = useState(true);
  const [payingPlan, setPayingPlan] = useState(null);
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  // Display prices in INR to match Razorpay planConfig (paise → rupees)
  const plans = [
    {
      id: 'Free',
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
      id: 'Pro',
      name: t('pricing.plans.pro.name'),
      description: t('pricing.plans.pro.description'),
      price: { monthly: 399, annual: 3990 },
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
      id: 'Business',
      name: t('pricing.plans.business.name'),
      description: t('pricing.plans.business.description'),
      price: { monthly: 999, annual: 9990 },
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
      id: 'Enterprise',
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

  const toggleBilling = () => setIsAnnual(!isAnnual);

  const handlePayNow = async (planId) => {
    if (!user) {
      navigate('/login', { state: { from: { pathname: '/pricing' } } });
      return;
    }

    if (planId === 'Free') {
      navigate('/dashboard');
      return;
    }

    if (planId === 'Enterprise') {
      navigate('/contact');
      return;
    }

    if (planId !== 'Pro' && planId !== 'Business') {
      return;
    }

    setPayingPlan(planId);

    try {
      const loaded = await loadRazorpayScript();
      if (!loaded) {
        toast.error('Unable to load Razorpay. Please try again.');
        return;
      }

      const billingCycle = isAnnual ? 'annual' : 'monthly';

      // Use one-time Orders API (stable). Subscriptions require Plans API which returns 401 on this account.
      const { data: order } = await api.post('/payments/create-order', {
        plan: planId,
        billingCycle,
      });

      if (!order?.orderId || !order?.keyId || !order?.amount) {
        throw new Error(order?.message || 'Failed to create Razorpay order. Check backend logs.');
      }

      const paymentResponse = await openRazorpayCheckout({
        key: order.keyId,
        amount: Number(order.amount),
        currency: order.currency || 'INR',
        name: 'Expireo',
        description: `${planId} plan (${billingCycle})`,
        order_id: order.orderId,
        prefill: {
          name: order.prefill?.name || `${user.firstName || ''} ${user.lastName || ''}`.trim(),
          email: order.prefill?.email || user.email || '',
          contact: order.prefill?.contact || '',
        },
        notes: {
          plan: planId,
          billingCycle,
        },
        theme: { color: '#4F46E5' },
      });

      if (!paymentResponse?.razorpay_payment_id) {
        throw new Error('Payment was not completed');
      }

      const { data: verified } = await api.post('/payments/verify', {
        razorpay_order_id: paymentResponse.razorpay_order_id,
        razorpay_payment_id: paymentResponse.razorpay_payment_id,
        razorpay_signature: paymentResponse.razorpay_signature,
      });

      if (verified.user) {
        localStorage.setItem('user', JSON.stringify(verified.user));
        setUser(verified.user);
      }

      toast.success(t('pricing.toast.success') || 'Payment successful! Plan activated.');
      navigate('/billing');
    } catch (error) {
      if (error?.message === 'PAYMENT_CANCELLED') {
        toast.error('Payment cancelled');
      } else {
        console.error('Razorpay checkout error:', error);
        toast.error(
          error?.response?.data?.message ||
            error?.message ||
            t('pricing.toast.error') ||
            'Payment failed. Please try again.'
        );
      }
    } finally {
      setPayingPlan(null);
    }
  };

  const renderCta = (plan) => {
    const baseClass = `block w-full py-3 px-6 text-center rounded-md text-base font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed ${
      plan.popular
        ? 'bg-indigo-600 text-white hover:bg-indigo-700'
        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
    }`;

    if (plan.id === 'Pro' || plan.id === 'Business') {
      const isCurrent =
        user?.isSubscribed &&
        user?.subscriptionPlan === plan.id &&
        user?.subscriptionStatus === 'active';

      return (
        <button
          type="button"
          onClick={() => handlePayNow(plan.id)}
          disabled={!!payingPlan || isCurrent}
          className={baseClass}
        >
          {payingPlan === plan.id
            ? 'Processing...'
            : isCurrent
              ? 'Current Plan'
              : t('pricing.payNow')}
        </button>
      );
    }

    if (plan.id === 'Free') {
      return (
        <button type="button" onClick={() => handlePayNow('Free')} className={baseClass}>
          {plan.cta}
        </button>
      );
    }

    return (
      <Link to="/contact" className={baseClass}>
        {plan.cta}
      </Link>
    );
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
        <div className="mt-12 space-y-12 lg:space-y-0 lg:grid lg:grid-cols-4 lg:gap-x-8">
          {plans.map((plan) => (
            <div
              key={plan.id}
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
                        ₹{isAnnual ? plan.price.annual : plan.price.monthly}
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
                {typeof plan.price[isAnnual ? 'annual' : 'monthly'] === 'number' && isAnnual && plan.price.annual > 0 && (
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

              {renderCta(plan)}
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
            <Link
              to="/contact"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-white hover:bg-indigo-50"
            >
              {t('pricing.cta.contactSales')}
            </Link>
            <Link
              to="/contact"
              className="ml-4 inline-flex items-center px-6 py-3 border border-white text-base font-medium rounded-md text-white hover:bg-indigo-600"
            >
              {t('pricing.cta.scheduleDemo')}
            </Link>
          </div>
        </div>
      </div>
      <Toaster />
    </div>
  );
};

export default Pricing;
