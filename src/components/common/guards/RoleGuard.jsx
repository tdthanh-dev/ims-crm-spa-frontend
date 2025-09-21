// filepath: admin-spa-management/src/components/guards/RoleGuard.jsx

import React from 'react';
import { Navigate } from 'react-router-dom';
import { hasAccess, getRoleDefaultPath } from '@/utils/roleRouting';

/**
 * Role Guard - Checks if user has access to specific routes based on their role
 * Redirects to 403 page or role default path if access denied
 */
const RoleGuard = ({ children, requiredRoles = [], userRole, currentPath }) => {
  // If no specific roles required, allow access
  if (requiredRoles.length === 0) {
    return children;
  }
  
  // Check if user role is in required roles
  const hasRoleAccess = requiredRoles.includes(userRole);
  
  // Check if user has path-based access
  const hasPathAccess = hasAccess(userRole, currentPath);
  
  if (!hasRoleAccess || !hasPathAccess) {
    console.warn(`Access denied for role ${userRole} to path ${currentPath}`);
    
    // Redirect to role default path or 403 page
    const defaultPath = getRoleDefaultPath(userRole);
    return <Navigate to={defaultPath || '/403'} replace />;
  }
  
  return children;
};

/**
 * Simple 403 Forbidden Page
 */
export const ForbiddenPage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-[60vh] text-center p-5">
      <div className="text-6xl md:text-7xl mb-5">
        🚫
      </div>
      <h1 className="text-error-600 mb-4 text-2xl font-bold">
        Truy cập bị từ chối
      </h1>
      <p className="text-black-600 mb-6 text-base">
        Bạn không có quyền truy cập vào trang này.
      </p>
      <button 
        onClick={() => window.history.back()} 
        className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white border-0 rounded-lg cursor-pointer text-sm font-medium transition-colors duration-200"
      >
        ← Quay lại
      </button>
    </div>
  );
};

export default RoleGuard;
