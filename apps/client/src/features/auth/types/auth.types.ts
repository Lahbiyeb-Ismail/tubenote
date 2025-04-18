import type { ReactNode } from "react";

import type { ILoginDto, IRegisterDto } from "@tubenote/dtos";

export type AuthState = {
  accessToken: string | null;
  errorMessage?: string;
  successMessage?: string;
  isAuthenticated: boolean;
};

export type AuthAction =
  | {
      type: "LOGIN_SUCCESS";
      payload: { message: string; accessToken: string };
    }
  | { type: "REGISTER_SUCCESS"; payload: { successMessage: string } }
  | { type: "REQUEST_FAIL"; payload: { errorMessage: string } }
  | { type: "LOGOUT_SUCCESS" };

export type AuthContextType = {
  state: AuthState;
  login: (loginDto: ILoginDto) => void;
  register: (registerDto: IRegisterDto) => void;
  logout: () => void;
  isLoading: boolean;
};

export type AuthProviderProps = {
  children: ReactNode;
};
