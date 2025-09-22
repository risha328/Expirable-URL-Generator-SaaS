import React, { createContext, useState, useEffect } from 'react';
import api from '../api/api';
import { useNavigate } from 'react-router-dom';


export const AuthContext = createContext();


export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();


    useEffect(() => {
        const token = localStorage.getItem('token');
        const userStr = localStorage.getItem('user');
        if (token && userStr) setUser(JSON.parse(userStr));
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
        navigate('/login');
    };


    return (
        <AuthContext.Provider value={{ user, login, signup, logout }}>
            {children}
        </AuthContext.Provider>
    );
};