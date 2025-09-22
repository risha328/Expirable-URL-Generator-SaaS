import React, { useState } from 'react';

const AnalyticsComponent = () => {
  const [timeRange, setTimeRange] = useState('7d');
  const [activeTab, setActiveTab] = useState('overview');

  const statsData = {
    totalClicks: 1247,
    uniqueVisitors: 892,
    clickThroughRate: '68.2%',
    avgTimeToClick: '2.3d',
    daysRemaining: 15,
    conversionRate: '12.4%'
  };

  const timeSeriesData = {
    '7d': [
      { day: 'Mon', clicks: 45, height: '45%' },
      { day: 'Tue', clicks: 78, height: '78%' },
      { day: 'Wed', clicks: 112, height: '100%' },
      { day: 'Thu', clicks: 89, height: '80%' },
      { day: 'Fri', clicks: 134, height: '100%' },
      { day: 'Sat', clicks: 67, height: '60%' },
      { day: 'Sun', clicks: 34, height: '30%' }
    ],
    '30d': [
      { day: 'Week 1', clicks: 345, height: '70%' },
      { day: 'Week 2', clicks: 478, height: '90%' },
      { day: 'Week 3', clicks: 512, height: '100%' },
      { day: 'Week 4', clicks: 389, height: '75%' }
    ]
  };

  const geographicData = [
    { country: 'United States', city: 'New York', clicks: 324, percentage: '26%', flag: '🇺🇸' },
    { country: 'United Kingdom', city: 'London', clicks: 187, percentage: '15%', flag: '🇬🇧' },
    { country: 'Germany', city: 'Berlin', clicks: 156, percentage: '12.5%', flag: '🇩🇪' },
    { country: 'France', city: 'Paris', clicks: 134, percentage: '10.7%', flag: '🇫🇷' },
    { country: 'Canada', city: 'Toronto', clicks: 98, percentage: '7.8%', flag: '🇨🇦' },
    { country: 'Australia', city: 'Sydney', clicks: 76, percentage: '6.1%', flag: '🇦🇺' }
  ];

  const deviceData = [
    { device: 'Desktop', clicks: 678, percentage: '54.3%', icon: '💻' },
    { device: 'Mobile', clicks: 432, percentage: '34.6%', icon: '📱' },
    { device: 'Tablet', clicks: 137, percentage: '11.1%', icon: '📱' }
  ];

  const browserData = [
    { browser: 'Chrome', clicks: 645, percentage: '51.7%', color: 'bg-green-500' },
    { browser: 'Safari', clicks: 234, percentage: '18.8%', color: 'bg-blue-500' },
    { browser: 'Firefox', clicks: 187, percentage: '15.0%', color: 'bg-orange-500' },
    { browser: 'Edge', clicks: 98, percentage: '7.9%', color: 'bg-purple-500' },
    { browser: 'Other', clicks: 83, percentage: '6.6%', color: 'bg-gray-500' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-blue-600 bg-clip-text text-transparent">
            Advanced Analytics & Insights
          </h1>
          <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Track your link performance with comprehensive analytics and gain valuable insights into your audience behavior.
          </p>
        </div>

        {/* Analytics Dashboard */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          {/* Header with Tabs */}
          <div className="border-b border-gray-200">
            <div className="px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">expireo.link/fin-report-2023</h2>
                <p className="text-gray-500 mt-1">Created on Jan 15, 2024 • Expires in 15 days</p>
              </div>
              <div className="flex space-x-2 mt-4 sm:mt-0">
                <select 
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="7d">Last 7 days</option>
                  <option value="30d">Last 30 days</option>
                  <option value="90d">Last 90 days</option>
                  <option value="all">All time</option>
                </select>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200">
                  Export Data
                </button>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="px-6">
              <nav className="flex space-x-8">
                {['overview', 'geography', 'devices', 'referrers'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm capitalize transition-colors duration-200 ${
                      activeTab === tab
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {tab === 'overview' ? 'Overview' : 
                     tab === 'geography' ? 'Geography' :
                     tab === 'devices' ? 'Devices & Browsers' : 'Referrers'}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="p-6">
            {/* Stats Overview */}
            <div className="grid grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">{statsData.totalClicks.toLocaleString()}</div>
                <div className="text-sm text-blue-800 font-medium">Total Clicks</div>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-green-600">{statsData.uniqueVisitors.toLocaleString()}</div>
                <div className="text-sm text-green-800 font-medium">Unique Visitors</div>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-purple-600">{statsData.clickThroughRate}</div>
                <div className="text-sm text-purple-800 font-medium">Click Rate</div>
              </div>
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-orange-600">{statsData.avgTimeToClick}</div>
                <div className="text-sm text-orange-800 font-medium">Avg. Time</div>
              </div>
              <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-red-600">{statsData.daysRemaining}</div>
                <div className="text-sm text-red-800 font-medium">Days Left</div>
              </div>
              <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-indigo-600">{statsData.conversionRate}</div>
                <div className="text-sm text-indigo-800 font-medium">Conversion</div>
              </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
              {/* Click Chart */}
              <div className="xl:col-span-2 bg-gray-50 rounded-xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Clicks Over Time</h3>
                  <span className="text-sm text-gray-500">{timeRange === '7d' ? 'Last 7 days' : 'Last 30 days'}</span>
                </div>
                <div className="h-64">
                  <div className="flex justify-between items-end h-full space-x-2">
                    {timeSeriesData[timeRange].map((item, index) => (
                      <div key={index} className="flex flex-col items-center flex-1 group">
                        <div className="w-full flex flex-col justify-end h-full mb-2 relative">
                          <div
                            className="bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-lg transition-all duration-300 group-hover:from-blue-600 group-hover:to-blue-500 cursor-pointer"
                            style={{ height: item.height }}
                          >
                            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                              {item.clicks} clicks
                            </div>
                          </div>
                        </div>
                        <span className="text-sm font-medium text-gray-600">{item.day}</span>
                        <span className="text-xs text-blue-600 font-semibold">{item.clicks}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Devices Chart */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Devices</h3>
                <div className="space-y-4">
                  {deviceData.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{item.icon}</span>
                        <span className="font-medium text-gray-700">{item.device}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-gray-900">{item.clicks}</div>
                        <div className="text-sm text-gray-500">{item.percentage}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex space-x-2">
                    {deviceData.map((item, index) => (
                      <div
                        key={index}
                        className="h-2 rounded-full bg-gradient-to-r from-blue-400 to-purple-500"
                        style={{ width: item.percentage }}
                      ></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Geography & Browsers */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Geographic Distribution */}
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Geographic Distribution</h3>
                <div className="space-y-3">
                  {geographicData.map((location, index) => (
                    <div key={index} className="flex items-center justify-between py-2 group hover:bg-gray-50 rounded-lg px-2 transition-colors duration-200">
                      <div className="flex items-center space-x-3 flex-1">
                        <span className="text-2xl">{location.flag}</span>
                        <div>
                          <div className="font-medium text-gray-900">{location.country}</div>
                          <div className="text-sm text-gray-500">{location.city}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-gray-900">{location.clicks}</div>
                        <div className="text-sm text-gray-500">{location.percentage}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Browser Usage */}
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Browser Usage</h3>
                <div className="space-y-4">
                  {browserData.map((browser, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${browser.color}`}></div>
                        <span className="font-medium text-gray-700">{browser.browser}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-gray-900">{browser.clicks}</div>
                        <div className="text-sm text-gray-500">{browser.percentage}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Browser Share</span>
                    <span>100%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="flex h-2 rounded-full overflow-hidden">
                      {browserData.map((browser, index) => (
                        <div
                          key={index}
                          className={`${browser.color} transition-all duration-300 hover:opacity-80`}
                          style={{ width: browser.percentage }}
                        ></div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Insights */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">🚀</span>
              </div>
              <h4 className="font-semibold text-gray-900">Peak Performance</h4>
            </div>
            <p className="text-gray-600 text-sm">Friday between 2-4 PM is your highest engagement period</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">🌍</span>
              </div>
              <h4 className="font-semibold text-gray-900">Global Reach</h4>
            </div>
            <p className="text-gray-600 text-sm">Your link has reached users in 6 different countries</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">📱</span>
              </div>
              <h4 className="font-semibold text-gray-900">Mobile First</h4>
            </div>
            <p className="text-gray-600 text-sm">45.7% of your audience accesses via mobile devices</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsComponent;