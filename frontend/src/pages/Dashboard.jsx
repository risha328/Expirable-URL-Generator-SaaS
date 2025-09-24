// import React, { useEffect, useState } from 'react';
// import api from '../api/api';
// import { Link } from 'react-router-dom';


// export default function Dashboard() {
//     const [links, setLinks] = useState([]);


//     useEffect(() => {
//         (async () => {
//             try {
//                 const res = await api.get('/url/my'); // backend: returns user's links
//                 setLinks(res.data);
//             } catch (err) { console.error(err); }
//         })();
//     }, []);


//     return (
//         <div>
//             <div className="flex justify-between items-center mb-4">
//                 <h2 className="text-xl font-semibold">Your Links</h2>
//                 <Link to="/create" className="px-3 py-1 bg-indigo-600 text-white rounded">Create</Link>
//             </div>


//             <div className="grid gap-3">
//                 {links.map(l => {
//                     const shortUrl = `http://localhost:5000/${l.slug}`;
//                     return (
//                         <div key={l._id} className="p-3 bg-white rounded shadow flex justify-between items-center">
//                             <div>
//                                 <a href={shortUrl} target="_blank" rel="noreferrer" className="text-blue-600">{shortUrl}</a>
//                                 <div className="text-sm text-gray-500">{l.targetUrl}</div>
//                             </div>
//                             <div className="flex gap-2">
//                                 <Link to={`/analytics/${l.slug}`} className="px-2 py-1 bg-gray-200 rounded">Analytics</Link>
//                             </div>
//                         </div>
//                     );
//                 })}
//             </div>
//         </div>
//     )
// }



import React, { useEffect, useState } from 'react';
import api from '../api/api';
import { Link } from 'react-router-dom';

export default function Dashboard() {
    const [links, setLinks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [stats, setStats] = useState({
        totalLinks: 0,
        totalClicks: 0,
        activeLinks: 0
    });
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchLinks();
        fetchDashboardStats();
    }, []);

    const fetchLinks = async () => {
        try {
            setIsLoading(true);
            const res = await api.get('/url/my');
            setLinks(res.data);
        } catch (err) { 
            console.error('Failed to fetch links:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchDashboardStats = async () => {
        try {
            const res = await api.get('/url/stats');
            setStats(res.data);
        } catch (err) {
            console.error('Failed to fetch stats:', err);
            // Set default stats if API fails
            setStats({
                totalLinks: 0,
                totalClicks: 0,
                activeLinks: 0
            });
        }
    };

    const deleteLink = async (slug) => {
        if (window.confirm('Are you sure you want to delete this link?')) {
            try {
                await api.delete(`/url/${slug}`);
                setLinks(links.filter(link => link.slug !== slug));
                // Update stats
                setStats(prev => ({
                    ...prev,
                    totalLinks: prev.totalLinks - 1
                }));
            } catch (err) {
                console.error('Failed to delete link:', err);
                alert('Failed to delete link. Please try again.');
            }
        }
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text).then(() => {
            // You can add a toast notification here
            alert('Link copied to clipboard!');
        });
    };

    const filteredLinks = links.filter(link => 
        link.targetUrl.toLowerCase().includes(searchTerm.toLowerCase()) ||
        link.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
        link.title?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const getClickPercentage = (clicks) => {
        if (stats.totalClicks === 0) return 0;
        return ((clicks / stats.totalClicks) * 100).toFixed(1);
    };

    const formatExpiryDate = (expiryDate) => {
        if (!expiryDate) return 'No expiry';
        return new Date(expiryDate).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getTimeRemaining = (expiryDate) => {
        if (!expiryDate) return 'Never expires';

        const now = new Date();
        const expiry = new Date(expiryDate);
        const diffMs = expiry - now;

        if (diffMs <= 0) return 'Expired';

        const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

        if (days > 0) {
            return `${days}d ${hours}h ${minutes}m`;
        } else if (hours > 0) {
            return `${hours}h ${minutes}m`;
        } else {
            return `${minutes}m`;
        }
    };

    const getExpiryStatus = (expiryDate) => {
        if (!expiryDate) return 'no-expiry';

        const now = new Date();
        const expiry = new Date(expiryDate);
        const diffMs = expiry - now;

        if (diffMs <= 0) return 'expired';
        if (diffMs <= 24 * 60 * 60 * 1000) return 'expiring-soon'; // Within 24 hours
        return 'active';
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'expired':
                return 'bg-red-100 text-red-800';
            case 'expiring-soon':
                return 'bg-yellow-100 text-yellow-800';
            case 'no-expiry':
                return 'bg-gray-100 text-gray-800';
            default:
                return 'bg-green-100 text-green-800';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'expired':
                return 'Expired';
            case 'expiring-soon':
                return 'Expires Soon';
            case 'no-expiry':
                return 'No Expiry';
            default:
                return 'Active';
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header Section */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                    <p className="text-gray-600 mt-2">Manage your expiration tracking links and view analytics</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                        <div className="flex items-center">
                            <div className="p-3 bg-blue-100 rounded-lg mr-4">
                                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-600">Total Links</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.totalLinks}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                        <div className="flex items-center">
                            <div className="p-3 bg-green-100 rounded-lg mr-4">
                                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-600">Total Clicks</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.totalClicks}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                        <div className="flex items-center">
                            <div className="p-3 bg-purple-100 rounded-lg mr-4">
                                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-600">Active Links</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.activeLinks}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Actions Bar */}
                <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-100">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div className="flex-1 w-full sm:max-w-md">
                            <div className="relative">
                                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                <input
                                    type="text"
                                    placeholder="Search links..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>
                        <Link 
                            to="/create" 
                            className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-2 px-6 rounded-lg transition-all duration-200 flex items-center justify-center"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Create New Link
                        </Link>
                    </div>
                </div>

                {/* Links Table */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    {isLoading ? (
                        <div className="flex flex-col justify-center items-center py-12">
                            <div className="relative">
                                <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200"></div>
                                <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent absolute top-0 left-0"></div>
                            </div>
                            <p className="mt-4 text-gray-600 font-medium">Loading your links...</p>
                            <div className="mt-2 flex space-x-1">
                                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
                                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                            </div>
                        </div>
                    ) : filteredLinks.length === 0 ? (
                        <div className="text-center py-12">
                            <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                            </svg>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No links found</h3>
                            <p className="text-gray-600 mb-4">
                                {searchTerm ? 'Try adjusting your search terms' : 'Get started by creating your first expiration tracking link'}
                            </p>
                            {!searchTerm && (
                                <Link 
                                    to="/create" 
                                    className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
                                >
                                    Create Your First Link
                                </Link>
                            )}
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Link</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Destination</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Clicks</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expires</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time Left</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {filteredLinks.map((link) => {
                                        const shortUrl = `${window.location.origin}/${link.slug}`;
                                        return (
                                            <tr key={link._id} className="hover:bg-gray-50 transition-colors duration-150">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
                                                            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                                                            </svg>
                                                        </div>
                                                        <div className="ml-4">
                                                            <div className="text-sm font-medium text-gray-900">
                                                                {link.title || 'Untitled Link'}
                                                            </div>
                                                            <div className="flex items-center space-x-2">
                                                                <a 
                                                                    href={shortUrl} 
                                                                    target="_blank" 
                                                                    rel="noopener noreferrer"
                                                                    className="text-sm text-blue-600 hover:text-blue-500 truncate max-w-xs"
                                                                >
                                                                    {shortUrl}
                                                                </a>
                                                                <button 
                                                                    onClick={() => copyToClipboard(shortUrl)}
                                                                    className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                                                                    title="Copy to clipboard"
                                                                >
                                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                                                    </svg>
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-sm text-gray-900 truncate max-w-xs" title={link.targetUrl}>
                                                        {link.targetUrl}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-sm font-medium text-gray-900">{link.clicks || 0}</div>
                                                    <div className="text-xs text-gray-500">
                                                        {getClickPercentage(link.clicks || 0)}% of total
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(getExpiryStatus(link.expiry))}`}>
                                                        {getStatusText(getExpiryStatus(link.expiry))}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {formatExpiryDate(link.expiry)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                    {getTimeRemaining(link.expiry)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <div className="flex items-center justify-end space-x-2">
                                                        <Link 
                                                            to={`/analytics/${link.slug}`}
                                                            className="bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-1 rounded-lg text-xs font-medium transition-colors duration-200 flex items-center"
                                                        >
                                                            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                                            </svg>
                                                            Analytics
                                                        </Link>
                                                        <button 
                                                            onClick={() => deleteLink(link.slug)}
                                                            className="bg-red-50 hover:bg-red-100 text-red-700 px-3 py-1 rounded-lg text-xs font-medium transition-colors duration-200 flex items-center"
                                                        >
                                                            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                            </svg>
                                                            Delete
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Footer Info */}
                {!isLoading && filteredLinks.length > 0 && (
                    <div className="mt-4 text-center">
                        <p className="text-sm text-gray-500">
                            Showing {filteredLinks.length} of {links.length} links
                            {searchTerm && ` matching "${searchTerm}"`}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}