// RequireAuth Route Protection
// Import and wrap any route you want to protect in App.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * RequireAuth component protects routes from unauthenticated access.
 * Wrap any protected route's element with <RequireAuth>...</RequireAuth>
 */
const RequireAuth = ({ children }) => {
  const { user } = useAuth();

  if (!user) {
    // Not authenticated, redirect to login
    return <Navigate to="/login" replace />;
  }

  // Authenticated, render children
  return children;
};

export default RequireAuth;