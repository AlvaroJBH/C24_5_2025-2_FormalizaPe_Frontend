import { create } from "zustand";
import { persist } from "zustand/middleware";
import { UserProfile } from "@/services/auth-service";

interface AuthState {
  token: string | null;
  user: UserProfile | null;
  hydrated: boolean;
  setToken: (token: string) => void;
  setUser: (user: UserProfile) => void;
  setHydrated: (hydrated: boolean) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      hydrated: false,
      setToken: (token) => set({ token }),
      setUser: (user) => set({ user }),
      setHydrated: (hydrated) => set({ hydrated }),
      clearAuth: () => set({ token: null, user: null }),
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        token: state.token,
        user: state.user,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    }
  )
);