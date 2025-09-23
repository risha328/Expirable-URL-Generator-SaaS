// import React, { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';
// import api from '../api/api';


// export default function Analytics() {
//     const { slug } = useParams();
//     const [data, setData] = useState(null);


//     useEffect(() => {
//         (async () => {
//             try {
//                 const res = await api.get(`/analytics/${slug}`);
//                 setData(res.data);
//             } catch (err) { console.error(err); }
//         })();
//     }, [slug]);


//     if (!data) return <div>Loading...</div>;


//     return (
//         <div className="max-w-3xl mx-auto bg-white p-6 rounded shadow">
//             <h3 className="text-lg font-semibold">Analytics for {slug}</h3>
//             <div className="mt-3">Total clicks: <strong>{data.clicks}</strong></div>


//             <div className="mt-4">
//                 <h4 className="font-medium">Recent events</h4>
//                 <div className="mt-2 space-y-2">
//                     {data.analytics && data.analytics.length === 0 && <div className="text-gray-500">No events yet</div>}
//                     {data.analytics && data.analytics.map((ev, i) => (
//                         <div key={i} className="p-2 border rounded">
//                             <div className="text-sm">{new Date(ev.timestamp).toLocaleString()}</div>
//                             <div className="text-xs text-gray-600">{ev.ip} · {ev.userAgent}</div>
//                         </div>
//                     ))}
//                 </div>
//             </div>
//         </div>
//     )
// }



import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/api';

export default function Analytics() {
    const { slug } = useParams();
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [timeRange, setTimeRange] = useState('7d'); // 7d, 30d, 90d, all

    useEffect(() => {
        fetchAnalytics();
    }, [slug, timeRange]);

    const fetchAnalytics = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const res = await api.get(`/analytics/${slug}?range=${timeRange}`);
            setData(res.data);
        } catch (err) { 
            console.error(err);
            setError('Failed to load analytics data');
        } finally {
            setIsLoading(false);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getDeviceIcon = (userAgent) => {
        if (!userAgent) return '🖥️';
        if (/mobile/i.test(userAgent)) return '📱';
        if (/tablet/i.test(userAgent)) return '📱';
        if (/windows/i.test(userAgent)) return '💻';
        if (/macintosh/i.test(userAgent)) return '💻';
        if (/linux/i.test(userAgent)) return '💻';
        return '🖥️';
    };

    const getBrowserInfo = (userAgent) => {
        if (!userAgent) return 'Unknown';
        
        if (/chrome/i.test(userAgent)) return 'Chrome';
        if (/firefox/i.test(userAgent)) return 'Firefox';
        if (/safari/i.test(userAgent)) return 'Safari';
        if (/edge/i.test(userAgent)) return 'Edge';
        if (/opera/i.test(userAgent)) return 'Opera';
        return 'Unknown';
    };

    const getLocationFromIP = (ip) => {
        // This is a simplified version - in production, you'd use an IP geolocation service
        if (ip === '::1' || ip === '127.0.0.1') return 'Localhost';
        return 'Unknown location';
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="relative">
                        <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200"></div>
                        <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent absolute top-0 left-0"></div>
                    </div>
                    <p className="mt-4 text-gray-600 font-medium">Loading analytics data...</p>
                    <div className="mt-2 flex justify-center space-x-1">
                        <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                        <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to load analytics</h3>
                    <p className="text-gray-600 mb-4">{error}</p>
                    <button 
                        onClick={fetchAnalytics}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    if (!data) return null;

    const shortUrl = `${window.location.origin}/${slug}`;

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <Link to="/dashboard" className="inline-flex items-center text-blue-600 hover:text-blue-500 mb-4 transition-colors duration-200">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to Dashboard
                    </Link>
                    
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Link Analytics</h1>
                            <p className="text-gray-600 mt-2">Track performance and engagement for your short link</p>
                        </div>
                        
                        <div className="mt-4 lg:mt-0">
                            <div className="flex flex-wrap gap-2">
                                <select 
                                    value={timeRange}
                                    onChange={(e) => setTimeRange(e.target.value)}
                                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="7d">Last 7 days</option>
                                    <option value="30d">Last 30 days</option>
                                    <option value="90d">Last 90 days</option>
                                    <option value="all">All time</option>
                                </select>
                                <button 
                                    onClick={fetchAnalytics}
                                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors duration-200"
                                >
                                    Refresh
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                        <div className="flex items-center">
                            <div className="p-3 bg-blue-100 rounded-lg mr-4">
                                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-600">Short Link</p>
                                <p className="text-lg font-bold text-gray-900 truncate" title={shortUrl}>
                                    {slug}
                                </p>
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
                                <p className="text-2xl font-bold text-gray-900">{data.clicks || 0}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                        <div className="flex items-center">
                            <div className="p-3 bg-purple-100 rounded-lg mr-4">
                                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-600">Last Click</p>
                                <p className="text-sm font-bold text-gray-900">
                                    {data.analytics && data.analytics.length > 0 
                                        ? formatDate(data.analytics[0].timestamp).split(',')[0]
                                        : 'Never'
                                    }
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                        <div className="flex items-center">
                            <div className="p-3 bg-orange-100 rounded-lg mr-4">
                                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-600">Unique Visitors</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {data.analytics ? new Set(data.analytics.map(a => a.ip)).size : 0}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Click Events Table */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-900">Click History</h2>
                        <p className="text-sm text-gray-600 mt-1">Detailed log of all access events</p>
                    </div>

                    <div className="overflow-x-auto">
                        {(!data.analytics || data.analytics.length === 0) ? (
                            <div className="text-center py-12">
                                <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <h3 className="text-lg font-medium text-gray-900 mb-2">No activity yet</h3>
                                <p className="text-gray-600">Clicks will appear here once people start using your link</p>
                            </div>
                        ) : (
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Device & Browser</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">IP Address</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {data.analytics.map((event, index) => (
                                        <tr key={index} className="hover:bg-gray-50 transition-colors duration-150">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{formatDate(event.timestamp)}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center">
                                                    <span className="text-lg mr-3">{getDeviceIcon(event.userAgent)}</span>
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-900">{getBrowserInfo(event.userAgent)}</div>
                                                        <div className="text-xs text-gray-500 truncate max-w-xs">
                                                            {event.userAgent?.substring(0, 50)}...
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{getLocationFromIP(event.ip)}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-mono text-gray-500">{event.ip}</div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>

                    {/* Pagination or Info */}
                    {data.analytics && data.analytics.length > 0 && (
                        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                            <p className="text-sm text-gray-600">
                                Showing {data.analytics.length} events
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}