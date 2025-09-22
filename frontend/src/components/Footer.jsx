import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-white">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <div className="xl:col-span-1">
            <div className="flex items-center">
              <span className="text-indigo-600 font-bold text-2xl">Expireo</span>
            </div>
            <p className="mt-4 text-base text-gray-500">
              Secure, expirable links for modern businesses and individuals.
            </p>
          </div>
          <div className="mt-12 grid grid-cols-2 gap-8 xl:mt-0 x极客时间l:col-span-2">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold text-gray-600 tracking-wider uppercase">Product</h3>
                <ul className="mt-4 space-y-4">
                  <li><a href="#" className="text-base text-gray-500 hover:text-gray-900">Features</a></li>
                  <li><a href="#" className="text-base text-gray-500 hover:text-gray-900">Pricing</a></li>
                  <li><a href="#" className="text-base text-gray-500 hover:text-gray-900">API</a></li>
                  <li><a href="#" className="text-base text-gray-500 hover:text-gray-900">Integrations</a></li>
                </ul>
              </div>
              <div className="mt-12 md:mt-0">
                <h3 className="text-sm font-semibold text-gray-600 tracking-wider uppercase">Resources</h3>
                <ul className="mt-4 space-y-4">
                  <li><a href="#" className="text-base text-gray-500 hover:text-gray-900">Documentation</a></li>
                  <li><a href="#" className="text-base text-gray-500 hover:text-gray-900">Guides</a></li>
                  <li><a href="#" className="text-base text-gray-500 hover:text-gray-900">Blog</a></li>
                  <li><a href="#" className="text-base text-gray-500 hover:text-gray-900">Support</a></li>
                </ul>
              </div>
            </div>
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold text-gray-600 tracking-wider uppercase">Company</h3>
                <ul className="mt-4 space-y-4">
                  <li><a href="#" className="text-base text-gray-500 hover:text-gray-900">About</a></li>
                  <li><a href="#" className="text-base text-gray-500 hover:text-gray-900">Careers</a></li>
                  <li><a href="#" className="text-base text-gray-500 hover:text-gray-900">Contact</a></li>
                  <li><a href="#" className="text-base text-gray-500 hover:text-gray-900">Partners</a></li>
                </ul>
              </div>
              <div className="mt-12 md:mt-0">
                <h3 className="text-sm font-semibold text-gray-600 tracking-wider uppercase">Legal</h3>
                <ul className="mt-4 space-y-4">
                  <li><a href="#" className="text-base text-gray-500 hover:text-gray-900">Privacy</a></li>
                  <li><a href="#" className="text-base text-gray-500 hover:text-gray-900">Terms</a></li>
                  <li><a href="#" className="text-base text-gray-500 hover:text-gray-900">Security</a></li>
                  <li><a href="#" className="text-base text-gray-500 hover:text-gray-900">Compliance</a></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-12 border-t border-gray-200 pt-8">
          <p className="text-base text-gray-500 text-center">
            &copy; 2023 Expireo. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;