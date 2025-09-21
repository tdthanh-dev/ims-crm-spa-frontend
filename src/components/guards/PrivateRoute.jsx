// filepath: admin-spa-management/src/components/guards/PrivateRoute.jsx

import React from 'react';
import { Navigate } from 'react-router-dom';
import { isAuthenticated } from '@/utils/auth';

/**
 * Private Route Guard - Requires user to be authenticated
 * Redirects to login page if not authenticated
 */
const PrivateRoute = ({ children }) => {
  const authenticated = isAuthenticated();
  
  if (!authenticated) {
    console.log('User not authenticated, redirecting to login');
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

export default PrivateRoute;
