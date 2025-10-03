import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AdminLogin from './pages/AdminLogin';
import AdminSignup from './pages/AdminSignup';
import AdminDashboard from './pages/AdminDashboard';
import AdminUsers from './pages/AdminUsers';
import AdminLinks from './pages/AdminLinks';
import AdminAnalytics from './pages/AdminAnalytics';
import CreateLink from './pages/CreateLink';
import Analytics from './pages/Analytics';
import ProtectedRoute from './components/ProtectedRoute';
import AdminProtectedRoute from './components/AdminProtectedRoute';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Pricing from './pages/Pricing';
import Features from './pages/Features';
import Contact from './pages/Contact';
import Footer from './components/Footer';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import RedirectHandler from './components/RedirectHandler';
import AdminSettings from './pages/AdminSettings';
import ChatbotComponent from './components/ChatbotComponent';

function AppContent() {
    return (
        <div className="min-h-screen">
            <Routes>
                {/* Public routes with common navbar and footer */}
                <Route path="/" element={
                    <>
                        <Navbar />
                        <main className="container mx-auto p-4">
                            <Home />
                            <Footer />
                        </main>
                    </>
                } />
                <Route path="/pricing" element={
                    <>
                        <Navbar />
                        <main className="container mx-auto p-4">
                            <Pricing />
                            <Footer />
                        </main>
                    </>
                } />
                <Route path="/features" element={
                    <>
                        <Navbar />
                        <main className="container mx-auto p-4">
                            <Features />
                            <Footer />
                        </main>
                    </>
                } />
                <Route path="/contact" element={
                    <>
                        <Navbar />
                        <main className="container mx-auto p-4">
                            <Contact />
                            <Footer />
                        </main>
                    </>
                } />
                <Route path="/login" element={
                    <>
                        <Navbar />
                        <main className="container mx-auto p-4">
                            <Login />
                            <Footer />
                        </main>
                    </>
                } />
                <Route path="/signup" element={
                    <>
                        <Navbar />
                        <main className="container mx-auto p-4">
                            <Signup />
                            <Footer />
                        </main>
                    </>
                } />

                {/* Admin routes without common navbar and footer */}
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin/signup" element={<AdminSignup />} />
                <Route path="/admin/dashboard" element={
                    <AdminProtectedRoute>
                        <AdminDashboard />
                    </AdminProtectedRoute>
                } />
                <Route path="/admin/users" element={
                    <AdminProtectedRoute>
                        <AdminUsers />
                    </AdminProtectedRoute>
                } />
                <Route path="/admin/links" element={
                    <AdminProtectedRoute>
                        <AdminLinks />
                    </AdminProtectedRoute>
                } />
                <Route path="/admin/analytics" element={
                    <AdminProtectedRoute>
                        <AdminAnalytics />
                    </AdminProtectedRoute>
                } />
                <Route path="/admin/settings" element={
                    <AdminProtectedRoute>
                        <AdminSettings />
                    </AdminProtectedRoute>
                } />

                {/* Protected user routes with common navbar and footer */}
                <Route path="/dashboard" element={
                    <>
                        <Navbar />
                        <main className="container mx-auto p-4">
                            <ProtectedRoute>
                                <Dashboard />
                            </ProtectedRoute>
                            <Footer />
                        </main>
                    </>
                } />
                <Route path="/create" element={
                    <>
                        <Navbar />
                        <main className="container mx-auto p-4">
                            <ProtectedRoute>
                                <CreateLink />
                            </ProtectedRoute>
                            <Footer />
                        </main>
                    </>
                } />
                <Route path="/analytics/:slug" element={
                    <>
                        <Navbar />
                        <main className="container mx-auto p-4">
                            <ProtectedRoute>
                                <Analytics />
                            </ProtectedRoute>
                            <Footer />
                        </main>
                    </>
                } />
                <Route path="/profile" element={
                    <>
                        <Navbar />
                        <main className="container mx-auto p-4">
                            <ProtectedRoute>
                                <Profile />
                            </ProtectedRoute>
                            <Footer />
                        </main>
                    </>
                } />

                {/* Redirect handler without navbar/footer */}
                <Route path="/:slug" element={<RedirectHandler />} />
            </Routes>
        </div>
    );
}

export default function App() {
    return (
        <AuthProvider>
            <AppContent />
            <ChatbotComponent />
            <Toaster
                position="top-right"
                toastOptions={{
                    duration: 5000,
                    style: {
                        background: '#363636',
                        color: '#fff',
                    },
                    success: {
                        duration: 3000,
                        theme: {
                            primary: '#4ade80',
                            secondary: '#fff',
                        },
                    },
                    error: {
                        duration: 4000,
                        theme: {
                            primary: '#f87171',
                            secondary: '#fff',
                        },
                    },
                }}
            />
        </AuthProvider>
    );
}
