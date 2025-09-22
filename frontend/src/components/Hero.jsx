import React from 'react';

const Hero = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 text-center">
      <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
        Secure, Expirable Links for <span className="text-indigo-600">Modern Businesses</span>
      </h1>
      <p className="mt-4 max-w-3xl mx-auto text-xl text-gray-600">
        Generate short, password-protected, and trackable URLs with advanced analytics. Share sensitive information with confidence.
      </p>
      <div className="mt-10 flex justify-center">
        <div className="rounded-md shadow">
          <a href="#" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10">
            Get Started Free
          </a>
        </div>
        <div className="ml-3 rounded-md shadow">
          <a href="#" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10">
            Live Demo
          </a>
        </div>
      </div>
    </div>
  );
};

export default Hero;