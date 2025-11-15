import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
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
import { Line } from 'react-chartjs-2';

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

const AdminIPDetails = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [ipData, setIPData] = useState(null);

  useEffect(() => {
    if (location.state?.ipData) {
      setIPData(location.state.ipData);
      setLoading(false);
    } else {
      // If no state, fetch the data (fallback)
      fetchIPDetails();
    }
  }, [location.state, id]);

  const fetchIPDetails = async () => {
    try {
      setLoading(true);
      // Note: This assumes you have an endpoint to get single IP details
      // For now, we'll use the list endpoint and find the IP
      const response = await api.get('/admin/security/ip-analytics?limit=1000');
      const foundIP = response.data.ipAnalytics.find(ip => ip._id === id);
      if (foundIP) {
        setIPData(foundIP);
      } else {
        setError('IP not found');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch IP details');
    } finally {
      setLoading(false);
    }
  };

  const handleBlockIP = async () => {
    try {
      await api.post('/admin/security/block-ip', { ip: ipData.ip });
      // Refresh data
      fetchIPDetails();
    } catch (err) {
      console.error('Failed to block IP:', err);
    }
  };

  const handleUnblockIP = async () => {
    try {
      await api.post('/admin/security/unblock-ip', { ip: ipData.ip });
      // Refresh data
      fetchIPDetails();
    } catch (err) {
      console.error('Failed to unblock IP:', err);
    }
  };

  // Chart data for IP activity over time
  const generateActivityChart = () => {
    if (!ipData || !ipData.requestTimestamps) return { labels: [], datasets: [] };

    // Group timestamps by hour
    const hourlyData = {};
    ipData.requestTimestamps.forEach(timestamp => {
      const hour = new Date(timestamp.timestamp).toISOString().slice(0, 13);
      hourlyData[hour] = (hourlyData[hour] || 0) + 1;
    });

    const labels = Object.keys(hourlyData).sort();
    const data = labels.map(hour => hourlyData[hour]);

    return {
      labels: labels.map(hour => new Date(hour + ':00:00').toLocaleString()),
      datasets: [{
        label: 'Requests per Hour',
        data,
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4
      }]
    };
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

  if (error || !ipData) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-red-600">Error: {error || 'IP data not available'}</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">IP Details: {ipData.ip}</h1>
              <p className="text-gray-600">Detailed analytics for IP address {ipData.ip}</p>
            </div>
            <button
              onClick={() => navigate('/admin/ip-analytics')}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Back to IP Analytics
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mb-6 flex space-x-4">
          {!ipData.blocked ? (
            <button
              onClick={handleBlockIP}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Block IP
            </button>
          ) : (
            <button
              onClick={handleUnblockIP}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Unblock IP
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h4 className="font-medium text-gray-900 mb-4">Basic Information</h4>
            <div className="space-y-3 text-sm">
              <p><span className="font-medium">IP:</span> {ipData.ip}</p>
              <p><span className="font-medium">Country:</span> {ipData.country || 'Unknown'}</p>
              <p><span className="font-medium">City:</span> {ipData.city || 'Unknown'}</p>
              <p><span className="font-medium">Region:</span> {ipData.region || 'Unknown'}</p>
              <p><span className="font-medium">Total Requests:</span> {ipData.requestCount || 0}</p>
              <p><span className="font-medium">Links Accessed:</span> {ipData.linksAccessed?.length || 0}</p>
              <p><span className="font-medium">Last Request:</span> {new Date(ipData.lastRequest).toLocaleString()}</p>
              <p><span className="font-medium">First Seen:</span> {new Date(ipData.createdAt).toLocaleString()}</p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h4 className="font-medium text-gray-900 mb-4">Status Information</h4>
            <div className="space-y-3 text-sm">
              <p><span className="font-medium">Flagged:</span> {ipData.flagged ? 'Yes' : 'No'}</p>
              {ipData.flagged && (
                <>
                  <p><span className="font-medium">Flagged Reason:</span> {ipData.flaggedReason}</p>
                  <p><span className="font-medium">Flagged At:</span> {new Date(ipData.flaggedAt).toLocaleString()}</p>
                </>
              )}
              <p><span className="font-medium">Blocked:</span> {ipData.blocked ? 'Yes' : 'No'}</p>
              {ipData.blocked && (
                <>
                  <p><span className="font-medium">Block Reason:</span> {ipData.blockReason}</p>
                  <p><span className="font-medium">Blocked At:</span> {new Date(ipData.blockedAt).toLocaleString()}</p>
                  {ipData.resetTime && (
                    <p><span className="font-medium">Reset Time:</span> {new Date(ipData.resetTime).toLocaleString()}</p>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Activity Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <h4 className="font-medium text-gray-900 mb-4">Request Activity (Last 24 Hours)</h4>
          <div className="h-64">
            <Line
              data={generateActivityChart()}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { display: false },
                  tooltip: {
                    callbacks: {
                      label: (context) => `${context.parsed.y} requests`
                    }
                  }
                },
                scales: {
                  x: {
                    display: false
                  },
                  y: {
                    beginAtZero: true
                  }
                }
              }}
            />
          </div>
        </div>

        {/* Links Accessed */}
        {ipData.linksAccessed && ipData.linksAccessed.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h4 className="font-medium text-gray-900 mb-4">Links Accessed</h4>
            <div className="max-h-60 overflow-y-auto">
              <div className="space-y-2 text-sm">
                {ipData.linksAccessed.map((link, index) => (
                  <div key={index} className="flex items-center space-x-2 p-2 bg-gray-50 rounded">
                    <span className="text-gray-500">•</span>
                    <span className="font-medium">{link.slug || link._id}</span>
                    {link.targetUrl && (
                      <span className="text-gray-600 truncate ml-2">→ {link.targetUrl}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminIPDetails;
