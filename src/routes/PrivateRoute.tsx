import { Navigate } from 'react-router-dom';
import useAuth from '../auth/useAuth';
import { ReactNode } from 'react';

export default function PrivateRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  console.log('isAuthenticated', isAuthenticated);
  return isAuthenticated ? children : <Navigate to="/dashboard" replace />;
}
