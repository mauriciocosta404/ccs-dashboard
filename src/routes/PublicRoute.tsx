import { Navigate } from 'react-router-dom';
import useAuth from '../auth/useAuth';

export default function PublicRoute({ children }: { children: JSX.Element }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Navigate to="/" /> : children;
}
