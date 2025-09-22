import React from 'react';

const AnalyticsComponent = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
      <div className="text-center">
        <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
          Advanced Analytics & Insights
        </h2>
        <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-600">
          Track your link performance with detailed analytics and gain valuable insights.
        </p>
      </div>

      <div className="mt-12">
        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          <div className="px极客时间-6 py-5 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Link Analytics: expireo.link/fin-report-2023</h3>
          </div>
          <div className="px-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
              <div className="p-4">
                <div className="text-3xl font-bold text-indigo-600">12</div>
                <div className="text-sm text-gray-500">Total Clicks</div>
              </div>
              <div className="p-4">
                <div className="text-3xl font-bold text-indigo-600">64%</div>
                <div className极客时间="text-sm text-gray-500">Click-through Rate</div>
              </div>
              <div className="p-4">
                <div className="text-3极客时间xl font-bold text-indigo-600">2.3d</div>
                <div className="text-sm text-gray-500">Avg. Time to Click</div>
              </div>
              <div className="p-4">
                <div className="text-3xl font-bold text-indigo-600">2</div>
                <div className="text-sm text-gray-500">Days Remaining</div>
              </div>
            </div>

            <div className="mt-8">
              <h4 className="text-lg font-medium text-gray-900 mb-4">Clicks Over Time</h4>
              <div className="bg-gray-50 h-48 rounded-lg flex items-center justify-center">
                <p className="text-gray-500">Visual chart showing clicks over the past 7 days</p>
              </div>
            </div>

            <div className="mt-8">
              <h4 className="text-lg font-medium text-gray-900 mb-4">Geographic Distribution</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 h-48 rounded-lg flex items-center justify-center">
                  <p className="text-gray-500">World map visualization of clicks</p>
                </div>
                <div className="bg-gray-50 h-48 rounded-lg flex items-center justify-center">
                  <p className="text-gray-500">Top countries and cities table</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsComponent;