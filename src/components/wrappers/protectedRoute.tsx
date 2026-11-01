import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { ProtectedRouteProps } from '../../types/memberTypes';
import { Navigate, Outlet } from 'react-router-dom';

const SUBSCRIPTION_EXEMPT_ROUTES = [
  "/pricing-and-plans",
  "/logout",
  "/profile",
];

interface Permission {
  view: boolean;
  add: boolean;
  edit: boolean;
  delete: boolean;
}

export default function ProtectedRoute({ allowedRoles }: { allowedRoles?: ProtectedRouteProps[] }) {

  const { user, token, loading } = useAuth();

  // console.log(user?.role, "_____Protectedroute wrap_______");
  // console.log(allowedRoles, "<--allowroles ?")

  if (loading) return <div>Loading...</div>;

  // Not logged in - redirect to login
  if (!token || !user) return <Navigate to="/login" replace />;

  const needsSubscription =
    (user.role === "PROPERTY MANAGER" ||
      user.role === "LANDLORD") &&
    !user.is_subscribe;

  const isExemptRoute = SUBSCRIPTION_EXEMPT_ROUTES.includes(
    location.pathname
  );

  if (needsSubscription && !isExemptRoute) {
    return (
      <Navigate
        to="/pricing-and-plans"
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  // Role-restricted route
  if (allowedRoles && !allowedRoles.includes(user.role as any)) {
    // console.log("Why its coming here?", allowedRoles);
    console.log("user?.is_subscribe ::: ", user, user?.is_subscribe);

    // route to pricing page if user has no active subscription


    return <Navigate to="/unauthorized" replace />;
  }

  if (user?.role === 'ADMIN') {
    const permissionsData = localStorage.getItem('permission');
    // console.log(permissionsData, " ?????????????")
    if (!permissionsData) {
      console.warn('No admin permissions found in localStorage');
      return <Navigate to="/unauthorized" replace />;
    }
    let menuItems: any[] = [];
    try {
      menuItems = JSON.parse(permissionsData);
      // console.log(menuItems, "<--nenu items")
    } catch (err) {
      console.error('Failed to parse admin permissions', err);
      return <Navigate to="/unauthorized" replace />;
    }

    const STATIC_PERMISSIONS: Record<string, Permission> = {
      "/profile": { view: true, add: true, edit: true, delete: true },
      "/featured-properties": { view: true, add: true, edit: true, delete: true },
    };

    // Helper: deeply search for matching path and get its permission
    const findPermissionForPath = (
      items: any[],
      targetPath: string
    ): { view?: boolean; add?: boolean; edit?: boolean; delete?: boolean } | null => {

      // console.log(targetPath), "<--------targetPath";
      // console.log(STATIC_PERMISSIONS[targetPath]), "<--------static ,,,,,,,,";
      if (STATIC_PERMISSIONS[targetPath]) {
        return STATIC_PERMISSIONS[targetPath];
      }

      for (const item of items) {
        // console.log(item.to, "_____<>_____", targetPath);
        if (!item.children) {
          // direct match
          if (item.to === targetPath) {
            return item.permission || null;
          }
        } else {
          // nested children
          if (item.children) {
            const found = findPermissionForPath(item.children, targetPath);
            if (found) return found;
          }
        }

      }
      return null;
    };

    const currentPath = location.pathname;
    const perm = findPermissionForPath(menuItems, currentPath);
    // console.log(perm, "<---perm");
    if (!perm) {
      console.warn(`No permission entry found for path: ${currentPath}`);
      return <Navigate to="/unauthorized" replace />;
    }
    const requiredPermission = 'view'
    const hasRequiredAccess = perm[requiredPermission] === true;

    if (!hasRequiredAccess) {
      console.warn(
        `Missing required permission '${requiredPermission}' for ${currentPath}`
      );
      return <Navigate to="/unauthorized" replace />;
    }



  }
  return <Outlet />;
}