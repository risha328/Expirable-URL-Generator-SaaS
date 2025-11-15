import React, { useState, useEffect } from 'react';
import api from '../api/api';
import AdminLayout from '../components/admin/AdminLayout';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const AdminAnalytics = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [analyticsData, setAnalyticsData] = useState({
    summary: {},
    dailyClicks: [],
    monthlyClicks: [],
    mostClickedLinks: [],
    topActiveUsers: [],
    countryClicks: [],
    referrerData: [],
    deviceBrowserStats: { devices: [], browsers: [] }
  });
  const [activeTab, setActiveTab] = useState('overview');
  const [timeRange, setTimeRange] = useState('30'); // 7, 30, 90, 365
  const [chartView, setChartView] = useState('daily'); // daily, monthly


  useEffect(() => {
    fetchAnalyticsData();
  }, [timeRange, chartView]);



  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      setError(null);

      const endpoint = chartView === 'monthly'
        ? `/admin/analytics/monthly-clicks?months=${Math.ceil(timeRange / 30)}`
        : `/admin/analytics/daily-clicks?days=${timeRange}`;

      const [
        summaryRes,
        clicksRes,
        mostClickedRes,
        topUsersRes,
        countryRes,
        referrerRes,
        deviceBrowserRes
      ] = await Promise.all([
        api.get('/admin/analytics/summary'),
        api.get(endpoint),
        api.get('/admin/analytics/most-clicked-links'),
        api.get('/admin/analytics/top-active-users'),
        api.get('/admin/analytics/country-clicks'),
        api.get('/admin/analytics/referrer-data'),
        api.get('/admin/analytics/device-browser-stats')
      ]);

      setAnalyticsData({
        summary: summaryRes.data,
        dailyClicks: chartView === 'daily' ? clicksRes.data : [],
        monthlyClicks: chartView === 'monthly' ? clicksRes.data : [],
        mostClickedLinks: mostClickedRes.data,
        topActiveUsers: topUsersRes.data,
        countryClicks: countryRes.data,
        referrerData: referrerRes.data,
        deviceBrowserStats: deviceBrowserRes.data
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch analytics data');
    } finally {
      setLoading(false);
    }
  };





  // Generate chart data based on view type
  const generateChartData = () => {
    const data = chartView === 'monthly' ? analyticsData.monthlyClicks : analyticsData.dailyClicks;
    
    if (!data || data.length === 0) {
      return { labels: [], datasets: [] };
    }

    const labels = data.map(item => {
      const date = new Date(item._id);
      if (chartView === 'monthly') {
        return date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long'
        });
      } else {
        return date.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric'
        });
      }
    });

    const chartData = data.map(item => item.clicks);

    return {
      labels,
      datasets: [
        {
          label: chartView === 'monthly' ? 'Monthly Clicks' : 'Daily Clicks',
          data: chartData,
          backgroundColor: chartView === 'monthly' 
            ? 'rgba(59, 130, 246, 0.8)' 
            : 'rgba(68, 99, 239, 0.8)',
          borderColor: chartView === 'monthly' 
            ? 'rgb(59, 130, 246)' 
            : 'rgba(68, 125, 239, 1)',
          borderWidth: 2,
          borderRadius: 6,
          borderSkipped: false,
        }
      ]
    };
  };

  // Bar chart options
  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: chartView === 'monthly' 
          ? 'rgba(59, 130, 246, 0.5)' 
          : 'rgba(239, 68, 68, 0.5)',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          title: (context) => {
            const data = chartView === 'monthly' ? analyticsData.monthlyClicks : analyticsData.dailyClicks;
            const date = new Date(data[context[0].dataIndex]._id);
            if (chartView === 'monthly') {
              return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long'
              });
            } else {
              return date.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              });
            }
          },
          label: (context) => {
            return `${context.parsed.y.toLocaleString()} clicks`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          color: '#6b7280',
          font: {
            size: chartView === 'monthly' ? 11 : 12
          },
          maxRotation: chartView === 'monthly' ? 0 : 45,
          minRotation: chartView === 'monthly' ? 0 : 45
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        },
        ticks: {
          color: '#6b7280',
          font: {
            size: 12
          },
          callback: function(value) {
            return value >= 1000 ? (value / 1000).toFixed(1) + 'k' : value;
          }
        }
      }
    },
    interaction: {
      intersect: false,
      mode: 'index'
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-red-600">Error: {error}</div>
        </div>
      </AdminLayout>
    );
  }

  const chartData = generateChartData();

  return (
    <AdminLayout>
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Analytics</h1>
          <p className="text-gray-600">Comprehensive analytics and insights for all links</p>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Total Clicks</p>
                <p className="text-2xl font-bold text-gray-900">
                  {analyticsData.summary.totalClicks?.toLocaleString() || 0}
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <span className="text-2xl">📊</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Unique Users</p>
                <p className="text-2xl font-bold text-gray-900">
                  {analyticsData.summary.uniqueUsers?.toLocaleString() || 0}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <span className="text-2xl">👥</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Active Links</p>
                <p className="text-2xl font-bold text-gray-900">
                  {analyticsData.summary.uniqueLinks?.toLocaleString() || 0}
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <span className="text-2xl">🔗</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Avg Daily Clicks</p>
                <p className="text-2xl font-bold text-gray-900">
                  {Math.round(analyticsData.summary.averageClicksPerDay) || 0}
                </p>
              </div>
              <div className="p-3 bg-orange-100 rounded-lg">
                <span className="text-2xl">📈</span>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <div className="flex space-x-1 mb-4 sm:mb-0">
            {['overview', 'traffic', 'users', 'links'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                  activeTab === tab
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {tab === 'overview' ? 'Overview' :
                 tab === 'traffic' ? 'Traffic Insights' :
                 tab === 'users' ? 'Top Users' :
                 tab === 'links' ? 'Top Links' : ''}
              </button>
            ))}
          </div>

          <div className="flex space-x-4">
            <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setChartView('daily')}
                className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                  chartView === 'daily'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Daily
              </button>
              <button
                onClick={() => setChartView('monthly')}
                className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                  chartView === 'monthly'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Monthly
              </button>
            </div>

            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors duration-200"
            >
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 90 days</option>
              <option value="365">Last 12 months</option>
            </select>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Clicks Chart */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  {chartView === 'monthly' ? 'Monthly Clicks' : 'Daily Clicks'}
                </h3>
                <div className="text-sm text-gray-500">
                  {timeRange === '7' ? '7 days' : 
                   timeRange === '30' ? '30 days' : 
                   timeRange === '90' ? '90 days' : '12 months'}
                </div>
              </div>
              <div className="h-64">
                {chartData.labels.length > 0 ? (
                  <Bar data={chartData} options={barChartOptions} />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    No data available for the selected period
                  </div>
                )}
              </div>
            </div>

            {/* Device Stats */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Device Distribution</h3>
              <div className="space-y-4">
                {analyticsData.deviceBrowserStats.devices.map((device, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">
                        {device._id === 'desktop' ? '💻' : 
                         device._id === 'mobile' ? '📱' : 
                         device._id === 'tablet' ? '📱' : '🌐'}
                      </span>
                      <span className="font-medium text-gray-700 capitalize">{device._id}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-gray-900">{device.clicks.toLocaleString()}</div>
                      <div className="text-sm text-gray-500">
                        {analyticsData.summary.totalClicks > 0
                          ? Math.round((device.clicks / analyticsData.summary.totalClicks) * 100)
                          : 0}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'traffic' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Country Clicks */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Countries</h3>
              <div className="space-y-3">
                {analyticsData.countryClicks.slice(0, 8).map((country, index) => (
                  <div key={index} className="flex items-center justify-between py-2">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">🌍</span>
                      <span className="font-medium text-gray-700">{country.country || 'Unknown'}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-gray-900">{country.clicks.toLocaleString()}</div>
                      <div className="text-sm text-gray-500">{country.citiesCount} cities</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Referrer Data */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Referrers</h3>
              <div className="space-y-3">
                {analyticsData.referrerData.slice(0, 8).map((referrer, index) => (
                  <div key={index} className="flex items-center justify-between py-2">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">🔗</span>
                      <span className="font-medium text-gray-700 truncate max-w-xs">
                        {referrer.referrer || 'Direct'}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-gray-900">{referrer.clicks.toLocaleString()}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Top Active Users</h3>
            </div>
            <div className="divide-y divide-gray-200">
              {analyticsData.topActiveUsers.map((user, index) => (
                <div key={index} className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors duration-200">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-100 to-orange-100 rounded-full flex items-center justify-center">
                      <span className="text-red-600 font-semibold">
                        {user.user?.firstName?.[0]}{user.user?.lastName?.[0]}
                      </span>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">
                        {user.user?.firstName} {user.user?.lastName}
                      </div>
                      <div className="text-sm text-gray-500">{user.user?.email}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-gray-900">{user.totalClicks.toLocaleString()} clicks</div>
                    <div className="text-sm text-gray-500">
                      Last active: {new Date(user.lastActivity).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'links' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Most Clicked Links</h3>
            </div>
            <div className="divide-y divide-gray-200">
              {analyticsData.mostClickedLinks.map((link, index) => (
                <div key={index} className="p-6 hover:bg-gray-50 transition-colors duration-200">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-medium text-gray-900 text-sm bg-gray-100 px-2 py-1 rounded">
                      {link.slug}
                    </div>
                    <div className="text-sm font-semibold text-red-600">
                      {link.totalClicks.toLocaleString()} clicks
                    </div>
                  </div>
                  <div className="text-sm text-gray-600 truncate max-w-full mb-1">
                    {link.targetUrl}
                  </div>
                  <div className="text-xs text-gray-400">
                    Created: {new Date(link.createdAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}


      </div>
    </AdminLayout>
  );
};

export default AdminAnalytics;