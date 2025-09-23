import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/admin/AdminLayout';
import api from '../api/api';

export default function AdminLinks() {
  const [allLinks, setAllLinks] = useState([]);
  const [reportedLinks, setReportedLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    fetchLinks();
  }, []);

  const fetchLinks = async () => {
    setLoading(true);
    try {
      const [allResponse, reportedResponse] = await Promise.all([
        api.get('/url/admin/all'),
        api.get('/url/admin/reported')
      ]);
      setAllLinks(allResponse.data);
      setReportedLinks(reportedResponse.data);
    } catch (error) {
      console.error('Error fetching links:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this link?')) {
      try {
        await api.delete(`/url/admin/delete/${id}`);
        fetchLinks(); // Refresh data
      } catch (error) {
        console.error('Error deleting link:', error);
      }
    }
  };

  const handleForceExpire = async (id) => {
    if (window.confirm('Are you sure you want to force expire this link?')) {
      try {
        await api.put(`/url/admin/expire/${id}`);
        fetchLinks(); // Refresh data
      } catch (error) {
        console.error('Error expiring link:', error);
      }
    }
  };

  const handleWarnUser = async (userId) => {
    if (window.confirm('Are you sure you want to warn this user?')) {
      try {
        await api.post(`/url/admin/warn/${userId}`);
        alert('User warned successfully');
      } catch (error) {
        console.error('Error warning user:', error);
      }
    }
  };

  const handleBlockUser = async (userId) => {
    if (window.confirm('Are you sure you want to block this user?')) {
      try {
        await api.put(`/url/admin/block/${userId}`);
        fetchLinks(); // Refresh data
      } catch (error) {
        console.error('Error blocking user:', error);
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status) => {
    const badges = {
      active: 'bg-green-100 text-green-800',
      expired: 'bg-red-100 text-red-800',
      reported: 'bg-yellow-100 text-yellow-800'
    };
    return badges[status] || 'bg-gray-100 text-gray-800';
  };

  const LinkTable = ({ links, showActions = true }) => (
    <div className="bg-white shadow-sm rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Short URL
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Target URL
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Owner
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created At
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Clicks
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              {showActions && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {links.map((link) => (
              <tr key={link._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-blue-600">
                  {link.slug}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 max-w-xs truncate">
                  <a
                    href={link.targetUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800"
                  >
                    {link.targetUrl}
                  </a>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {link.ownerId ? (
                    <div>
                      <div className="font-medium">{link.ownerId.firstName} {link.ownerId.lastName}</div>
                      <div className="text-gray-500">{link.ownerId.email}</div>
                    </div>
                  ) : (
                    <span className="text-gray-500">Unknown</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(link.createdAt)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {link.clicks || 0}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(link.status)}`}>
                    {link.status}
                  </span>
                </td>
                {showActions && (
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button
                      onClick={() => handleDelete(link._id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                    {link.status === 'active' && (
                      <button
                        onClick={() => handleForceExpire(link._id)}
                        className="text-orange-600 hover:text-orange-900"
                      >
                        Force Expire
                      </button>
                    )}
                    {link.ownerId && (
                      <>
                        <button
                          onClick={() => handleWarnUser(link.ownerId._id)}
                          className="text-yellow-600 hover:text-yellow-900"
                        >
                          Warn User
                        </button>
                        <button
                          onClick={() => handleBlockUser(link.ownerId._id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Block User
                        </button>
                      </>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Links Management</h1>
        <p className="text-gray-600">Manage all links and handle reported content.</p>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('all')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'all'
                  ? 'border-red-500 text-red-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              All Links ({allLinks.length})
            </button>
            <button
              onClick={() => setActiveTab('reported')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'reported'
                  ? 'border-red-500 text-red-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Reported Links ({reportedLinks.length})
            </button>
          </nav>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
        </div>
      ) : (
        <>
          {activeTab === 'all' && <LinkTable links={allLinks} />}
          {activeTab === 'reported' && <LinkTable links={reportedLinks} showActions={true} />}
        </>
      )}
    </AdminLayout>
  );
}
