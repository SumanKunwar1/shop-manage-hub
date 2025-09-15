import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuthUser } from '@/types';
import { authApi } from '@/lib/api';

interface AuthState {
  user: AuthUser | null;
  isLoading: boolean;
  
  // Actions
  login: (email: string, password: string) => Promise<void>;
  signup: (userData: any) => Promise<void>;
  logout: () => void;
  
  // Computed
  isAuthenticated: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isLoading: false,
      
      login: async (email: string, password: string) => {
        set({ isLoading: true });
        
        try {
          const response = await authApi.login(email, password);
          const user = response.data;
          
          // Store token in sessionStorage
          sessionStorage.setItem('auth-token', user.token);
          
          set({ user, isLoading: false });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },
      
      signup: async (userData: any) => {
        set({ isLoading: true });
        
        try {
          const response = await authApi.signup(userData);
          const user = response.data;
          
          // Store token in sessionStorage
          sessionStorage.setItem('auth-token', user.token);
          
          set({ user, isLoading: false });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },
      
      logout: () => {
        sessionStorage.removeItem('auth-token');
        sessionStorage.removeItem('auth-user');
        set({ user: null });
      },
      
      isAuthenticated: () => {
        return get().user !== null;
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user }),
    }
  )
);