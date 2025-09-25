import React, { useContext, useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
    const { user, isLoading, isInitialized } = useContext(AuthContext);
    const location = useLocation();
    const [showTimeoutError, setShowTimeoutError] = useState(false);

    // Loading timeout to prevent indefinite loading
    useEffect(() => {
        if (isLoading || !isInitialized) {
            const timeout = setTimeout(() => {
                setShowTimeoutError(true);
            }, 10000); // 10 seconds
            return () => clearTimeout(timeout);
        }
    }, [isLoading, isInitialized]);

    // Show loading spinner while authentication is being initialized
    if ((isLoading || !isInitialized) && !showTimeoutError) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    // Show timeout error and redirect to login
    if (showTimeoutError) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-600 mb-4">Authentication check timed out. Please try logging in again.</p>
                    <Navigate to="/login" state={{ from: location }} replace />
                </div>
            </div>
        );
    }

    // Only redirect to login after authentication has been properly checked
    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
};

export default ProtectedRoute;
