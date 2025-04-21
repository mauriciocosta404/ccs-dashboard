import { Navigate } from 'react-router-dom';
import useAuth from '../auth/useAuth';

export default function PrivateRoute({ children }: { children: JSX.Element }) {
  const { isAuthenticated } = useAuth();
  console.log('isAuthenticated', isAuthenticated);
  return isAuthenticated ? children : <Navigate to="/signin" replace />;
}
