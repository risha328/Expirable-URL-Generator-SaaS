import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import CreateLink from './pages/CreateLink';
import Analytics from './pages/Analytics';
// import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Pricing from './pages/Pricing';
import Features from './pages/Features';
import Contact from './pages/Contact';
import Footer from './components/Footer';
import Dashboard from './pages/Dashboard';


export default function App() {
    return (
        <div className="min-h-screen">
            <Navbar />
            <main className="container mx-auto p-4">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/pricing" element={<Pricing />} />
                    <Route path="/features" element={<Features />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/create" element={<CreateLink />} />
                    <Route path="/analytics/:slug" element={<Analytics />} />


                    {/* <Route element={<ProtectedRoute />}>
<Route path="/dashboard" element={<Dashboard />} />
<Route path="/create" element={<CreateLink />} />
<Route path="/analytics/:slug" element={<Analytics />} />
</Route> */}
                </Routes>
                <Footer />
            </main>
        </div>
    );
}