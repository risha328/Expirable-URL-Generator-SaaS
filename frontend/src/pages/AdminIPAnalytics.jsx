import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import AdminLayout from '../components/admin/AdminLayout';


const AdminIPAnalytics = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [ipAnalytics, setIPAnalytics] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  const [filters, setFilters] = useState({
    flagged: '',
    blocked: '',
    search: '',
    limit: 50
  });
  const [stats, setStats] = useState({
    totalIPs: 0,
    flaggedIPs: 0,
    blockedIPs: 0,
    totalRequests: 0
  });

  useEffect(() => {
    fetchIPAnalytics();
  }, [filters.limit]);

  useEffect(() => {
    applyFilters();
  }, [ipAnalytics, filters]);

  const fetchIPAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (filters.flagged) params.append('flagged', filters.flagged);
      if (filters.blocked) params.append('blocked', filters.blocked);
      params.append('limit', filters.limit);

      const response = await api.get(`/admin/security/ip-analytics?${params}`);
      setIPAnalytics(response.data.ipAnalytics);

      // Calculate stats
      const data = response.data.ipAnalytics;
      setStats({
        totalIPs: data.length,
        flaggedIPs: data.filter(ip => ip.flagged).length,
        blockedIPs: data.filter(ip => ip.blocked).length,
        totalRequests: data.reduce((sum, ip) => sum + (ip.requestCount || 0), 0)
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch IP analytics data');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = Array.isArray(ipAnalytics) ? [...ipAnalytics] : [];

    // Search filter
    if (filters.search) {
      filtered = filtered.filter(ip =>
        ip.ip.toLowerCase().includes(filters.search.toLowerCase()) ||
        (ip.country && ip.country.toLowerCase().includes(filters.search.toLowerCase())) ||
        (ip.city && ip.city.toLowerCase().includes(filters.search.toLowerCase()))
      );
    }

    setFilteredData(filtered);
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleBlockIP = async (ip) => {
    try {
      await api.post('/admin/security/block-ip', { ip });
      fetchIPAnalytics();
    } catch (err) {
      console.error('Failed to block IP:', err);
    }
  };

  const handleUnblockIP = async (ip) => {
    try {
      await api.post('/admin/security/unblock-ip', { ip });
      fetchIPAnalytics();
    } catch (err) {
      console.error('Failed to unblock IP:', err);
    }
  };

  const viewIPDetails = (ipData) => {
    navigate(`/admin/ip-analytics/${ipData._id}`, { state: { ipData } });
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

  return (
    <AdminLayout>
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">IP Analytics Dashboard</h1>
          <p className="text-gray-600">Monitor and manage IP addresses accessing your platform</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Total IPs Tracked</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalIPs.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <span className="text-2xl">🌐</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Flagged IPs</p>
                <p className="text-2xl font-bold text-orange-600">{stats.flaggedIPs.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-lg">
                <span className="text-2xl">⚠️</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Blocked IPs</p>
                <p className="text-2xl font-bold text-red-600">{stats.blockedIPs.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-red-100 rounded-lg">
                <span className="text-2xl">🚫</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Total Requests</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalRequests.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <span className="text-2xl">📊</span>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Filters</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
              <input
                type="text"
                placeholder="IP, Country, City..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Flagged Status</label>
              <select
                value={filters.flagged}
                onChange={(e) => handleFilterChange('flagged', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All</option>
                <option value="true">Flagged Only</option>
                <option value="false">Not Flagged</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Blocked Status</label>
              <select
                value={filters.blocked}
                onChange={(e) => handleFilterChange('blocked', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All</option>
                <option value="true">Blocked Only</option>
                <option value="false">Not Blocked</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Limit</label>
              <select
                value={filters.limit}
                onChange={(e) => handleFilterChange('limit', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="100">100</option>
                <option value="200">200</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={fetchIPAnalytics}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>

        {/* IP Analytics Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">IP Analytics ({filteredData.length})</h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">IP Address</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Requests</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Request</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredData.map((ipData, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{ipData.ip}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {ipData.country || 'Unknown'}, {ipData.city || 'Unknown'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{ipData.requestCount || 0}</div>
                      <div className="text-xs text-gray-500">
                        {ipData.linksAccessed?.length || 0} links accessed
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(ipData.lastRequest).toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex space-x-2">
                        {ipData.flagged && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                            Flagged
                          </span>
                        )}
                        {ipData.blocked && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            Blocked
                          </span>
                        )}
                        {!ipData.flagged && !ipData.blocked && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Clean
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => viewIPDetails(ipData)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          View Details
                        </button>
                        {!ipData.blocked ? (
                          <button
                            onClick={() => handleBlockIP(ipData.ip)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Block
                          </button>
                        ) : (
                          <button
                            onClick={() => handleUnblockIP(ipData.ip)}
                            className="text-green-600 hover:text-green-900"
                          >
                            Unblock
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>


      </div>
    </AdminLayout>
  );
};

export default AdminIPAnalytics;
