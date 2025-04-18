import type { ReactNode } from "react";

import type { ILoginDto, IRegisterDto } from "@tubenote/dtos";

export type AuthState = {
  isAuthenticated: boolean;
  errorMessage?: string;
  successMessage?: string;
};

export type AuthAction =
  | {
      type: "SET_SUCCESS_LOGIN";
      payload: { isAuthenticated: boolean; message: string };
    }
  | { type: "SET_SUCCESS_REGISTER"; payload: { message: string } }
  | { type: "SET_SUCCESS_LOGOUT"; payload: { message: string } }
  | { type: "SET_SUCCESS_RESET_PASSWORD"; payload: { message: string } }
  | { type: "SET_AUTH_ERROR"; payload: { message: string } };

export type AuthContextType = {
  authState: AuthState;
  login: (loginDto: ILoginDto) => void;
  register: (registerDto: IRegisterDto) => void;
  logout: () => void;
  resetPassword: ({
    token,
    password,
  }: { token: string; password: string }) => void;
  isLoginPending: boolean;
  isRegistrationPending: boolean;
  isLogoutPending: boolean;
  isResetPasswordPending: boolean;
};

export type AuthProviderProps = {
  children: ReactNode;
};
