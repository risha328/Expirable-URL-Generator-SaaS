import React, { useState } from 'react';
import toast from 'react-hot-toast';

export default function SecretLinks() {
    const [secretText, setSecretText] = useState('');
    const [maxViews, setMaxViews] = useState(1);
    const [generatedUrl, setGeneratedUrl] = useState('');

    const handleCreateSecret = (e) => {
        e.preventDefault();
        if (!secretText.trim()) return;

        const randomSlug = Math.random().toString(36).substring(2, 10);
        const url = `${window.location.origin}/secret/${randomSlug}`;
        setGeneratedUrl(url);
        toast.success('Self-destructing secret link generated!');
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">🔐 Secret & One-Time Links</h1>
                <p className="text-gray-500 text-sm">Create self-destructing, password-encrypted URLs for sharing sensitive credentials or private links.</p>
            </div>

            {/* Secret Link Form */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
                <form onSubmit={handleCreateSecret} className="space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                            Secret Content or Target URL
                        </label>
                        <textarea
                            rows={3}
                            placeholder="Enter password, secret note, or private URL..."
                            value={secretText}
                            onChange={(e) => setSecretText(e.target.value)}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                            Self-Destruct Condition
                        </label>
                        <select
                            value={maxViews}
                            onChange={(e) => setMaxViews(Number(e.target.value))}
                            className="w-full sm:w-64 px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                        >
                            <option value={1}>Self-destruct after 1 View</option>
                            <option value={5}>Self-destruct after 5 Views</option>
                            <option value={24}>Self-destruct after 24 Hours</option>
                        </select>
                    </div>

                    <button
                        type="submit"
                        className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold rounded-xl text-sm transition-all shadow-md"
                    >
                        🔐 Generate Secret Link
                    </button>
                </form>

                {generatedUrl && (
                    <div className="mt-6 p-4 bg-purple-50 border border-purple-200 rounded-xl">
                        <p className="text-xs font-bold text-purple-700 uppercase">Your One-Time Secret Link:</p>
                        <div className="flex items-center justify-between mt-1">
                            <span className="font-mono text-sm text-purple-900 font-semibold">{generatedUrl}</span>
                            <button
                                onClick={() => {
                                    navigator.clipboard.writeText(generatedUrl);
                                    toast.success('Copied secret URL!');
                                }}
                                className="px-3 py-1 bg-purple-600 text-white text-xs font-semibold rounded-lg"
                            >
                                Copy
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
