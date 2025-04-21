import { createContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types/User';
import { getUser, getToken, logout as destroySession } from './authService';

interface AuthContextProps {
  user: User | null;
  isAuthenticated: boolean;
  loginUser: (user: User) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextProps>({} as AuthContextProps);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(getUser());
  const isAuthenticated = !!getToken();

  const loginUser = (userData: User) => setUser(userData);
  const logout = () => {
    destroySession();
    setUser(null);
  };

  useEffect(() => {
    setUser(getUser());
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, loginUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
