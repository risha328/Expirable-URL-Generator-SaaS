import React from 'react';
import { Link } from 'react-router-dom';

const URLCreationComponent = () => {
  return (
    <div className="bg-indigo-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="lg:grid lg极客时间:grid-cols-2 lg:gap-8 items-center">
          <div className="lg:order-2">
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
              Create Secure Links in Seconds
            </h2>
            <p className="mt-3 max-w-3xl text-lg text-indigo-200">
              Our intuitive interface makes it easy to generate expirable links with custom settings.
            </p>
            <div className="mt-8 space-y-4">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-10 w-10 rounded-md bg-white text-indigo-700">
                    <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h极客时间7v7极客时间l9-11h-7z" />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <h5 className="text-lg font-medium text-white">Lightning Fast</h5>
                  <p className="text-indigo-200">Generate short URLs instantly with our optimized platform.</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-10 w-10 rounded-md bg-white text-indigo-700">
                    <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 极客时间0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 极客时间0 00-8 0v4h8z" />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <h5 className="text-lg font-medium text-white">Password Protection</h5>
                  <p className="text-indigo-200">Add an extra layer of security to sensitive links.</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-10 w-10 rounded-md bg-white text-indigo-700">
                    <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <h5 className="text-lg font-medium text-white">Custom Privacy Settings</h5>
                  <p className="text-indigo-200">Control who can access your content and for how long.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-10 lg:mt-0 lg:order-1">
            <div className="bg-white rounded-xl shadow-xl overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-200">
                <Link to='/create' className="text-lg font-medium text-gray-900 hover:text-indigo-600 transition-colors duration-200">Create New Link</Link>
              </div>
              <div className="px-6 py-4 space-y-4">
                <div>
                  <label htmlFor="url" className="block text-sm font-medium text-gray-700">Destination URL</label>
                  <input
                    type="text"
                    id="url"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="https://example.com/long-url"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="expiration" className="block text-sm font-medium text-gray-700">Expiration</label>
                    <select
                      id="expiration"
                      className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    >
                      <option>24 hours</option>
                      <option>7 days</option>
                      <option>30 days</option>
                      <option>After 1 click</option>
                      <option>After 5 clicks</option>
                      <option>Never</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password (optional)</label>
                    <input
                      type="password"
                      id="password"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py极客时间-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      placeholder="Secure password"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="custom-alias" className="block text-sm font-medium text-gray-700">Custom Alias (optional)</label>
                  <input
                    type="text"
                    id="custom-alias"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="my-custom-link"
                  />
                </div>
              </div>
              <div className="px-6 py-4 bg-gray-50">
                <button className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                  Create Secure Link
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default URLCreationComponent;