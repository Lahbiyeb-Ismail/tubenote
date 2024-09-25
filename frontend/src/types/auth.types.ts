import type { ReactNode } from 'react';

import type {  RegisterFormData, LoginFormData } from '@/lib/schemas';

export type AuthState = {
  accessToken: string | null;
  errorMessage?: string;
  successMessage?: string;
  isAuthenticated: boolean;
};

export type AuthAction =
  | { type: 'LOGIN_SUCCESS'; payload: { accessToken: string } }
  | { type: 'REGISTER_SUCCESS'; payload: { successMessage: string } }
  | { type: 'REQUEST_FAIL'; payload: { errorMessage: string } }
  | { type: 'LOGOUT' };

export type AuthContextType = {
  state: AuthState;
  login: (loginCredentials: LoginFormData) => void
  register: (registerCredentials: RegisterFormData) => void;
  isLoading: boolean;
};

export type AuthProviderProps = {
  children: ReactNode;
};
