import React from 'react';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  element: JSX.Element;
  allowedRoles: string[]; // Array of roles allowed to access the route
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element, allowedRoles }) => {
  const token = localStorage.getItem('access_token');
  const role = localStorage.getItem('role');

  if (!token || !allowedRoles.includes(role || '')) {
    return <Navigate to="/athomes/user-login" />; 
  }

  return element;
};

export default ProtectedRoute;