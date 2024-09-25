import type {  RegisterFormData } from '@/lib/schemas';
import type { ReactNode } from 'react';

export type AuthState = {
  accessToken: string | null;
  errorMessage?: string;
  successMessage?: string;
  isAuthenticated: boolean;
};

export type AuthAction =
  | { type: 'REGISTER_SUCCESS'; payload: { successMessage: string } }
  | { type: 'REQUEST_FAIL'; payload: { errorMessage: string } }
  | { type: 'LOGOUT' };

export type AuthContextType = {
  state: AuthState;
  register: (registerCredentials: RegisterFormData) => void;
  isLoading: boolean;
};

export type AuthProviderProps = {
  children: ReactNode;
};
