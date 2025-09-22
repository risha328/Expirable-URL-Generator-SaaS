import React from 'react';
//import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import DashboardComponent from '../components/DashboardComponent';
import URLCreationComponent from '../components/URLCreationComponent';
import AnalyticsComponent from '../components/AnalyticsComponent';
import CTASection from '../components/CTASection';
//import Footer from '../components/Footer';

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* <Navbar /> */}
      <Hero />
      <DashboardComponent />
      <URLCreationComponent />
      <AnalyticsComponent />
      <CTASection />
      {/* <Footer /> */}
    </div>
  );
};

export default Home;