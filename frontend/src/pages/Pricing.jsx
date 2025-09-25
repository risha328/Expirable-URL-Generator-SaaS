import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import toast, { Toaster } from 'react-hot-toast';

const Pricing = () => {
  const [isAnnual, setIsAnnual] = useState(true);
  const { user, updateSubscription } = useContext(AuthContext);
  const navigate = useNavigate();

  const plans = [
    {
      name: 'Free',
      description: 'Perfect for individuals getting started',
      price: { monthly: 0, annual: 0 },
      features: [
        '5 expirable links per month',
        'Basic analytics (click count)',
        '24-hour link expiration',
        'No password protection',
        'Standard support'
      ],
      cta: 'Get Started',
      popular: false
    },
    {
      name: 'Pro',
      description: 'Ideal for professionals and small teams',
      price: { monthly: 9, annual: 90 },
      features: [
        'Unlimited expirable links',
        'Advanced analytics (geography, devices)',
        'Custom expiration times',
        'Password protection',
        'Custom branding',
        'Priority support',
        'File sharing (up to 100MB)'
      ],
      cta: 'Start Free Trial',
      popular: true
    },
    {
      name: 'Business',
      description: 'For organizations with advanced needs',
      price: { monthly: 29, annual: 290 },
      features: [
        'Everything in Pro, plus:',
        'Team members (up to 5)',
        'Custom domains',
        'API access',
        'Advanced security features',
        'File sharing (up to 1GB)',
        'White-label options',
        'Dedicated account manager'
      ],
      cta: 'Contact Sales',
      popular: false
    },
    {
      name: 'Enterprise',
      description: 'For large organizations with custom requirements',
      price: { monthly: 'Custom', annual: 'Custom' },
      features: [
        'Unlimited team members',
        'SAML/SSO integration',
        'Custom SLAs',
        'Advanced compliance (GDPR, HIPAA)',
        'On-premise deployment options',
        'Custom integration support',
        '24/7 premium support',
        'Training and onboarding'
      ],
      cta: 'Contact Sales',
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
        toast.success('You Successfully subscribed and you get all pro version features');
        navigate('/dashboard');
      } catch (error) {
        toast.error('Failed to update subscription. Please try again.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
            Simple, Transparent Pricing
          </h1>
          <p className="mt-5 max-w-xl mx-auto text-xl text-gray-600">
            Choose the plan that works best for you and your team
          </p>
          
          {/* Billing Toggle */}
          <div className="mt-8 flex justify-center items-center">
            <span className={`text-lg font-medium ${!isAnnual ? 'text-indigo-600' : 'text-gray-500'}`}>Monthly</span>
            <button
              onClick={toggleBilling}
              className="mx-4 relative inline-flex items-center h-6 rounded-full w-12 bg-indigo-600 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <span className="sr-only">Toggle billing</span>
              <span
                className={`${
                  isAnnual ? 'translate-x-6' : 'translate-x-1'
                } inline-block w-4 h-4 transform bg-white rounded-full transition-transform`}
              />
            </button>
            <div className="flex items-center">
              <span className={`text-lg font-medium ${isAnnual ? 'text-indigo-600' : 'text-gray-500'}`}>Annual</span>
              <span className="ml-2 px-2 py-1 text-xs font-semibold text-green-800 bg-green-100 rounded-full">
                20% off
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
                  Most popular
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
                        {isAnnual ? '/year' : '/month'}
                      </span>
                    </>
                  ) : (
                    <span className="text-3xl font-extrabold tracking-tight text-gray-900">
                      {plan.price[isAnnual ? 'annual' : 'monthly']}
                    </span>
                  )}
                </div>
                {typeof plan.price[isAnnual ? 'annual' : 'monthly'] === 'number' && isAnnual && (
                  <p className="mt-1 text-sm text-gray-500">Billed annually</p>
                )}
              </div>
              
              <ul className="space-y-4 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center">
                    <svg
                      className="flex-shrink-0 w-5 h-5 text-green-500"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 极客时间 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
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
                  Pay Now
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
          <h2 className="text-3xl font-extrabold text-gray-900 text-center">Frequently asked questions</h2>
          <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-2">
            <div>
              <h3 className="text-lg font-medium text-gray-900">Can I change plans anytime?</h3>
              <p className="mt-2 text-base text-gray-600">
                Yes, you can upgrade, downgrade, or cancel your plan at any time. Changes to your plan will be reflected in your next billing cycle.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">Do you offer discounts for non-profits?</h3>
              <p className="mt-2 text-base text-gray-600">
                Absolutely! We offer special pricing for non-profit organizations and educational institutions. Contact our sales team for more information.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">What payment methods do you accept?</h3>
              <p className="mt-2 text-base text-gray-600">
                We accept all major credit cards, PayPal, and for annual plans we also support bank transfers.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">Is there a setup fee?</h3>
              <p className="mt-2 text-base text-gray-600">
                No, there are no setup fees for any of our plans. You only pay the advertised price.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">Can I get a refund?</h3>
              <p className="mt-2 text-base text-gray-600">
                We offer a 14-day money-back guarantee for all annual plans. Monthly plans can be canceled at any time without further charges.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">Do you offer custom plans?</h3>
              <p className="mt-2 text-base text-gray-600">
                Yes, we can create custom plans for organizations with specific needs. Contact our sales team to discuss your requirements.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-24 bg-indigo-700 rounded-2xl p-8 text-center">
          <h2 className="text-3xl font-extrabold text-white">Still have questions?</h2>
          <p className="mt-4 text-xl text-indigo-200">
            Our team is here to help you choose the right plan for your needs.
          </p>
          <div className="mt-8">
            <a
              href="#"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-white hover:bg-indigo-50"
            >
              Contact Sales
            </a>
            <a
              href="#"
              className="ml-4 inline-flex items-center px-6 py-3 border border-white text-base font-medium rounded-md text-white hover:bg-indigo-600"
            >
              Schedule a Demo
            </a>
          </div>
        </div>
      </div>
      <Toaster />
    </div>
  );
};

export default Pricing;
