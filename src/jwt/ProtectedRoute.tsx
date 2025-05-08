import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import isTokenExpired from './authUtils'; // Assuming you have a separate authUtils file

interface ProtectedRouteProps {
  children: React.ReactNode;
}

function ProtectedRoute({ children }: ProtectedRouteProps) {
  const navigate = useNavigate();
  const token = localStorage.getItem('jwtToken');

  useEffect(() => {
    if (!token || isTokenExpired(token)) {
      localStorage.clear();
      navigate('/'); 
    }
  }, [token, navigate]);

  return token && !isTokenExpired(token) ? <>{children}</> : null;
}

export default ProtectedRoute;