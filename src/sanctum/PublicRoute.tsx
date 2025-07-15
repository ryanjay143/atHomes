import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface PublicRouteProps {
  children: React.ReactNode;
}

function PublicRoute({ children }: PublicRouteProps) {
  const navigate = useNavigate();
  const token = localStorage.getItem('access_token');
  const role = localStorage.getItem('role'); // Assuming role is stored as a string in localStorage

  useEffect(() => {
    if (token) {
      if (role === '0') {
        navigate('/admin/user-dashboard');
      } else if (role === '1') {
        navigate('/agent-broker'); 
      }  else if (role === '2') {
        navigate('/broker'); 
      }
    }
  }, [token, role, navigate]);

  return !token ? <>{children}</> : null;
}

export default PublicRoute;