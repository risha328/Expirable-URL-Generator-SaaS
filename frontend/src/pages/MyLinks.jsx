import React, { useEffect, useState } from 'react';
import api from '../api/api';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function MyLinks() {
    const [links, setLinks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // 'all', 'active', 'expired'
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchLinks = async () => {
            try {
                const res = await api.get('/url/my');
                setLinks(res.data || []);
            } catch (err) {
                console.error('Failed to fetch links:', err);
                toast.error('Failed to load your links');
            } finally {
                setIsLoading(false);
            }
        };
        fetchLinks();
    }, []);

    const isLinkExpired = (link) => {
        if (!link.expiresAt) return false;
        return new Date(link.expiresAt) < new Date();
    };

    const filteredLinks = links.filter((link) => {
        const expired = isLinkExpired(link);
        if (filter === 'active' && expired) return false;
        if (filter === 'expired' && !expired) return false;

        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            return (
                link.title?.toLowerCase().includes(term) ||
                link.slug?.toLowerCase().includes(term) ||
                link.targetUrl?.toLowerCase().includes(term)
            );
        }
        return true;
    });

    const copyToClipboard = (slug) => {
        const url = `${window.location.origin}/${slug}`;
        navigator.clipboard.writeText(url);
        toast.success('Link copied to clipboard!');
    };

    return (
        <div className="space-y-6">
            <div className="space-y-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">🔗 My Links</h1>
                    <p className="text-gray-500 text-sm">Manage, filter, and view performance of your expirable URLs</p>
                </div>
                <div className="flex justify-end">
                    <Link
                        to="/my-links/create"
                        className="inline-flex items-center justify-center px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl shadow-sm transition-all"
                    >
                        + Create New Link
                    </Link>
                </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-200 flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="flex items-center gap-2 w-full md:w-auto">
                    <button
                        onClick={() => setFilter('all')}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${filter === 'all' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                    >
                        All ({links.length})
                    </button>
                    <button
                        onClick={() => setFilter('active')}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${filter === 'active' ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                    >
                        Active ({links.filter((l) => !isLinkExpired(l)).length})
                    </button>
                    <button
                        onClick={() => setFilter('expired')}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${filter === 'expired' ? 'bg-rose-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                    >
                        Expired ({links.filter((l) => isLinkExpired(l)).length})
                    </button>
                </div>

                <div className="relative w-full md:w-64">
                    <input
                        type="text"
                        placeholder="Search links..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                    <svg className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
            </div>

            {/* Links Table / Grid */}
            {isLoading ? (
                <div className="text-center py-12 bg-white rounded-2xl border border-gray-200">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
                    <p className="mt-2 text-sm text-gray-500">Loading your links...</p>
                </div>
            ) : filteredLinks.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-2xl border border-gray-200 p-6">
                    <span className="text-4xl">📭</span>
                    <h3 className="mt-2 text-base font-semibold text-gray-900">No links found</h3>
                    <p className="text-sm text-gray-500 mt-1">Get started by creating your first expirable URL.</p>
                </div>
            ) : (
                <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-gray-50 text-gray-600 font-semibold border-b border-gray-200">
                                <tr>
                                    <th className="p-4">Short URL & Target</th>
                                    <th className="p-4">Status</th>
                                    <th className="p-4">Clicks</th>
                                    <th className="p-4">Expiration</th>
                                    <th className="p-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredLinks.map((link) => {
                                    const expired = isLinkExpired(link);
                                    const shortUrl = `${window.location.origin}/${link.slug}`;
                                    return (
                                        <tr key={link._id} className="hover:bg-gray-50/80 transition-colors">
                                            <td className="p-4 max-w-xs truncate">
                                                <div className="font-semibold text-indigo-600 hover:underline cursor-pointer" onClick={() => copyToClipboard(link.slug)}>
                                                    {shortUrl}
                                                </div>
                                                <div className="text-xs text-gray-400 truncate">{link.targetUrl}</div>
                                            </td>
                                            <td className="p-4">
                                                {expired ? (
                                                    <span className="px-2.5 py-1 text-xs font-semibold bg-rose-100 text-rose-700 rounded-full">
                                                        Expired
                                                    </span>
                                                ) : (
                                                    <span className="px-2.5 py-1 text-xs font-semibold bg-emerald-100 text-emerald-700 rounded-full">
                                                        Active
                                                    </span>
                                                )}
                                            </td>
                                            <td className="p-4 font-semibold text-gray-700">
                                                {link.clicksCount || 0}
                                            </td>
                                            <td className="p-4 text-xs text-gray-500">
                                                {link.expiresAt ? new Date(link.expiresAt).toLocaleString() : 'Never'}
                                            </td>
                                            <td className="p-4 text-right space-x-2">
                                                <button
                                                    onClick={() => copyToClipboard(link.slug)}
                                                    className="px-2.5 py-1 text-xs font-medium bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg"
                                                >
                                                    Copy
                                                </button>
                                                <Link
                                                    to={`/analytics/${link.slug}`}
                                                    className="px-2.5 py-1 text-xs font-medium bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-lg"
                                                >
                                                    Analytics
                                                </Link>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
