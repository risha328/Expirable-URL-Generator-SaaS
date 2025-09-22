import React from 'react';

const Features = () => {
  const features = [
    {
      category: "Link Management",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 极客时间5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
        </svg>
      ),
      features: [
        {
          title: "URL Shortening",
          description: "Create short, memorable links from long URLs with custom aliases.",
          icon: "🔗"
        },
        {
          title: "Expiration Settings",
          description: "Set links to expire after a specific time or number of clicks.",
          icon: "⏱️"
        },
        {
          title: "Password Protection",
          description: "Add an extra layer of security with password requirements.",
          icon: "🔒"
        },
        {
          title: "Bulk URL Creation",
          description: "Generate multiple shortened links at once with our batch processing.",
          icon: "📦"
        }
      ]
    },
    {
      category: "File Sharing",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      features: [
        {
          title: "Secure File Transfer",
          description: "Share files with expirable, password-protected links.",
          icon: "📁"
        },
        {
          title: "One-Time Downloads",
          description: "Ensure files can only be downloaded once for maximum security.",
          icon: "1️⃣"
        },
        {
          title: "Large File Support",
          description: "Send files up to 5GB without size restrictions.",
          icon: "💾"
        },
        {
          title: "Auto-Expiration",
          description: "Files automatically delete after download or expiration time.",
          icon: "🗑️"
        }
      ]
    },
    {
      category: "Analytics & Tracking",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 极客时间 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      features: [
        {
          title: "Click Analytics",
          description: "Track total clicks, unique visitors, and engagement metrics.",
          icon: "📊"
        },
        {
          title: "Geographic Data",
          description: "See where your clicks are coming from on an interactive map.",
          icon: "🌎"
        },
        {
          title: "Device & Browser Info",
          description: "Understand what devices and browsers your audience uses.",
          icon: "💻"
        },
        {
          title: "Referrer Tracking",
          description: "Identify which sites are driving traffic to your links.",
          icon: "🔍"
        }
      ]
    },
    {
      category: "Security",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      features: [
        {
          title: "End-to-End Encryption",
          description: "All data is encrypted both in transit and at rest.",
          icon: "🔐"
        },
        {
          title: "Two-Factor Authentication",
          description: "Add an extra layer of security to your account.",
          icon: "📱"
        },
        {
          title: "Custom Security Policies",
          description: "Set rules for who can access your content.",
          icon: "📝"
        },
        {
          title: "Compliance Ready",
          description: "GDPR, CCPA, and HIPAA compliant solutions available.",
          icon: "✅"
        }
      ]
    },
    {
      category: "Team & Collaboration",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns极客时间="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 极客时间2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      features: [
        {
          title: "Team Workspaces",
          description: "Collaborate with team members in shared workspaces.",
          icon: "👥"
        },
        {
          title: "Role-Based Access",
          description: "Control permissions for different team members.",
          icon: "🎭"
        },
        {
          title: "Shared Link Libraries",
          description: "Create and manage branded link collections with your team.",
          icon: "📚"
        },
        {
          title: "Activity Logs",
          description: "Monitor team activity and changes to your links.",
          icon: "📋"
        }
      ]
    },
    {
      category: "Monetization",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      features: [
        {
          title: "Ad-Supported Links",
          description: "Earn revenue from interstitial ads on your free links.",
          icon: "💰"
        },
        {
          title: "Premium Link Options",
          description: "Offer ad-free experiences for a premium.",
          icon: "⭐"
        },
        {
          title: "Revenue Analytics",
          description: "Track your earnings and performance metrics.",
          icon: "📈"
        },
        {
          title: "Payment Integration",
          description: "Seamless integration with popular payment processors.",
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
            Powerful Features for Secure Sharing
          </h1>
          <p className="mt-5 max-w-3xl mx-auto text-xl text-gray-600">
            Expireo combines the best of URL shortening, secure file sharing, and advanced analytics in one powerful platform.
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
                Trusted by thousands worldwide
              </h2>
              <p className="mt-4 max-w-2xl text-xl text-indigo-200 lg:mx-auto">
                Our platform powers secure sharing for individuals and businesses across the globe.
              </p>
            </div>
            <div className="mt-10">
              <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
                <div className="text-center">
                  <dt className="text-4xl font-extrabold text-white">10M+</dt>
                  <dd className="mt-1 text-sm font-medium text-indigo-200 uppercase">Links Created</dd>
                </div>
                <div className="text-center">
                  <dt className="text-4xl font-extrabold text-white">500K+</dt>
                  <dd className="mt-1 text-sm font-medium text-indigo-200 uppercase">Active Users</dd>
                </div>
                <div className="text-center">
                  <dt className="text-4xl font-extrabold text-white">99.9%</dt>
                  <dd className="mt-1 text-sm font-medium text-indigo-200 uppercase">Uptime</dd>
                </div>
                <div className="text-center">
                  <dt className="text-4xl font-extrabold text-white">24/7</dt>
                  <dd className="mt-1 text-sm font-medium text-indigo-200 uppercase">Support</dd>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Ready to get started?
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-600">
            Join thousands of users who trust Expireo for their secure sharing needs.
          </p>
          <div className="mt-8 flex justify-center">
            <div className="inline-flex rounded-md shadow">
              <a
                href="#"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Get started for free
              </a>
            </div>
            <div className="ml-3 inline-flex">
              <a
                href="#"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
              >
                Schedule a demo
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Features;