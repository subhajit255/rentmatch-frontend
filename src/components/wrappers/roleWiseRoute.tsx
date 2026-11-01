import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface AdminProtectedRouteProps {
  requiredPermission?: 'view' | 'add' | 'edit' | 'delete';
}

export default function AdminProtectedRoute({
  requiredPermission = 'view',
}: AdminProtectedRouteProps) {
  const { user, token, loading } = useAuth();
  const location = useLocation();
  // console.log("_____Rolewise wrap_______")

  if (loading) {
    return <div>Loading...</div>;
  }

  // Not authenticated at all
  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  // Only allow SUPER ADMIN (or ADMIN) users to even attempt this wrapper
  // Adjust roles as per your system
  const isAdminUser = user.role === 'ADMIN';
  if (!isAdminUser) {
    return <Navigate to="/unauthorized" replace />;
  }

  // ───────────────────────────────────────────────
  //   Permission check from localStorage
  // ───────────────────────────────────────────────
  const permissionsData = localStorage.getItem('admin_permissions'); // ← change key if different

  if (!permissionsData) {
    console.warn('No admin permissions found in localStorage');
    return <Navigate to="/unauthorized" replace />;
  }

  let menuItems: any[] = [];
  try {
    menuItems = JSON.parse(permissionsData);
  } catch (err) {
    console.error('Failed to parse admin permissions', err);
    return <Navigate to="/unauthorized" replace />;
  }

  // Helper: deeply search for matching path and get its permission
  const findPermissionForPath = (
    items: any[],
    targetPath: string
  ): { view?: boolean; add?: boolean; edit?: boolean; delete?: boolean } | null => {
    for (const item of items) {
      console.log(item.to, "_____<>_____", targetPath)
      // direct match
      if (item.to === targetPath) {
        return item.permission || null;
      }
      // nested children
      if (item.children) {
        const found = findPermissionForPath(item.children, targetPath);
        if (found) return found;
      }
    }
    return null;
  };

  const currentPath = location.pathname;

  const perm = findPermissionForPath(menuItems, currentPath);

  if (!perm) {
    console.warn(`No permission entry found for path: ${currentPath}`);
    return <Navigate to="/unauthorized" replace />;
  }

  const hasRequiredAccess = perm[requiredPermission] === true;

  if (!hasRequiredAccess) {
    console.warn(
      `Missing required permission '${requiredPermission}' for ${currentPath}`
    );
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
}