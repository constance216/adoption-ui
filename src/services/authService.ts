import { apiClient, setToken, removeToken } from './api';
import type { AuthResponse, LoginRequest, RegisterRequest } from '../types';

export const authService = {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/signin', credentials);
    setToken(response.token);
    return response;
  },

  async register(userData: RegisterRequest): Promise<{ message: string }> {
    return apiClient.post('/auth/signup', userData);
  },

  async validateToken(): Promise<{ message: string }> {
    return apiClient.get('/auth/validate');
  },

  logout(): void {
    removeToken();
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  },

  getCurrentUser(): AuthResponse | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  setCurrentUser(user: AuthResponse): void {
    localStorage.setItem('user', JSON.stringify(user));
  },

  clearCurrentUser(): void {
    localStorage.removeItem('user');
  }
};