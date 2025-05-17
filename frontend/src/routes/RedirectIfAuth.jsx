import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../provider/AuthProvider';

const RedirectIfAuth = () => {
  const { token } = useAuth();

  return token ? <Navigate to="/home" /> : <Outlet />;
};

export default RedirectIfAuth;
