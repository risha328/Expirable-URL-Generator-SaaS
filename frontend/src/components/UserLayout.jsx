import React, { useState } from 'react';
import UserSidebar from './UserSidebar';

export default function UserLayout({ children }) {
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Mobile Hamburger Button for Sidebar Toggle */}
            <div className="md:hidden fixed top-4 left-4 z-50">
                <button
                    onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
                    className="p-2 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 transition-colors"
                    title="Toggle Sidebar"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>
            </div>

            {/* Sidebar with AnimatedLogo & Bottom Profile */}
            <UserSidebar
                isMobileOpen={isMobileSidebarOpen}
                setIsMobileOpen={setIsMobileSidebarOpen}
            />

            {/* Main Dashboard Viewport */}
            <div className="flex-1 flex flex-col min-w-0">
                <main className="flex-1 p-6 sm:p-8 w-full">
                    {children}
                </main>
            </div>
        </div>
    );
}
