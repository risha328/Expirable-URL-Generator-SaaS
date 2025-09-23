import React, { createContext, useState, useEffect } from 'react';
import api from '../api/api';


export const AuthContext = createContext();


export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isInitialized, setIsInitialized] = useState(false);


    // Validate token on app startup
    const validateToken = async (token) => {
        try {
            const res = await api.get('/auth/validate');
            return res.data.user;
        } catch (error) {
            // Token is invalid or expired
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            return null;
        }
    };


    useEffect(() => {
        const initializeAuth = async () => {
            const token = localStorage.getItem('token');
            const userStr = localStorage.getItem('user');

            if (token && userStr) {
                // Validate token with backend
                const validatedUser = await validateToken(token);
                if (validatedUser) {
                    setUser(validatedUser);
                } else {
                    setUser(null);
                }
            } else {
                setUser(null);
            }

            setIsLoading(false);
            setIsInitialized(true);
        };

        initializeAuth();
    }, []);


    const login = async (email, password) => {
        const res = await api.post('/auth/login', { email, password });
        const { token, user } = res.data;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        setUser(user);
        return user;
    };


    const signup = async (firstName, lastName, email, password) => {
        const res = await api.post('/auth/signup', { firstName, lastName, email, password });
        return res.data;
    };


    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        // Let the component handle navigation
    };


    return (
        <AuthContext.Provider value={{
            user,
            setUser,
            login,
            signup,
            logout,
            isLoading,
            isInitialized
        }}>
            {children}
        </AuthContext.Provider>
    );
};
