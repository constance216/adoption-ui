import React, { createContext, useContext, useState, useEffect } from 'react';
import type { AuthResponse } from '../../types';
import { authService } from '../../services/authService';

interface AuthContextType {
  user: AuthResponse | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: { username: string; password: string }) => Promise<void>;
  register: (userData: { username: string; email: string; password: string; fullName: string; role?: string }) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AuthResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        if (authService.isAuthenticated()) {
          const currentUser = authService.getCurrentUser();
          if (currentUser) {
            setUser(currentUser);
          }
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        authService.logout();
        authService.clearCurrentUser();
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const login = async (credentials: { username: string; password: string }) => {
    try {
      const response = await authService.login(credentials);
      setUser(response);
      authService.setCurrentUser(response);
    } catch (error) {
      throw error;
    }
  };

  const register = async (userData: { username: string; email: string; password: string; fullName: string; role?: string }) => {
    try {
      await authService.register(userData);
      // After successful registration, you might want to auto-login
      // or redirect to login page
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    authService.logout();
    authService.clearCurrentUser();
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};