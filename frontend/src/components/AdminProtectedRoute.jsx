import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const AdminProtectedRoute = ({ children }) => {
    const { user, isLoading, isInitialized } = useContext(AuthContext);
    const location = useLocation();

    // Show loading spinner while authentication is being initialized
    if (isLoading || !isInitialized) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    // Redirect to login if not authenticated
    if (!user) {
        return <Navigate to="/admin/login" state={{ from: location }} replace />;
    }

    // Redirect to admin login if not admin
    if (user.role !== 'admin') {
        return <Navigate to="/admin/login" state={{ from: location, message: 'Admin access required' }} replace />;
    }

    return children;
};

export default AdminProtectedRoute;
