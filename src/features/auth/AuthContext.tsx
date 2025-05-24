import React, { createContext, useContext, useState, useEffect } from 'react';
import type { AuthResponse } from '../../types';
import { authService } from '../../services/authService';

interface AuthContextType {
  user: AuthResponse | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: { username: string; password: string }) => Promise<AuthResponse>;
  verify2FA: (code: string, tempToken: string) => Promise<void>;
  requestPasswordReset: (email: string) => Promise<void>;
  resetPassword: (token: string, password: string, confirmPassword: string) => Promise<void>;
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
    const response = await authService.login(credentials);
    // Don't set user yet if 2FA is required
    if (!response.requires2FA) {
      setUser(response);
      authService.setCurrentUser(response);
    }
    return response;
  };

  const verify2FA = async (code: string, tempToken: string) => {
    const response = await authService.verify2FA(code, tempToken);
    setUser(response);
    authService.setCurrentUser(response);
  };

  const requestPasswordReset = async (email: string) => {
    await authService.requestPasswordReset(email);
  };

  const resetPassword = async (token: string, password: string, confirmPassword: string) => {
    await authService.resetPassword(token, password, confirmPassword);
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
    verify2FA,
    requestPasswordReset,
    resetPassword,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};