import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
    const { login } = useContext(AuthContext);
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [submitError, setSubmitError] = useState(null);
    const nav = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
        if (submitError) setSubmitError(null);
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        setSubmitError(null);

        if (!validateForm()) return;

        setIsLoading(true);
        try {
            await login(formData.email, formData.password);
            nav('/dashboard', { 
                state: { 
                    message: 'Welcome back to Expireo!',
                    type: 'success'
                }
            });
        } catch (err) { 
            setSubmitError(err.response?.data?.message || 'Login failed. Please check your credentials and try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDemoLogin = async (demoType) => {
        const demoAccounts = {
            admin: { email: 'admin@expireo.com', password: 'DemoAdmin123!' },
            manager: { email: 'manager@expireo.com', password: 'DemoManager123!' },
            user: { email: 'user@expireo.com', password: 'DemoUser123!' }
        };

        setFormData(demoAccounts[demoType]);
        setSubmitError(null);
        setIsLoading(true);

        try {
            await login(demoAccounts[demoType].email, demoAccounts[demoType].password);
            nav('/dashboard', { 
                state: { 
                    message: `Welcome! You're logged in as ${demoType} demo account.`,
                    type: 'success'
                }
            });
        } catch (err) { 
            setSubmitError('Demo login failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                {/* Header */}
                <div className="text-center">
                    <Link to="/" className="inline-block mb-8">
                        <div className="flex items-center justify-center space-x-2">
                            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-lg">E</span>
                            </div>
                            <span className="text-2xl font-bold text-gray-900">Expireo</span>
                        </div>
                    </Link>
                    <h2 className="text-3xl font-extrabold text-gray-900">
                        Welcome back
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Sign in to your Expireo account to continue managing expiration dates
                    </p>
                </div>

                {/* Form Container */}
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    {submitError && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
                            <svg className="w-5 h-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                            <span className="text-red-800 text-sm">{submitError}</span>
                        </div>
                    )}

                    <form onSubmit={onSubmit} className="space-y-6">
                        {/* Email Field */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                Email Address *
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 ${
                                    errors.email ? 'border-red-300' : 'border-gray-300'
                                }`}
                                placeholder="john.doe@example.com"
                            />
                            {errors.email && (
                                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                            )}
                        </div>

                        {/* Password Field */}
                        <div>
                            <div className="flex items-center justify-between mb-1">
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                    Password *
                                </label>
                                <Link 
                                    to="/forgot-password" 
                                    className="text-sm text-blue-600 hover:text-blue-500 font-medium transition-colors duration-200"
                                >
                                    Forgot password?
                                </Link>
                            </div>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                value={formData.password}
                                onChange={handleChange}
                                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 ${
                                    errors.password ? 'border-red-300' : 'border-gray-300'
                                }`}
                                placeholder="••••••••"
                            />
                            {errors.password && (
                                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                            )}
                        </div>

                        {/* Remember Me Checkbox */}
                        <div className="flex items-center">
                            <input
                                id="remember-me"
                                name="remember-me"
                                type="checkbox"
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                                Remember me for 30 days
                            </label>
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
                                    Signing in...
                                </div>
                            ) : (
                                'Sign in to your account'
                            )}
                        </button>
                    </form>

                    {/* Demo Accounts Section */}
                    <div className="mt-8 border-t border-gray-200 pt-6">
                        <div className="text-center mb-4">
                            <span className="text-sm text-gray-500 bg-white px-2">Quick demo access</span>
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                            {[
                                { type: 'admin', label: 'Admin', color: 'from-red-500 to-orange-500' },
                                { type: 'manager', label: 'Manager', color: 'from-green-500 to-teal-500' },
                                { type: 'user', label: 'User', color: 'from-gray-500 to-blue-500' }
                            ].map((account) => (
                                <button
                                    key={account.type}
                                    onClick={() => handleDemoLogin(account.type)}
                                    disabled={isLoading}
                                    className={`bg-gradient-to-r ${account.color} hover:opacity-90 disabled:opacity-50 text-white text-xs font-medium py-2 px-3 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md`}
                                >
                                    {account.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Signup Link */}
                    <div className="mt-8 text-center border-t border-gray-200 pt-6">
                        <p className="text-sm text-gray-600">
                            Don't have an account?{' '}
                            <Link 
                                to="/signup" 
                                className="font-medium text-blue-600 hover:text-blue-500 transition-colors duration-200"
                            >
                                Create one here
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Security Notice */}
                <div className="text-center">
                    <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                        <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>Your data is securely encrypted and protected</span>
                    </div>
                </div>
            </div>
        </div>
    );
}