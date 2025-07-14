"use client";

import { useLoginMutation, useLogoutMutation, useOauthTokenExchangeMutation, useRegisterMutation, useResetPasswordMutation, useSendForgotPasswordEmailMutation, useSendVerificationEmailMutation } from "../queries";

export function useAuth() {
  const loginMutation = useLoginMutation();
  const registerMutation = useRegisterMutation();
  const logoutMutation = useLogoutMutation();
  const resetPasswordMutation = useResetPasswordMutation();
  const sendVerificationEmailMutation = useSendVerificationEmailMutation();
  const sendForgotPasswordEmailMutation = useSendForgotPasswordEmailMutation();
  const oauthExchangeTokenMutation = useOauthTokenExchangeMutation();

  return {
    // Login
    login: loginMutation.mutate,
    loginAsync: loginMutation.mutateAsync,
    isLoginLoading: loginMutation.isPending,
    loginError: loginMutation.error,

    // Register
    register: registerMutation.mutate,
    registerAsync: registerMutation.mutateAsync,
    isRegisterLoading: registerMutation.isPending,
    registerError: registerMutation.error,

    // Logout
    logout: logoutMutation.mutate,
    logoutAsync: logoutMutation.mutateAsync,
    isLogoutLoading: logoutMutation.isPending,
    logoutError: logoutMutation.error,

    // Reset Password
    resetPassword: resetPasswordMutation.mutate,
    resetPasswordAsync: resetPasswordMutation.mutateAsync,
    isResetPasswordLoading: resetPasswordMutation.isPending,
    resetPasswordError: resetPasswordMutation.error,

    // Send Verification Email
    sendVerificationEmail: sendVerificationEmailMutation.mutate,
    sendVerificationEmailAsync: sendVerificationEmailMutation.mutateAsync,
    isSendVerificationEmailLoading: sendVerificationEmailMutation.isPending,
    sendVerificationEmailError: sendVerificationEmailMutation.error,

    // Send Forgot Password Email
    sendForgotPasswordEmail: sendForgotPasswordEmailMutation.mutate,
    sendForgotPasswordEmailAsync: sendForgotPasswordEmailMutation.mutateAsync,
    isSendForgotPasswordEmailLoading: sendForgotPasswordEmailMutation.isPending,
    sendForgotPasswordEmailError: sendForgotPasswordEmailMutation.error,

    // Oauth Exchange Token
    oauthExchangeToken: oauthExchangeTokenMutation.mutate,
    oauthExchangeTokenAsync: oauthExchangeTokenMutation.mutateAsync,
    isOauthExchangeTokenLoading: oauthExchangeTokenMutation.isPending,
    oauthExchangeTokenError: oauthExchangeTokenMutation.error,

    // Reset mutations
    resetLogin: loginMutation.reset,
    resetLogout: logoutMutation.reset,
  };
}
