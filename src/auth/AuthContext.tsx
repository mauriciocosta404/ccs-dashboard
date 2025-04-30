import { createContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { User } from '../types/User';
import { getUser, getToken, logout as destroySession } from './authService';

interface AuthContextProps {
  user: User | null;
  isAuthenticated: boolean;
  loginUser: (user: User) => void;
  logout: () => Promise<void>; // Alterado para Promise
}

export const AuthContext = createContext<AuthContextProps>({} as AuthContextProps);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Carrega o estado inicial
  useEffect(() => {
    const token = getToken();
    const userData = getUser();
    
    if (token && userData) {
      setUser(userData);
      setIsAuthenticated(true);
    }
  }, []);

  const loginUser = (userData: User) => {
    setUser(userData);
    setIsAuthenticated(true);
  };

  const logout = useCallback(async () => {
    destroySession();
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  // Sincroniza entre abas
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'accessToken' || e.key === 'user') {
        const token = getToken();
        const userData = getUser();
        
        if (token && userData) {
          setUser(userData);
          setIsAuthenticated(true);
        } else {
          logout();
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [logout]);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, loginUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}