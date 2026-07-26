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
import AdminIPAnalytics from './pages/AdminIPAnalytics';
import AdminIPDetails from './pages/AdminIPDetails';
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
import Billing from './pages/Billing';
import RedirectHandler from './components/RedirectHandler';
import AdminSettings from './pages/AdminSettings';
import ChatbotComponent from './components/ChatbotComponent';
import UserLayout from './components/UserLayout';
import MyLinks from './pages/MyLinks';
import SecretLinks from './pages/SecretLinks';
import ApiKeys from './pages/ApiKeys';
import CreateLinkPage from './pages/CreateLinkPage';
import AnimatedFavicon from './components/AnimatedFavicon';

function AppContent() {
    return (
        <div className="min-h-screen">
            <AnimatedFavicon />
            <Routes>
                {/* Public routes with common navbar and footer */}
                <Route path="/" element={
                    <>
                        <Navbar />
                        <main className="w-full pt-16">
                            <Home />
                            <Footer />
                        </main>
                    </>
                } />
                <Route path="/pricing" element={
                    <>
                        <Navbar />
                        <main className="w-full pt-16">
                            <Pricing />
                            <Footer />
                        </main>
                    </>
                } />
                <Route path="/features" element={
                    <>
                        <Navbar />
                        <main className="w-full pt-16">
                            <Features />
                            <Footer />
                        </main>
                    </>
                } />
                <Route path="/contact" element={
                    <>
                        <Navbar />
                        <main className="w-full pt-16">
                            <Contact />
                            <Footer />
                        </main>
                    </>
                } />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />

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
                <Route path="/admin/ip-analytics" element={
                    <AdminProtectedRoute>
                        <AdminIPAnalytics />
                    </AdminProtectedRoute>
                } />
                <Route path="/admin/ip-analytics/:id" element={
                    <AdminProtectedRoute>
                        <AdminIPDetails />
                    </AdminProtectedRoute>
                } />

                {/* Protected user routes with sidebar layout */}
                <Route path="/dashboard" element={
                    <ProtectedRoute>
                        <UserLayout>
                            <Dashboard />
                        </UserLayout>
                    </ProtectedRoute>
                } />
                <Route path="/my-links" element={
                    <ProtectedRoute>
                        <UserLayout>
                            <MyLinks />
                        </UserLayout>
                    </ProtectedRoute>
                } />
                <Route path="/my-links/create" element={
                    <ProtectedRoute>
                        <UserLayout>
                            <CreateLinkPage />
                        </UserLayout>
                    </ProtectedRoute>
                } />
                <Route path="/create" element={
                    <ProtectedRoute>
                        <UserLayout>
                            <CreateLinkPage />
                        </UserLayout>
                    </ProtectedRoute>
                } />
                <Route path="/analytics" element={
                    <ProtectedRoute>
                        <UserLayout>
                            <MyLinks />
                        </UserLayout>
                    </ProtectedRoute>
                } />
                <Route path="/analytics/:slug" element={
                    <ProtectedRoute>
                        <UserLayout>
                            <Analytics />
                        </UserLayout>
                    </ProtectedRoute>
                } />

                <Route path="/secret-links" element={
                    <ProtectedRoute>
                        <UserLayout>
                            <SecretLinks />
                        </UserLayout>
                    </ProtectedRoute>
                } />
                <Route path="/api-keys" element={
                    <ProtectedRoute>
                        <UserLayout>
                            <ApiKeys />
                        </UserLayout>
                    </ProtectedRoute>
                } />
                <Route path="/billing" element={
                    <ProtectedRoute>
                        <UserLayout>
                            <Billing />
                        </UserLayout>
                    </ProtectedRoute>
                } />
                <Route path="/profile" element={
                    <ProtectedRoute>
                        <UserLayout>
                            <Profile />
                        </UserLayout>
                    </ProtectedRoute>
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
