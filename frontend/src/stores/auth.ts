import { defineStore } from 'pinia';
import authService from '../services/auth.service';
import type { LoginData, RegisterData, AuthResponse } from '../services/auth.service';

interface AuthState {
  user: AuthResponse | null;
  loading: boolean;
  error: string | null;
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: authService.getCurrentUser(),
    loading: false,
    error: null
  }),

  getters: {
    isAuthenticated: (state) => !!state.user,
    currentUser: (state) => state.user?.user
  },

  actions: {
    async login(credentials: LoginData) {
      this.loading = true;
      this.error = null;
      try {
        const response = await authService.login(credentials);
        this.user = response;
        return response;
      } catch (error: any) {
        this.error = error.response?.data?.message || 'An error occurred during login';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async register(userData: RegisterData) {
      this.loading = true;
      this.error = null;
      try {
        const response = await authService.register(userData);
        this.user = response;
        return response;
      } catch (error: any) {
        this.error = error.response?.data?.message || 'An error occurred during registration';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    logout() {
      authService.logout();
      this.user = null;
    }
  }
}); 