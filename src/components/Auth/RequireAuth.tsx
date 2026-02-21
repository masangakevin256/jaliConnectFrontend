import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

interface RequireAuthProps {
  allowedRoles?: string[];
}

export const RequireAuth: React.FC<RequireAuthProps> = ({ allowedRoles }) => {
  const { isAuthenticated, userRole } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login/user" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(userRole as string)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};
