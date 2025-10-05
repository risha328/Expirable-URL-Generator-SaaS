import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: process.env.VITE_BACKEND_URL || "http://localhost:5000", // Backend URL without /api prefix
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout to prevent hanging requests
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - clear auth state
      localStorage.removeItem('token');
      localStorage.removeItem('user');

      // Only redirect to login if we're not already on a login-related page
      // and if this isn't a token validation request
      const currentPath = window.location.pathname;
      if (!currentPath.includes('/login') && !currentPath.includes('/signup')) {
        // Use a more graceful redirect that doesn't interfere with React Router
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
