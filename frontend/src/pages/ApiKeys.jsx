import React, { useState } from 'react';
import toast from 'react-hot-toast';

export default function ApiKeys() {
    const [apiKey, setApiKey] = useState('exp_live_8f92a10b4c8e7193d20f');
    const [webhookUrl, setWebhookUrl] = useState('');

    const handleGenerateNewKey = () => {
        const newKey = `exp_live_${Math.random().toString(36).substring(2, 18)}`;
        setApiKey(newKey);
        toast.success('New API Key generated successfully!');
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">🔑 API Keys & Webhooks</h1>
                <p className="text-gray-500 text-sm">Programmatically create expirable URLs and receive real-time expiration notifications via Webhooks.</p>
            </div>

            {/* API Key Box */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
                <h2 className="text-lg font-semibold text-gray-900">Live API Key</h2>
                <div className="flex items-center gap-3">
                    <input
                        type="text"
                        readOnly
                        value={apiKey}
                        className="flex-1 font-mono text-sm px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-gray-800"
                    />
                    <button
                        onClick={() => {
                            navigator.clipboard.writeText(apiKey);
                            toast.success('API Key copied!');
                        }}
                        className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl text-sm transition-colors"
                    >
                        Copy
                    </button>
                    <button
                        onClick={handleGenerateNewKey}
                        className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-sm transition-colors"
                    >
                        Roll Key
                    </button>
                </div>
            </div>

            {/* Webhook Settings */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
                <h2 className="text-lg font-semibold text-gray-900">Expiration Webhook URL</h2>
                <p className="text-xs text-gray-500">Expireo will send an HTTP POST payload whenever one of your links expires.</p>
                <div className="flex flex-col sm:flex-row gap-3">
                    <input
                        type="url"
                        placeholder="https://yourserver.com/api/webhooks/expireo"
                        value={webhookUrl}
                        onChange={(e) => setWebhookUrl(e.target.value)}
                        className="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                    <button
                        onClick={() => toast.success('Webhook endpoint updated!')}
                        className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-sm transition-all"
                    >
                        Save Webhook
                    </button>
                </div>
            </div>
        </div>
    );
}
