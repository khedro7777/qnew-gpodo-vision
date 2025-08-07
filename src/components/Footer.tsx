
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">GPODO</h3>
            <p className="text-gray-600">
              Empowering businesses through collaborative purchasing and smart partnerships.
            </p>
          </div>
          
          <div>
            <h4 className="text-md font-semibold text-gray-900 mb-4">Platform</h4>
            <ul className="space-y-2">
              <li><Link to="/dashboard" className="text-gray-600 hover:text-blue-600">Dashboard</Link></li>
              <li><Link to="/client-dashboard" className="text-gray-600 hover:text-blue-600">Client Portal</Link></li>
              <li><Link to="/profile" className="text-gray-600 hover:text-blue-600">Profile</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-md font-semibold text-gray-900 mb-4">Support</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-600 hover:text-blue-600">Help Center</a></li>
              <li><a href="#" className="text-gray-600 hover:text-blue-600">Contact Us</a></li>
              <li><a href="#" className="text-gray-600 hover:text-blue-600">Terms of Service</a></li>
              <li><a href="#" className="text-gray-600 hover:text-blue-600">Privacy Policy</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-md font-semibold text-gray-900 mb-4">Resources</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-600 hover:text-blue-600">About</a></li>
              <li><a href="#" className="text-gray-600 hover:text-blue-600">Blog</a></li>
              <li><a href="#" className="text-gray-600 hover:text-blue-600">Documentation</a></li>
              <li><Link to="/admin/login" className="text-gray-400 hover:text-gray-600 text-sm">APIs</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200 pt-6 mt-8">
          <p className="text-center text-gray-500 text-sm">
            © 2024 GPODO. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
