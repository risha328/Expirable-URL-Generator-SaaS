import React, { useContext, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import AnimatedLogo from './AnimatedLogo';

export default function UserSidebar({ isMobileOpen, setIsMobileOpen }) {
    const location = useLocation();
    const { user, logout } = useContext(AuthContext);
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    const isActive = (path) => {
        if (path === '/dashboard' && location.pathname === '/dashboard') return true;
        if (path !== '/dashboard' && location.pathname.startsWith(path)) return true;
        return false;
    };

    const navItems = [
        {
            name: 'Dashboard Overview',
            path: '/dashboard',
            icon: (
                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
            )
        },
        {
            name: 'My Links',
            path: '/my-links',
            icon: (
                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
            )
        },
        {
            name: 'Analytics',
            path: '/analytics',
            icon: (
                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
            )
        },
        {
            name: 'Billing',
            path: '/billing',
            icon: (
                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
            )
        }
        /*
        {
            name: 'Secret Links',
            path: '/secret-links',
            icon: (
                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
            )
        },
        {
            name: 'API Keys & Webhooks',
            path: '/api-keys',
            icon: (
                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
            )
        }
        */
    ];

    const getUserInitials = () => {
        if (user?.firstName) {
            return (user.firstName.charAt(0) + (user.lastName ? user.lastName.charAt(0) : '')).toUpperCase();
        }
        return 'RD';
    };

    const getUserDisplayName = () => {
        if (user?.firstName) {
            return `${user.firstName} ${user.lastName || ''}`.trim();
        }
        return "Rachael D'souza";
    };

    return (
        <>
            {/* Mobile overlay */}
            {isMobileOpen && (
                <div
                    className="fixed inset-0 z-40 bg-gray-900/50 backdrop-blur-sm md:hidden"
                    onClick={() => setIsMobileOpen(false)}
                />
            )}

            <aside
                className={`fixed md:sticky top-0 left-0 z-40 h-screen w-64 bg-white border-r border-gray-200/80 shadow-sm transition-transform duration-300 ease-in-out flex flex-col justify-between overflow-hidden ${
                    isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
                }`}
            >
                {/* Top Animated Logo Header */}
                <div className="p-6 pb-4 flex items-center">
                    <AnimatedLogo size="large" />
                </div>

                {/* Main Navigation Area */}
                <nav className="flex-1 px-4 py-2 space-y-1.5 overflow-y-auto">
                    <ul className="space-y-1.5">
                        {navItems.map((item) => {
                            const active = isActive(item.path);
                            return (
                                <li key={item.name}>
                                    <Link
                                        to={item.path}
                                        onClick={() => setIsMobileOpen(false)}
                                        className={`flex items-center px-4 py-3 rounded-xl transition-all duration-200 ${
                                            active
                                                ? 'bg-blue-600 text-white font-semibold shadow-md shadow-blue-500/20'
                                                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                        }`}
                                    >
                                        <span className={`${active ? 'text-white' : 'text-blue-600'}`}>
                                            {item.icon}
                                        </span>
                                        <span className="ml-3 text-sm font-medium">{item.name}</span>
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </nav>

                {/* Bottom Profile Area */}
                <div className="p-6 pt-4 border-t border-gray-100 space-y-4 bg-white">
                    {/* User Info Container */}
                    <Link
                        to="/profile"
                        onClick={() => setIsMobileOpen(false)}
                        className="block group hover:opacity-90 transition-opacity"
                    >
                        <div className="flex items-center space-x-3.5">
                            {/* Blue Circular Avatar */}
                            <div className="w-12 h-12 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-base shadow-md shadow-blue-500/30 flex-shrink-0">
                                {getUserInitials()}
                            </div>
                            <div className="min-w-0 flex-1">
                                <h4 className="text-base font-bold text-slate-800 truncate group-hover:text-blue-600 transition-colors">
                                    {getUserDisplayName()}
                                </h4>
                            </div>
                        </div>
                    </Link>

                    {/* Dedicated Sign Out Button */}
                    <div className="pt-2 border-t border-gray-100">
                        <button
                            onClick={() => setShowLogoutModal(true)}
                            className="w-full flex items-center space-x-2.5 text-rose-600 hover:text-rose-700 py-1 text-sm font-semibold transition-colors group cursor-pointer"
                        >
                            <svg className="w-5 h-5 text-rose-500 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            <span>Sign Out</span>
                        </button>
                    </div>
                </div>
            </aside>

            {/* Sign Out Confirmation Modal */}
            {showLogoutModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 backdrop-blur-xs p-4">
                    <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl border border-gray-100 text-center animate-in fade-in zoom-in-95 duration-200">
                        <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-4">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                        </div>

                        <h3 className="text-lg font-bold text-gray-900 mb-1">Confirm Sign Out</h3>
                        <p className="text-sm text-gray-500 mb-6">Are you sure you want to sign out of your account?</p>

                        <div className="flex space-x-3">
                            <button
                                onClick={() => setShowLogoutModal(false)}
                                className="flex-1 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-sm rounded-xl transition-colors"
                            >
                                No, Cancel
                            </button>
                            <button
                                onClick={() => {
                                    setShowLogoutModal(false);
                                    logout();
                                }}
                                className="flex-1 px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-semibold text-sm rounded-xl shadow-md shadow-rose-600/30 transition-all"
                            >
                                Yes, Sign Out
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
