import { create } from "zustand";
import { persist } from "zustand/middleware";
import { authService } from "../services/api.service";

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,

      login: async (email, password) => {
        const { data } = await authService.login({ email, password });
        const { user, accessToken } = data.data;
        localStorage.setItem("accessToken", accessToken);
        set({ user, accessToken, isAuthenticated: true });
        return user;
      },

      register: async (name, email, password) => {
        const { data } = await authService.register({ name, email, password });
        const { user, accessToken } = data.data;
        localStorage.setItem("accessToken", accessToken);
        set({ user, accessToken, isAuthenticated: true });
        return user;
      },

      logout: async () => {
        try { await authService.logout(); } catch {}
        localStorage.removeItem("accessToken");
        set({ user: null, accessToken: null, isAuthenticated: false });
      },

      setToken: (token) => {
        localStorage.setItem("accessToken", token);
        set({ accessToken: token });
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
);
