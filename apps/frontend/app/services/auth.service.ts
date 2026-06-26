import { api } from './api';
import type { AuthResponse } from '@journey-map/types';

export const authService = {
  signUp: (email: string, password: string, name: string) =>
    api.post<AuthResponse>('/auth/signup', { email, password, name }),

  signIn: (email: string, password: string) =>
    api.post<AuthResponse>('/auth/signin', { email, password }),

  logout: () => api.post<{ message: string }>('/auth/logout', {}),
};
