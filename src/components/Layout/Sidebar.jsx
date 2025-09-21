// filepath: admin-spa-management/src/components/layout/Sidebar.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';

/**
 * Sidebar Component
 * Navigation menu for the application
 */
const Sidebar = ({ menuItems }) => {
  return (
    <aside className="w-64 bg-white shadow-sm border-r border-gray-200">
      <div className="flex flex-col h-full">
        {/* Logo/Brand */}
        <div className="flex items-center justify-center h-16 px-4 bg-primary-600">
          <h2 className="text-white text-lg font-semibold">
            SPA Management
          </h2>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6">
          <ul className="space-y-2">
            {menuItems?.map((item) => (
              <li key={item.id}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                      isActive
                        ? 'bg-primary-100 text-primary-700'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }`
                  }
                >
                  <i className={`${item.iconClass} mr-3`} />
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            © 2025 SPA Management System
          </p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
