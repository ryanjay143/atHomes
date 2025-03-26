import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface PublicRouteProps {
  children: React.ReactNode;
}

function PublicRoute({ children }: PublicRouteProps) {
  const navigate = useNavigate();
  const token = localStorage.getItem('jwtToken');
  const role = localStorage.getItem('role'); // Assuming role is stored as a string in localStorage

  useEffect(() => {
    if (token) {
      if (role === '0') {
        navigate('/athomes/admin/user-dashboard'); // Redirect for admin
      } else if (role === '1') {
        navigate('/athomes/agent-broker'); // Redirect for agent-broker
      }
    }
  }, [token, role, navigate]);

  return !token ? <>{children}</> : null;
}

export default PublicRoute;