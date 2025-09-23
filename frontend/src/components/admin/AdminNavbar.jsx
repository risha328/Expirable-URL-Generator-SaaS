// import React, { useContext } from 'react';
// import { AuthContext } from '../../context/AuthContext';
// import { Link } from 'react-router-dom';

// export default function AdminNavbar() {
//     const { user, logout } = useContext(AuthContext);

//     const handleLogout = () => {
//         logout();
//     };

//     return (
//         <nav className="bg-white shadow-sm border-b border-red-200">
//             <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//                 <div className="flex justify-between items-center py-4">
//                     <div className="flex items-center space-x-4">
//                         <Link to="/" className="flex items-center space-x-2">
//                             <div className="w-8 h-8 bg-gradient-to-r from-red-600 to-orange-600 rounded-lg flex items-center justify-center">
//                                 <span className="text-white font-bold text-lg">E</span>
//                             </div>
//                             <span className="text-xl font-bold text-gray-900">Expireo Admin</span>
//                         </Link>
//                     </div>
//                     <div className="flex items-center space-x-4">
//                         <span className="text-sm text-gray-600">
//                             Welcome, {user?.firstName} {user?.lastName}
//                         </span>
//                         <Link
//                             to="/"
//                             className="text-gray-600 hover:text-gray-900 transition-colors duration-200"
//                         >
//                             ← Back to Site
//                         </Link>
//                         <button
//                             onClick={handleLogout}
//                             className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
//                         >
//                             Logout
//                         </button>
//                     </div>
//                 </div>
//             </div>
//         </nav>
//     );
// }


import React, { useContext, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

export default function AdminNavbar() {
    const { user, logout } = useContext(AuthContext);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const handleLogout = () => {
        logout();
        setIsDropdownOpen(false);
    };

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    return (
        <nav className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Left Section - Logo and Brand */}
                    <div className="flex items-center space-x-4">
                        <Link 
                            to="/admin" 
                            className="flex items-center space-x-3 hover:opacity-90 transition-opacity duration-200"
                        >
                            <div className="w-10 h-10 bg-gradient-to-r from-red-600 to-orange-600 rounded-lg flex items-center justify-center shadow-md">
                                <span className="text-white font-bold text-xl">E</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xl font-bold text-gray-900 leading-tight">Expireo</span>
                                <span className="text-xs text-gray-500 font-medium uppercase tracking-wide">Admin Portal</span>
                            </div>
                        </Link>
                    </div>

                    {/* Right Section - User Info and Actions */}
                    <div className="flex items-center space-x-6">
                        {/* Quick Stats (Optional - can be dynamic) */}
                        <div className="hidden md:flex items-center space-x-4">
                            {/* <div className="text-right">
                                <div className="text-xs text-gray-500 uppercase tracking-wide">Status</div>
                                <div className="text-sm font-medium text-green-600">Online</div>
                            </div> */}
                        </div>

                        {/* Back to Main Site */}
                        {/* <Link
                            to="/"
                            className="hidden md:flex items-center space-x-1 text-gray-600 hover:text-gray-900 transition-colors duration-200 px-3 py-2 rounded-md hover:bg-gray-100"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            <span className="text-sm font-medium">Main Site</span>
                        </Link> */}

                        {/* User Dropdown */}
                        <div className="relative">
                            <button
                                onClick={toggleDropdown}
                                className="flex items-center space-x-3 bg-gray-50 hover:bg-gray-100 rounded-lg px-3 py-2 transition-colors duration-200 border border-gray-200"
                            >
                                <div className="w-8 h-8 bg-gradient-to-r from-red-600 to-orange-600 rounded-full flex items-center justify-center shadow-sm">
                                    <span className="text-white font-bold text-sm uppercase">
                                        {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                                    </span>
                                </div>
                                <div className="hidden md:block text-left">
                                    <div className="text-sm font-medium text-gray-900">
                                        {user?.firstName} {user?.lastName}
                                    </div>
                                    <div className="text-xs text-gray-500 capitalize">
                                        {user?.role || 'Administrator'}
                                    </div>
                                </div>
                                <svg 
                                    className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
                                    fill="none" 
                                    stroke="currentColor" 
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>

                            {/* Dropdown Menu */}
                            {isDropdownOpen && (
                                <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
                                    {/* User Info Section */}
                                    <div className="px-4 py-3 border-b border-gray-100">
                                        <div className="text-sm font-medium text-gray-900">
                                            {user?.firstName} {user?.lastName}
                                        </div>
                                        <div className="text-xs text-gray-500 truncate">{user?.email}</div>
                                    </div>

                                    {/* Quick Actions */}
                                    <div className="px-2 py-2">
                                        <Link
                                            to="/admin/profile"
                                            className="flex items-center space-x-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors duration-200"
                                            onClick={() => setIsDropdownOpen(false)}
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                            <span>Profile Settings</span>
                                        </Link>
                                        <Link
                                            to="/admin/settings"
                                            className="flex items-center space-x-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors duration-200"
                                            onClick={() => setIsDropdownOpen(false)}
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                            <span>System Settings</span>
                                        </Link>
                                    </div>

                                    {/* Logout Section */}
                                    <div className="px-2 py-2 border-t border-gray-100">
                                        <button
                                            onClick={handleLogout}
                                            className="flex items-center space-x-3 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors duration-200"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                            </svg>
                                            <span>Logout</span>
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Back Button */}
            <div className="md:hidden bg-gray-50 border-t border-gray-200 px-4 py-2">
                <Link
                    to="/"
                    className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    <span>Back to Main Site</span>
                </Link>
            </div>
        </nav>
    );
}