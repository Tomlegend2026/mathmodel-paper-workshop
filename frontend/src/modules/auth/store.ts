import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, AuthState } from './types';

interface AuthStore extends AuthState {
  login: (token: string, user: User) => void;
  logout: () => void;
  setUser: (user: User) => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isLoggedIn: false,
      login: (token: string, user: User) => set({ token, user, isLoggedIn: true }),
      logout: () => set({ token: null, user: null, isLoggedIn: false }),
      setUser: (user: User) => set({ user }),
    }),
    {
      name: 'auth-storage',
    }
  )
);

export const getAuthStore = () => useAuthStore.getState();