import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import AuthCarousel from '../components/AuthCarousel';
import AnimatedLogo from '../components/AnimatedLogo';

export default function Login() {
    const { login } = useContext(AuthContext);
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
            // Redirect to the original location or dashboard
            const from = location.state?.from?.pathname || '/dashboard';
            nav(from, {
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
            // Redirect to the original location or dashboard
            const from = location.state?.from?.pathname || '/dashboard';
            nav(from, {
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
        <div className="min-h-screen w-full flex flex-col lg:flex-row bg-white">
            {/* Left Panel - 2-Second Auto Carousel */}
            <AuthCarousel />

            {/* Right Panel - Login Form */}
            <div className="w-full lg:w-1/2 flex flex-col justify-between p-6 sm:p-8 lg:p-16 bg-white overflow-y-auto flex-1 min-h-screen">
                {/* Mobile logo — carousel hidden on small screens */}
                <div className="lg:hidden mb-6">
                    <AnimatedLogo size="small" />
                </div>

                <div className="my-auto max-w-md w-full mx-auto space-y-6 sm:space-y-8 lg:py-0">
                    {/* Header */}
                    <div>
                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
                            Welcome back
                        </h2>
                        <p className="mt-2 text-sm text-gray-500">
                            Enter your details to access your dashboard.
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
                                    className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent transition duration-200 outline-none text-gray-850 ${
                                        errors.email ? 'border-red-300 bg-red-50/20' : 'border-gray-300'
                                    }`}
                                    placeholder="name@company.com"
                                />
                            </div>
                            {errors.email && (
                                <p className="mt-1.5 text-xs text-red-600 font-medium">{errors.email}</p>
                            )}
                        </div>

                        {/* Password */}
                        <div>
                            <div className="flex items-center justify-between mb-1.5">
                                <label htmlFor="password" className="block text-sm font-semibold text-gray-700">
                                    Password
                                </label>
                                <Link 
                                    to="/forgot-password" 
                                    className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition duration-200"
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
                                    className={`w-full pl-10 pr-10 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent transition duration-200 outline-none text-gray-850 ${
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
                                <p className="mt-1.5 text-xs text-red-600 font-medium">{errors.password}</p>
                            )}
                        </div>

                        {/* Remember Me */}
                        <div className="flex items-center">
                            <input
                                id="remember-me"
                                name="remember-me"
                                type="checkbox"
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
                            />
                            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 font-medium cursor-pointer">
                                Remember for 30 days
                            </label>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:opacity-50 text-white font-semibold py-2.5 px-4 rounded-lg transition duration-200 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-sm text-sm"
                        >
                            {isLoading ? 'Signing In...' : 'Sign In'}
                        </button>
                    </form>

                    {/* Signup Toggle */}
                    <div className="text-center">
                        <p className="text-sm text-gray-500">
                            Don't have an account?{' '}
                            <Link 
                                to="/signup" 
                                className="font-semibold text-blue-600 hover:text-blue-700 transition duration-200"
                            >
                                Create an account
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-8 pt-6 border-t border-gray-100 text-center flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs text-gray-400 font-medium">
                    <a href="#" className="hover:text-gray-600 transition">Privacy Policy</a>
                    <a href="#" className="hover:text-gray-600 transition">Terms of Service</a>
                    <a href="#" className="hover:text-gray-600 transition">Help Center</a>
                </div>
            </div>
        </div>
    );
}