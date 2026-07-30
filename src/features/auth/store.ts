import type { AuthActions, AuthState } from "@/features/auth/types";
import { create } from 'zustand';
import { createJSONStorage, devtools, persist } from "zustand/middleware";


export const useAuthStore = create<AuthState & AuthActions>()(
  devtools(
    persist(
      (set) => ({
        //Initial state
        accessToken: null,
        role: null,

        //Actions
        setAuth: (access, role) =>
          set({ accessToken: access, role: role }),

        clearAuth: () => set({ accessToken: null, role: null }),
      }),
      {
        name: "auth-storage",
        storage: createJSONStorage(() => localStorage),
      }
    ),
  ),
);