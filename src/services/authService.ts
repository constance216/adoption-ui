import { apiClient, setToken, removeToken } from './api';
import type { AuthResponse, LoginRequest, RegisterRequest } from '../types';

export const authService = {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/signin', credentials);
    // Don't set the token yet as we need 2FA verification
    return response;
  },

  async verify2FA(code: string, tempToken: string): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/verify-2fa', {
      code,
      token: tempToken
    });
    // Set the final token after 2FA verification
    setToken(response.token);
    return response;
  },

  async requestPasswordReset(email: string): Promise<{ message: string }> {
    return apiClient.post('/auth/forgot-password', { email });
  },

  async resetPassword(token: string, password: string, confirmPassword: string): Promise<{ message: string }> {
    return apiClient.post('/auth/reset-password', { token, password, confirmPassword });
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