import { create } from "zustand";

interface AuthStoreState {
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

}

interface AuthStoreActions {
  setAuthStatus: (isAuthenticated: boolean) => void;
  setError: (error: string) => void;
  clearError: () => void;
}

interface AuthStore extends AuthStoreState {
  authActions: AuthStoreActions;
}

export const useAuthStore = create<AuthStore>()(
  set => ({
    isAuthenticated: false,
    isLoading: false,
    error: null,

    authActions: {
      setAuthStatus: (isAuthenticated: boolean) => {
        set({
          isAuthenticated,
          isLoading: false,
          error: null,
        });
      },

      setError: (error: string) => {
        set({ isAuthenticated: false, isLoading: false, error });
      },

      clearError: () => {
        set({ error: null });
      },
    },
  }),
);
