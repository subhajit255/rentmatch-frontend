import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

export default function UnProtectedRoute() {
  const isAuthenticated = localStorage.getItem('auth_token');
  return isAuthenticated ? <Navigate to="/dashboard" /> : <Outlet />;
}