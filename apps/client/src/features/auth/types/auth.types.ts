import type { ReactNode } from "react";

import type { UseMutationResult, UseQueryResult } from "@tanstack/react-query";
import type { ILoginDto, IRegisterDto } from "@tubenote/dtos";
import type { IApiSuccessResponse, User } from "@tubenote/types";

export type AuthState = {
  isAuthenticated: boolean;
  errorMessage?: string;
  successMessage?: string;
};

export type LoginMutationResult = UseMutationResult<
  IApiSuccessResponse<string>,
  Error,
  ILoginDto,
  void
>;

export type RegisterMutationResult = UseMutationResult<
  IApiSuccessResponse<string>,
  Error,
  IRegisterDto,
  void
>;

export type LogoutMutationResult = UseMutationResult<
  IApiSuccessResponse<null>,
  Error,
  void,
  void
>;

export type ResetPasswordMutationResult = UseMutationResult<
  IApiSuccessResponse<null>,
  Error,
  {
    token: string;
    password: string;
  },
  void
>;

export type SendForgotPasswordEmailMutationResult = UseMutationResult<
  IApiSuccessResponse<null>,
  Error,
  string,
  void
>;

export type SendVerificationEmailMutationResult = UseMutationResult<
  IApiSuccessResponse<null>,
  Error,
  string,
  void
>;

export type ExchangeOauthCodeMutationResult = UseMutationResult<
  IApiSuccessResponse<string>,
  Error,
  string,
  void
>;

export type AuthAction =
  | {
      type: "SET_SUCCESS_LOGIN";
      payload: { isAuthenticated: boolean; message: string };
    }
  | { type: "SET_SUCCESS_REGISTER"; payload: { message: string } }
  | { type: "SET_SUCCESS_LOGOUT"; payload: { message: string } }
  | { type: "SET_SUCCESS_RESET_PASSWORD"; payload: { message: string } }
  | { type: "SET_SUCCESS_FORGOT_EMAIL_SENT"; payload: { message: string } }
  | {
      type: "SET_SUCCESS_VERIFICATION_EMAIL_SENT";
      payload: { message: string };
    }
  | { type: "SET_AUTH_ERROR"; payload: { message: string } };

export type AuthContextType = {
  authState: AuthState;
  currentUserQueryResult: UseQueryResult<User, Error>;
  loginMutationResult: LoginMutationResult;
  registerMutationResult: RegisterMutationResult;
  logoutMutationResult: LogoutMutationResult;
  resetPasswordMutationResult: ResetPasswordMutationResult;
  sendForgotPasswordEmailMutationResult: SendForgotPasswordEmailMutationResult;
  sendVerificationEmailMutationResult: SendVerificationEmailMutationResult;
  exchangeOauthCodeMutationResult: ExchangeOauthCodeMutationResult;
};

export type AuthProviderProps = {
  children: ReactNode;
};
