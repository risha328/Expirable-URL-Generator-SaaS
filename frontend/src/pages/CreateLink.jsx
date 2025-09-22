// import React, { useState } from 'react';
// import api from '../api/api';


// export default function CreateLink() {
//     const [targetUrl, setTargetUrl] = useState('');
//     const [password, setPassword] = useState('');
//     const [expiry, setExpiry] = useState('');
//     const [result, setResult] = useState(null);
//     const [err, setErr] = useState(null);


//     const onSubmit = async (e) => {
//         e.preventDefault();
//         try {
//             const res = await api.post('/url', { targetUrl, password, expiry });
//             setResult(res.data);
//             setErr(null);
//         } catch (error) { setErr(error.response?.data?.message || 'Error'); }
//     }


//     return (
//         <div className="max-w-xl mx-auto bg-white p-6 rounded shadow space-y-4">
//             <h3 className="text-lg font-semibold">Create Short URL</h3>
//             {err && <div className="text-red-500">{err}</div>}
//             <form onSubmit={onSubmit} className="space-y-3">
//                 <input value={targetUrl} onChange={e => setTargetUrl(e.target.value)} placeholder="Target URL (https://...)" className="w-full p-2 border rounded" />
//                 <input value={password} onChange={e => setPassword(e.target.value)} placeholder="Password (optional)" className="w-full p-2 border rounded" />
//                 <input value={expiry} onChange={e => setExpiry(e.target.value)} type="datetime-local" className="w-full p-2 border rounded" />
//                 <button className="px-4 py-2 bg-blue-600 text-white rounded">Create</button>
//             </form>


//             {result && (
//                 <div className="p-3 bg-gray-50 rounded">
//                     <div>Short URL:</div>
//                     <a href={result.shortUrl} className="text-blue-600" target="_blank" rel="noreferrer">{result.shortUrl}</a>
//                 </div>
//             )}
//         </div>
//     )
// }


import React, { useState } from 'react';
import api from '../api/api';
import { Link } from 'react-router-dom';

export default function CreateLink() {
    const [targetUrl, setTargetUrl] = useState('');
    const [password, setPassword] = useState('');
    const [expiry, setExpiry] = useState('');
    const [result, setResult] = useState(null);
    const [err, setErr] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const onSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const res = await api.post('/url', { targetUrl, password, expiry });
            setResult(res.data);
            setErr(null);
            // Clear form after successful creation
            setTargetUrl('');
            setPassword('');
            setExpiry('');
        } catch (error) { 
            setErr(error.response?.data?.message || 'Error creating link. Please try again.'); 
        } finally {
            setIsLoading(false);
        }
    };

    const copyToClipboard = () => {
        if (result?.shortUrl) {
            navigator.clipboard.writeText(result.shortUrl);
            // You can add a toast notification here instead of alert
            alert('Link copied to clipboard!');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                {/* Header */}
                <div className="text-center">
                    <Link to="/dashboard" className="inline-flex items-center text-blue-600 hover:text-blue-500 mb-4 transition-colors duration-200">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to Dashboard
                    </Link>
                    <div className="flex items-center justify-center space-x-2 mb-4">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-xl">E</span>
                        </div>
                        <span className="text-2xl font-bold text-gray-900">Expireo</span>
                    </div>
                    <h2 className="text-3xl font-extrabold text-gray-900">Create Short URL</h2>
                    <p className="mt-2 text-sm text-gray-600">Create a secure, trackable short link for your URLs</p>
                </div>

                {/* Form Container */}
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    {err && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
                            <svg className="w-5 h-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                            <span className="text-red-800 text-sm">{err}</span>
                        </div>
                    )}

                    <form onSubmit={onSubmit} className="space-y-6">
                        {/* Target URL Field */}
                        <div>
                            <label htmlFor="targetUrl" className="block text-sm font-medium text-gray-700 mb-2">
                                Destination URL *
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                                    </svg>
                                </div>
                                <input 
                                    id="targetUrl"
                                    value={targetUrl} 
                                    onChange={e => setTargetUrl(e.target.value)} 
                                    placeholder="https://example.com/your-long-url" 
                                    className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200" 
                                    required
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                Password Protection
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                </div>
                                <input 
                                    id="password"
                                    value={password} 
                                    onChange={e => setPassword(e.target.value)} 
                                    placeholder="Optional password for link access" 
                                    className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200" 
                                />
                            </div>
                            <p className="mt-1 text-xs text-gray-500">Leave empty for public access</p>
                        </div>

                        {/* Expiry Field */}
                        <div>
                            <label htmlFor="expiry" className="block text-sm font-medium text-gray-700 mb-2">
                                Expiration Date
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <input 
                                    id="expiry"
                                    value={expiry} 
                                    onChange={e => setExpiry(e.target.value)} 
                                    type="datetime-local" 
                                    className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200" 
                                />
                            </div>
                            <p className="mt-1 text-xs text-gray-500">Leave empty for no expiration</p>
                        </div>

                        {/* Submit Button */}
                        <button 
                            type="submit" 
                            disabled={isLoading}
                            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-sm hover:shadow-md"
                        >
                            {isLoading ? (
                                <div className="flex items-center justify-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Creating Link...
                                </div>
                            ) : (
                                'Create Short URL'
                            )}
                        </button>
                    </form>
                </div>

                {/* Result Section */}
                {result && (
                    <div className="bg-gradient-to-r from-green-50 to-emerald-100 rounded-2xl shadow-xl p-6 border border-green-200">
                        <div className="flex items-center mb-4">
                            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-green-800">Link Created Successfully!</h3>
                        </div>
                        
                        <div className="space-y-3">
                            <div>
                                <label className="block text-sm font-medium text-green-700 mb-1">Your Short URL:</label>
                                <div className="flex space-x-2">
                                    <input 
                                        type="text" 
                                        value={result.shortUrl} 
                                        readOnly 
                                        className="flex-1 px-3 py-2 bg-white border border-green-200 rounded-lg font-mono text-sm text-green-800" 
                                    />
                                    <button 
                                        onClick={copyToClipboard}
                                        className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors duration-200 flex items-center"
                                    >
                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                        </svg>
                                        Copy
                                    </button>
                                </div>
                            </div>
                            
                            <div className="flex space-x-3 pt-3">
                                <a 
                                    href={result.shortUrl} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-center py-2 px-4 rounded-lg font-medium transition-colors duration-200"
                                >
                                    Test Link
                                </a>
                                <Link 
                                    to="/dashboard"
                                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-center py-2 px-4 rounded-lg font-medium transition-colors duration-200"
                                >
                                    Dashboard
                                </Link>
                            </div>
                        </div>
                    </div>
                )}

                {/* Quick Tips */}
                <div className="text-center">
                    <p className="text-xs text-gray-500">
                        All links include automatic click tracking and analytics
                    </p>
                </div>
            </div>
        </div>
    );
}