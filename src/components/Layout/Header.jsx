// filepath: admin-spa-management/src/components/layout/Header.jsx
import React from 'react';

/**
 * Header Component
 * Displays user information and logout functionality
 */
const Header = ({ user, onLogout }) => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-semibold text-gray-900">
            Admin Dashboard
          </h1>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
              <span className="text-white font-medium">
                {user?.fullName?.charAt(0) || 'U'}
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">
                {user?.fullName || 'User'}
              </p>
              <p className="text-xs text-gray-500">
                {user?.role || 'User'}
              </p>
            </div>
          </div>

          <button
            onClick={onLogout}
            className="px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
