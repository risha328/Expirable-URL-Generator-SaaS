import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AdminLogin from './pages/AdminLogin';
import AdminSignup from './pages/AdminSignup';
import AdminDashboard from './pages/AdminDashboard';
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
import RedirectHandler from './components/RedirectHandler';

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
        </AuthProvider>
    );
}
