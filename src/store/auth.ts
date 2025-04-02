import { create } from "zustand";
import { User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { persist } from "zustand/middleware";

interface AuthState {
  user: User | null;
  accessToken?: string | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  initialize: () => () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      loading: true,
      accessToken: null,
      setUser: (user) => set({ user }),
      setLoading: (loading) => set({ loading }),
      initialize: () => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
          const accessToken = user ? await user.getIdToken() : null;
          set({ user, loading: false, accessToken });
        });
        return unsubscribe;
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({ user: state.user }),
    },
  ),
);
