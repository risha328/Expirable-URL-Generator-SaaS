import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function Signup() {
    const { signup } = useContext(AuthContext);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: ''
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [submitError, setSubmitError] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
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
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.firstName.trim()) {
            newErrors.firstName = 'First name is required';
        } else if (formData.firstName.length < 2) {
            newErrors.firstName = 'First name must be at least 2 characters';
        }

        if (!formData.lastName.trim()) {
            newErrors.lastName = 'Last name is required';
        } else if (formData.lastName.length < 2) {
            newErrors.lastName = 'Last name must be at least 2 characters';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters';
        } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
            newErrors.password = 'Password must contain uppercase, lowercase, and numbers';
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
            await signup(formData.firstName, formData.lastName, formData.email, formData.password);
            nav('/dashboard', { 
                state: { 
                    message: 'Welcome to Expireo! Your account has been created successfully.',
                    type: 'success'
                }
            });
        } catch (err) { 
            setSubmitError(err.response?.data?.message || 'Signup failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex-1 min-h-[calc(100vh-64px)] flex flex-col md:flex-row bg-white">
            {/* Left Panel - Hero Gradient */}
            <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-blue-700 via-indigo-700 to-violet-800 text-white p-12 flex-col justify-between relative overflow-hidden">
                {/* Subtle decorative blurred circles */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl transform translate-x-20 -translate-y-20"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl transform -translate-x-20 translate-y-20"></div>
                
                {/* Logo/Brand Header */}
                <div className="flex items-center space-x-2 z-10">
                    <div className="w-8 h-8 bg-white/10 backdrop-blur-md rounded-lg flex items-center justify-center border border-white/20">
                        <span className="text-white font-bold text-lg">E</span>
                    </div>
                    <span className="text-xl font-bold tracking-wider text-white">Expireo</span>
                </div>

                {/* Bottom Overlay Card */}
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 max-w-lg border border-white/20 shadow-2xl z-10">
                    <div className="flex items-center space-x-2 text-xs font-semibold tracking-wider text-green-400 uppercase mb-4">
                        <span className="w-2.5 h-2.5 rounded-full bg-green-400 animate-pulse"></span>
                        <span>Global Node Network Active</span>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white mb-2">
                        Empowering the next billion links.
                    </h2>
                    <p className="text-white/80 text-sm leading-relaxed">
                        SnapLink Pro provides ultra-low latency redirection with military-grade expiration protocols.
                    </p>
                </div>
            </div>

            {/* Right Panel - Signup Form */}
            <div className="w-full md:w-1/2 flex flex-col justify-between p-8 md:p-16 bg-white overflow-y-auto min-h-[calc(100vh-64px)]">
                {/* Header for Mobile only */}
                <div className="md:hidden flex items-center space-x-2 mb-8">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-lg">E</span>
                    </div>
                    <span className="text-xl font-bold tracking-wider text-gray-900">Expireo</span>
                </div>

                <div className="my-auto max-w-md w-full mx-auto space-y-8">
                    {/* Header */}
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
                            Create your account
                        </h2>
                        <p className="mt-2 text-sm text-gray-500">
                            Enter your details to register your account.
                        </p>
                    </div>

                    {/* Social Logins */}
                    <div className="grid grid-cols-2 gap-4">
                        <button
                            type="button"
                            className="flex items-center justify-center px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm bg-white hover:bg-gray-50 text-sm font-medium text-gray-700 transition duration-200"
                        >
                            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.85z" fill="#FBBC05"/>
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.85c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                            </svg>
                            <span>Google</span>
                        </button>
                        <button
                            type="button"
                            className="flex items-center justify-center px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm bg-white hover:bg-gray-50 text-sm font-medium text-gray-700 transition duration-200"
                        >
                            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482C19.138 20.197 22 16.44 22 12.017 22 6.484 17.522 2 12 2z"/>
                            </svg>
                            <span>GitHub</span>
                        </button>
                    </div>

                    {/* Divider */}
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-200"></div>
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-white px-3 text-gray-400 tracking-wider font-semibold">Or with email</span>
                        </div>
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
                    <form onSubmit={onSubmit} className="space-y-4">
                        {/* First & Last Name */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="firstName" className="block text-sm font-semibold text-gray-700 mb-1.5">
                                    First Name
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                    </div>
                                    <input
                                        id="firstName"
                                        name="firstName"
                                        type="text"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        className={`w-full pl-9 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent transition duration-200 outline-none text-gray-850 text-sm ${
                                            errors.firstName ? 'border-red-300 bg-red-50/20' : 'border-gray-300'
                                        }`}
                                        placeholder="John"
                                    />
                                </div>
                                {errors.firstName && (
                                    <p className="mt-1 text-xs text-red-650 font-medium">{errors.firstName}</p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="lastName" className="block text-sm font-semibold text-gray-700 mb-1.5">
                                    Last Name
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                    </div>
                                    <input
                                        id="lastName"
                                        name="lastName"
                                        type="text"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        className={`w-full pl-9 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent transition duration-200 outline-none text-gray-850 text-sm ${
                                            errors.lastName ? 'border-red-300 bg-red-50/20' : 'border-gray-300'
                                        }`}
                                        placeholder="Doe"
                                    />
                                </div>
                                {errors.lastName && (
                                    <p className="mt-1 text-xs text-red-650 font-medium">{errors.lastName}</p>
                                )}
                            </div>
                        </div>

                        {/* Email Address */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1.5">
                                Email Address
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
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
                                    className={`w-full pl-9 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent transition duration-200 outline-none text-gray-850 text-sm ${
                                        errors.email ? 'border-red-300 bg-red-50/20' : 'border-gray-300'
                                    }`}
                                    placeholder="name@company.com"
                                />
                            </div>
                            {errors.email && (
                                <p className="mt-1 text-xs text-red-650 font-medium">{errors.email}</p>
                            )}
                        </div>

                        {/* Password */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-1.5">
                                Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
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
                                    className={`w-full pl-9 pr-10 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent transition duration-200 outline-none text-gray-850 text-sm ${
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
                            {errors.password ? (
                                <p className="mt-1 text-xs text-red-650 font-medium">{errors.password}</p>
                            ) : (
                                <p className="mt-1 text-[10px] text-gray-400 font-medium">
                                    Must be at least 8 characters with uppercase, lowercase, and numbers
                                </p>
                            )}
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:opacity-50 text-white font-semibold py-2.5 px-4 rounded-lg transition duration-200 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-sm text-sm"
                        >
                            {isLoading ? 'Creating Account...' : 'Create Account'}
                        </button>
                    </form>

                    {/* Toggle Link */}
                    <div className="text-center pt-2">
                        <p className="text-sm text-gray-500">
                            Already have an account?{' '}
                            <Link 
                                to="/login" 
                                className="font-semibold text-blue-600 hover:text-blue-700 transition duration-200"
                            >
                                Sign In
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