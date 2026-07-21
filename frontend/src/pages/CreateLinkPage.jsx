import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/api';
import toast from 'react-hot-toast';

export default function CreateLinkPage() {
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showQrCode, setShowQrCode] = useState(true);

    const [formData, setFormData] = useState({
        destinationUrl: '',
        customAlias: '',
        expiresAt: '',
        password: '',
        maxClicks: '',
        geoFilter: 'Allow all countries',
        campaignSource: 'google',
        campaignMedium: 'email',
        campaignName: 'launch'
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.destinationUrl) {
            toast.error('Please enter a destination URL');
            return;
        }

        setIsSubmitting(true);
        try {
            const payload = {
                targetUrl: formData.destinationUrl,
                password: formData.password || undefined,
                expiry: formData.expiresAt ? new Date(formData.expiresAt).toISOString() : undefined,
                customAlias: formData.customAlias || undefined,
                maxClicks: formData.maxClicks ? parseInt(formData.maxClicks) : undefined,
                utmSource: formData.campaignSource || undefined,
                utmMedium: formData.campaignMedium || undefined,
                utmCampaign: formData.campaignName || undefined
            };

            await api.post('/url', payload);
            toast.success('Secure expirable link created successfully!');
            navigate('/my-links');
        } catch (err) {
            console.error('Failed to create URL:', err);
            toast.error(err.response?.data?.message || 'Failed to create link');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-6 max-w-6xl mx-auto pb-12">
            {/* Header */}
            <div>
                <div className="flex items-center space-x-2 text-sm text-gray-500 mb-1">
                    <Link to="/my-links" className="hover:text-blue-600 transition-colors">My Links</Link>
                    <span>/</span>
                    <span className="text-gray-900 font-medium">Create</span>
                </div>
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Create a Secure Link</h1>
                <p className="text-gray-500 text-sm mt-1">Configure enterprise-grade expiration and tracking parameters.</p>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Form Column */}
                <div className="lg:col-span-7 space-y-6">
                    {/* Main Parameters Card */}
                    <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-sm space-y-5">
                        {/* Destination URL */}
                        <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                                Destination URL <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="url"
                                name="destinationUrl"
                                value={formData.destinationUrl}
                                onChange={handleChange}
                                placeholder="https://my-very-long-and-complex-url.com/path"
                                className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white text-sm transition-all"
                                required
                            />
                        </div>

                        {/* Custom Alias & Expiration */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                                    Custom Alias
                                </label>
                                <div className="flex rounded-xl border border-gray-200 overflow-hidden bg-gray-50/50 focus-within:ring-2 focus-within:ring-blue-500 focus-within:bg-white transition-all">
                                    <span className="px-3 py-3 text-xs font-medium text-gray-500 bg-gray-100 border-r border-gray-200 flex items-center select-none">
                                        snap.lk/
                                    </span>
                                    <input
                                        type="text"
                                        name="customAlias"
                                        value={formData.customAlias}
                                        onChange={handleChange}
                                        placeholder="summer-sale"
                                        className="w-full px-3 py-2 text-sm bg-transparent border-none focus:outline-none"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                                    Expiration
                                </label>
                                <input
                                    type="datetime-local"
                                    name="expiresAt"
                                    value={formData.expiresAt}
                                    onChange={handleChange}
                                    className="w-full px-3.5 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white text-sm text-gray-700 transition-all"
                                />
                            </div>
                        </div>

                        {/* Password Protection & Total Click Limit */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                                    Password Protection
                                </label>
                                <div className="relative">
                                    <input
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="Leave blank for none"
                                        className="w-full px-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white text-sm transition-all pr-10"
                                    />
                                    <span className="absolute right-3 top-3 text-gray-400 text-xs">🔒</span>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                                    Total Click Limit
                                </label>
                                <input
                                    type="number"
                                    name="maxClicks"
                                    value={formData.maxClicks}
                                    onChange={handleChange}
                                    placeholder="e.g. 500"
                                    min="1"
                                    className="w-full px-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white text-sm transition-all"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Commented out whole Geo-targeting & UTMs Card
                    <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-sm space-y-5">
                        <div className="flex items-center space-x-2 text-gray-900 font-bold text-base">
                            <span className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-sm">🌐</span>
                            <span>Geo-targeting & UTMs</span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-2">
                                    Campaign Source
                                </label>
                                <input
                                    type="text"
                                    name="campaignSource"
                                    value={formData.campaignSource}
                                    onChange={handleChange}
                                    placeholder="google"
                                    className="w-full px-3.5 py-2 bg-gray-50/50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-2">
                                    Campaign Medium
                                </label>
                                <input
                                    type="text"
                                    name="campaignMedium"
                                    value={formData.campaignMedium}
                                    onChange={handleChange}
                                    placeholder="email"
                                    className="w-full px-3.5 py-2 bg-gray-50/50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-2">
                                    Campaign Name
                                </label>
                                <input
                                    type="text"
                                    name="campaignName"
                                    value={formData.campaignName}
                                    onChange={handleChange}
                                    placeholder="launch"
                                    className="w-full px-3.5 py-2 bg-gray-50/50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>
                    </div>
                    */}

                    {/* Bottom Actions */}
                    <div className="flex items-center justify-end space-x-4 pt-2">
                        <button
                            type="button"
                            onClick={() => navigate('/my-links')}
                            className="px-6 py-2.5 text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors"
                        >
                            Discard
                        </button>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-blue-600/30 transition-all disabled:opacity-50"
                        >
                            {isSubmitting ? 'Generating...' : 'Generate Link'}
                        </button>
                    </div>
                </div>

                {/* Right Live Preview Column */}
                <div className="lg:col-span-5 space-y-6">
                    {/* Live Preview Card */}
                    <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-sm space-y-5 sticky top-6">
                        <h3 className="font-bold text-gray-900 text-base">Live Preview</h3>

                        {/* Banner graphic */}
                        <div className="h-32 bg-blue-100 rounded-2xl flex items-center justify-center border border-blue-200/50 relative overflow-hidden">
                            <div className="w-12 h-12 rounded-2xl bg-blue-500/20 flex items-center justify-center text-blue-600 text-2xl font-bold">
                                🔗
                            </div>
                        </div>

                        {/* Status Badge & Link Preview */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="px-2.5 py-0.5 text-[10px] font-extrabold bg-emerald-100 text-emerald-700 rounded-md uppercase tracking-wider">
                                    ACTIVE
                                </span>
                                <span className="text-gray-400 text-xs">•••</span>
                            </div>

                            <p className="font-bold text-blue-600 text-base">
                                snap.lk/{formData.customAlias || 'custom'}
                            </p>

                            <p className="text-xs text-gray-500 truncate">
                                {formData.destinationUrl || 'Enter destination URL...'}
                            </p>
                        </div>

                        {/* Info details */}
                        <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500 font-medium">
                            <div>
                                <span className="block text-[10px] uppercase tracking-wider font-bold text-gray-400">EXPIRES</span>
                                <span>{formData.expiresAt ? new Date(formData.expiresAt).toLocaleDateString() : 'Never'}</span>
                            </div>
                            <div className="text-right">
                                <span className="block text-[10px] uppercase tracking-wider font-bold text-gray-400">LIMIT</span>
                                <span>{formData.maxClicks ? `${formData.maxClicks} Clicks` : '∞ Clicks'}</span>
                            </div>
                        </div>

                        {/* Commented out QR Code Sub-card
                        <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-100/60 flex items-center justify-between space-x-4 mt-4">
                            <div className="flex items-center space-x-3">
                                <div className="w-14 h-14 bg-white rounded-xl border border-gray-200 flex items-center justify-center text-xl shadow-xs">
                                    📱
                                </div>
                                <div>
                                    <h5 className="font-bold text-xs text-gray-900">QR Code</h5>
                                    <p className="text-[11px] text-gray-500 leading-tight mt-0.5">
                                        Live QR updates as you change the alias.
                                    </p>
                                    <button
                                        type="button"
                                        onClick={() => toast.success('QR Code download started')}
                                        className="text-xs font-semibold text-blue-600 hover:text-blue-700 mt-1.5 inline-block"
                                    >
                                        ↓ Download SVG
                                    </button>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={() => setShowQrCode(!showQrCode)}
                                className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                                    showQrCode ? 'bg-blue-600' : 'bg-gray-300'
                                }`}
                            >
                                <div
                                    className={`w-4 h-4 rounded-full bg-white shadow-md transform transition-transform ${
                                        showQrCode ? 'translate-x-5' : 'translate-x-0'
                                    }`}
                                />
                            </button>
                        </div>
                        */}
                    </div>
                </div>
            </form>
        </div>
    );
}
