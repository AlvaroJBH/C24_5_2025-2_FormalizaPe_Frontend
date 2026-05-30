import { create } from "zustand";
import { persist } from "zustand/middleware";
import { UserProfile, getCurrentUser } from "@/services/auth-service";

interface AuthState {
  token: string | null;
  user: UserProfile | null;
  hydrated: boolean;
  setToken: (token: string) => void;
  setUser: (user: UserProfile) => void;
  setHydrated: (hydrated: boolean) => void;
  clearAuth: () => void;
  refreshUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      hydrated: false,
      setToken: (token) => set({ token }),
      setUser: (user) => set({ user }),
      setHydrated: (hydrated) => set({ hydrated }),
      clearAuth: () => set({ token: null, user: null }),
      refreshUser: async () => {
        const token = get().token;
        if (!token) return;
        const updated = await getCurrentUser(token);
        set({ user: updated });
      },
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