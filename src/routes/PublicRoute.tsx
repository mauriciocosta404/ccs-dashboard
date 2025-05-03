import { Navigate } from 'react-router-dom';
import useAuth from '../auth/useAuth';
import { ReactNode } from 'react';

export default function PublicRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Navigate to="/dashboard" /> : children;
}
