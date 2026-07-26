import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import api from '../api/api';
import BrandMark from '../components/BrandMark';

export default function AdminLogin() {
    const { login, setUser } = useContext(AuthContext);
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [submitError, setSubmitError] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const nav = useNavigate();
    const location = useLocation();

    useEffect(() => {
        // Check if user is already logged in and is admin
        if (location.state?.message) {
            setSubmitError(location.state.message);
        }
    }, [location.state]);

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
            // Use admin-specific login endpoint via api instance
            const response = await api.post('/auth/admin/login', formData);

            // Store token and user data
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));

            // Update AuthContext user state
            setUser(response.data.user);

            // Redirect to admin dashboard or original location
            const from = location.state?.from?.pathname || '/admin/dashboard';
            nav(from, {
                state: {
                    message: 'Welcome to Admin Panel!',
                    type: 'success'
                }
            });
        } catch (err) {
            setSubmitError(err.response?.data?.message || err.message || 'Admin login failed. Please check your credentials and try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col md:flex-row bg-white">
            {/* Left Panel - Hero Gradient */}
            <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-indigo-900 via-slate-800 to-blue-900 text-white p-12 flex-col justify-between relative overflow-hidden">
                {/* Subtle decorative blurred circles */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl transform translate-x-20 -translate-y-20"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl transform -translate-x-20 translate-y-20"></div>
                
                {/* Logo/Brand Header */}
                <div className="flex items-center space-x-2 z-10">
                    <div className="w-8 h-8 bg-white/10 backdrop-blur-md rounded-lg flex items-center justify-center border border-white/20 text-white">
                        <BrandMark className="w-4 h-4" />
                    </div>
                    <span className="text-xl font-bold tracking-wider text-white">Expireo Admin</span>
                </div>

                {/* Bottom Overlay Card */}
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 max-w-lg border border-white/20 shadow-2xl z-10">
                    <div className="flex items-center space-x-2 text-xs font-semibold tracking-wider text-red-400 uppercase mb-4">
                        <span className="w-2.5 h-2.5 rounded-full bg-red-400 animate-pulse"></span>
                        <span>Admin Control Active</span>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white mb-2">
                        System Oversight Control
                    </h2>
                    <p className="text-white/80 text-sm leading-relaxed">
                        Access system analytics, security monitoring logs, active link records, and rate limiting status.
                    </p>
                </div>
            </div>

            {/* Right Panel - Admin Login Form */}
            <div className="w-full md:w-1/2 flex flex-col justify-between p-8 md:p-16 bg-white overflow-y-auto min-h-screen">
                {/* Header for Mobile only */}
                <div className="md:hidden flex items-center space-x-2 mb-8">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-650 rounded-lg flex items-center justify-center text-white">
                        <BrandMark className="w-4 h-4" />
                    </div>
                    <span className="text-xl font-bold tracking-wider text-gray-900">Expireo Admin</span>
                </div>

                <div className="my-auto max-w-md w-full mx-auto space-y-8">
                    {/* Header */}
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
                            Admin Access
                        </h2>
                        <p className="mt-2 text-sm text-gray-500">
                            Enter your credentials to access the admin panel.
                        </p>
                    </div>

                    {/* Error Notice */}
                    {submitError && (
                        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
                            <svg className="w-5 h-5 text-red-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                            <span className="text-red-800 text-sm">{submitError}</span>
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={onSubmit} className="space-y-5">
                        {/* Email Address */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1.5">
                                Email Address
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.206" />
                                    </svg>
                                </div>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent transition duration-200 outline-none text-gray-850 text-sm ${
                                        errors.email ? 'border-red-300 bg-red-50/20' : 'border-gray-300'
                                    }`}
                                    placeholder="admin@expireo.com"
                                />
                            </div>
                            {errors.email && (
                                <p className="mt-1.5 text-xs text-red-650 font-medium">{errors.email}</p>
                            )}
                        </div>

                        {/* Password */}
                        <div>
                            <div className="flex items-center justify-between mb-1.5">
                                <label htmlFor="password" className="block text-sm font-semibold text-gray-700">
                                    Password
                                </label>
                                <Link 
                                    to="/admin/forgot-password" 
                                    className="text-xs font-semibold text-blue-655 hover:text-blue-750 transition duration-200"
                                >
                                    Forgot password?
                                </Link>
                            </div>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                </div>
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    value={formData.password}
                                    onChange={handleChange}
                                    className={`w-full pl-10 pr-10 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent transition duration-200 outline-none text-gray-850 text-sm ${
                                        errors.password ? 'border-red-300 bg-red-50/20' : 'border-gray-300'
                                    }`}
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(prev => !prev)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 cursor-pointer"
                                >
                                    {showPassword ? (
                                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                                        </svg>
                                    ) : (
                                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="mt-1.5 text-xs text-red-650 font-medium">{errors.password}</p>
                            )}
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-blue-650 hover:bg-blue-750 active:bg-blue-800 disabled:opacity-50 text-white font-semibold py-2.5 px-4 rounded-lg transition duration-200 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-sm text-sm"
                        >
                            {isLoading ? 'Accessing...' : 'Access Admin Panel'}
                        </button>
                    </form>

                    {/* Toggle Links */}
                    <div className="text-center pt-4 border-t border-gray-100 mt-6 space-y-2">
                        <p className="text-sm text-gray-500">
                            Don't have an admin account?{' '}
                            <Link 
                                to="/admin/signup" 
                                className="font-semibold text-blue-600 hover:text-blue-700 transition duration-200"
                            >
                                Create Admin Account
                            </Link>
                        </p>
                        <p className="text-sm text-gray-400">
                            <Link 
                                to="/login" 
                                className="hover:text-gray-600 transition duration-200 font-medium"
                            >
                                ← Back to User Login
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-8 pt-6 border-t border-gray-100 text-center flex justify-center space-x-6 text-xs text-gray-400 font-medium">
                    <a href="#" className="hover:text-gray-600 transition">Privacy Policy</a>
                    <a href="#" className="hover:text-gray-600 transition">Terms of Service</a>
                    <a href="#" className="hover:text-gray-600 transition">Help Center</a>
                </div>
            </div>
        </div>
    );
}
