import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';

export default function RedirectHandler() {
    const { slug } = useParams();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [password, setPassword] = useState('');
    const [isPasswordRequired, setIsPasswordRequired] = useState(false);

    useEffect(() => {
        if (slug && !isPasswordRequired) {
            handleRedirect();
        }
    }, [slug, isPasswordRequired]);

    const handleRedirect = async (providedPassword = null) => {
        try {
            setIsLoading(true);
            setError(null);

            // Use native fetch instead of authenticated API to avoid auth redirects
            const response = await fetch(`http://localhost:5000/url/${slug}${providedPassword ? `?password=${encodeURIComponent(providedPassword)}` : ''}`);

            if (response.redirected) {
                // If the response is redirected, follow the redirect
                window.location.href = response.url;
                return;
            }

            if (response.ok) {
                const data = await response.json();
                if (data.targetUrl) {
                    toast.success('Password entered successfully! Redirecting...');
                    window.location.href = data.targetUrl;
                } else {
                    setError('Link not found or expired');
                }
            } else {
                const errorData = await response.json().catch(() => ({}));

                // Handle different error status codes
                if (response.status === 404) {
                    setError('Link not found');
                } else if (response.status === 410) {
                    setError('Link has expired');
                } else if (response.status === 401) {
                    setIsPasswordRequired(true);
                    setIsLoading(false);
                    return;
                } else if (response.status === 403) {
                    // Wrong password - show failed attempt count
                    const failedAttempts = errorData.failedAttempts || 1;
                    toast.error(`Wrong password! ${failedAttempts} failed attempt(s)`);
                    setIsPasswordRequired(true);
                    setIsLoading(false);
                    return;
                } else if (response.status === 429) {
                    // Rate limited or locked
                    if (errorData.lockedUntil) {
                        const lockTime = new Date(errorData.lockedUntil);
                        const remainingMinutes = Math.ceil((lockTime - new Date()) / 1000 / 60);
                        toast.error(`Link temporarily locked due to too many failed attempts. Try again in ${remainingMinutes} minutes.`);
                    } else {
                        toast.error(errorData.message || 'Too many requests. Please try again later.');
                    }
                    setError(errorData.message || 'Link temporarily unavailable');
                } else if (response.status === 403 && errorData.flaggedReason) {
                    // Link flagged for abuse
                    toast.error(`Link has been flagged: ${errorData.flaggedReason}`);
                    setError('Link has been flagged for suspicious activity');
                } else {
                    toast.error(errorData.message || 'Unable to access link');
                    setError(errorData.message || 'Unable to access link');
                }
            }
        } catch (err) {
            console.error('Redirect error:', err);
            setError('Unable to access link');
        } finally {
            if (!isPasswordRequired) {
                setIsLoading(false);
            }
        }
    };

    const handlePasswordSubmit = (e) => {
        e.preventDefault();
        if (password.trim()) {
            handleRedirect(password.trim());
        }
    };

    if (isLoading && !isPasswordRequired) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="relative">
                        <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200"></div>
                        <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent absolute top-0 left-0"></div>
                    </div>
                    <p className="mt-4 text-gray-600 font-medium">Redirecting...</p>
                    <div className="mt-2 flex justify-center space-x-1">
                        <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                        <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                </div>
            </div>
        );
    }

    if (isPasswordRequired) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl p-8">
                    <div className="text-center mb-6">
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Password Required</h2>
                        <p className="text-gray-600">This link is password protected. Please enter the password to continue.</p>
                    </div>

                    <form onSubmit={handlePasswordSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter password"
                                className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                                required
                            />
                        </div>

                        <div className="flex space-x-3">
                            <button
                                type="submit"
                                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                            >
                                Access Link
                            </button>
                            <a
                                href="/"
                                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors duration-200 text-center"
                            >
                                Cancel
                            </a>
                        </div>
                    </form>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center">
                <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl p-8 text-center">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Link Error</h2>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <div className="space-y-3">
                        <a
                            href="/"
                            className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                        >
                            Go Home
                        </a>
                        <a
                            href="/dashboard"
                            className="block w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                        >
                            Dashboard
                        </a>
                    </div>
                </div>
            </div>
        );
    }

    return null;
}
