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
import { formatLinkExpiry } from '../utils/linkStatus';

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

    const getLocationFromIP = (event) => {
        // Use the location data from the analytics record
        if (event.country && event.city) {
            return `${event.city}, ${event.country}`;
        } else if (event.country) {
            return event.country;
        } else if (event.ip === '::1' || event.ip === '127.0.0.1') {
            return 'Localhost';
        }
        return 'Unknown location';
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-16">
                <div className="text-center">
                    <div className="relative mx-auto w-12 h-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200"></div>
                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent absolute top-0 left-0"></div>
                    </div>
                    <p className="mt-4 text-gray-600 font-medium text-sm">Loading analytics data...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center py-16">
                <div className="text-center bg-white rounded-2xl border border-gray-200 shadow-sm p-8 max-w-md w-full">
                    <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-7 h-7 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to load analytics</h3>
                    <p className="text-gray-600 mb-4 text-sm">{error}</p>
                    <button
                        onClick={fetchAnalytics}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 text-sm font-medium"
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
        <div className="w-full space-y-6">
            {/* Header */}
            <div>
                <Link
                    to="/my-links"
                    className="inline-flex items-center text-blue-600 hover:text-blue-500 mb-3 transition-colors duration-200 text-sm font-medium"
                >
                    <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to My Links
                </Link>

                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                    <div className="min-w-0">
                        <h1 className="text-2xl font-bold text-gray-900">Link Analytics</h1>
                        <p className="text-gray-500 text-sm mt-1 truncate" title={shortUrl}>
                            {shortUrl}
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 shrink-0">
                        <select
                            value={timeRange}
                            onChange={(e) => setTimeRange(e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white"
                        >
                            <option value="7d">Last 7 days</option>
                            <option value="30d">Last 30 days</option>
                            <option value="90d">Last 90 days</option>
                            <option value="all">All time</option>
                        </select>
                       
                    </div>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                <div className="bg-white rounded-2xl shadow-sm p-5 border border-gray-200">
                    <div className="flex items-center min-w-0">
                        <div className="p-3 bg-blue-100 rounded-xl mr-3 shrink-0">
                            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                            </svg>
                        </div>
                        <div className="min-w-0">
                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Short Link</p>
                            <p className="text-base font-bold text-gray-900 truncate" title={shortUrl}>
                                /{slug}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm p-5 border border-gray-200">
                    <div className="flex items-center">
                        <div className="p-3 bg-green-100 rounded-xl mr-3 shrink-0">
                            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Total Clicks</p>
                            <p className="text-2xl font-bold text-gray-900">{data.clicks || 0}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm p-5 border border-gray-200">
                    <div className="flex items-center min-w-0">
                        <div className="p-3 bg-purple-100 rounded-xl mr-3 shrink-0">
                            <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div className="min-w-0">
                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Expires</p>
                            <p className="text-sm font-bold text-gray-900 truncate">
                                {formatLinkExpiry(data, formatDate)}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm p-5 border border-gray-200">
                    <div className="flex items-center">
                        <div className="p-3 bg-orange-100 rounded-xl mr-3 shrink-0">
                            <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Unique Visitors</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {data.analytics ? new Set(data.analytics.map((a) => a.ip)).size : 0}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Click Events Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-200">
                    <h2 className="text-base font-semibold text-gray-900">Click History</h2>
                    <p className="text-sm text-gray-500 mt-0.5">Detailed log of all access events</p>
                </div>

                <div className="overflow-x-auto">
                    {!data.analytics || data.analytics.length === 0 ? (
                        <div className="text-center py-12 px-4">
                            <svg className="w-14 h-14 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <h3 className="text-base font-semibold text-gray-900 mb-1">No activity yet</h3>
                            <p className="text-sm text-gray-500">Clicks will appear here once people start using your link</p>
                        </div>
                    ) : (
                        <table className="w-full text-left">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Time</th>
                                    <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Device & Browser</th>
                                    <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Location</th>
                                    <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">IP Address</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {data.analytics.map((event, index) => (
                                    <tr key={index} className="hover:bg-gray-50/80 transition-colors duration-150">
                                        <td className="px-5 py-3.5 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{formatDate(event.timestamp)}</div>
                                        </td>
                                        <td className="px-5 py-3.5">
                                            <div className="flex items-center min-w-0">
                                                <span className="text-lg mr-3 shrink-0">{getDeviceIcon(event.userAgent)}</span>
                                                <div className="min-w-0">
                                                    <div className="text-sm font-medium text-gray-900">{getBrowserInfo(event.userAgent)}</div>
                                                    <div className="text-xs text-gray-500 truncate max-w-[220px]">
                                                        {event.userAgent ? `${event.userAgent.substring(0, 50)}...` : '—'}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-5 py-3.5 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{getLocationFromIP(event)}</div>
                                        </td>
                                        <td className="px-5 py-3.5 whitespace-nowrap">
                                            <div className="text-sm font-mono text-gray-500">{event.ip}</div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                {data.analytics && data.analytics.length > 0 && (
                    <div className="px-5 py-3 border-t border-gray-200 bg-gray-50">
                        <p className="text-sm text-gray-500">
                            Showing {data.analytics.length} events
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}