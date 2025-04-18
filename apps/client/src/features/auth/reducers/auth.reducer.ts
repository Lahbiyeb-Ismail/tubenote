import type { AuthAction, AuthState } from "../types";

export function useAuthReducer() {
  const authInitialState: AuthState = {
    isAuthenticated: false,
    errorMessage: "",
    successMessage: "",
  };

  function authReducer(state: AuthState, action: AuthAction): AuthState {
    switch (action.type) {
      case "SET_SUCCESS_LOGIN":
        return {
          ...state,
          isAuthenticated: action.payload.isAuthenticated,
          successMessage: action.payload.message,
        };
      case "SET_SUCCESS_REGISTER":
        return {
          ...state,
          successMessage: action.payload.message,
        };
      case "SET_SUCCESS_LOGOUT":
        return {
          ...state,
          successMessage: action.payload.message,
        };
      case "SET_SUCCESS_RESET_PASSWORD":
        return {
          ...state,
          successMessage: action.payload.message,
        };
      case "SET_AUTH_ERROR":
        return {
          ...state,
          errorMessage: action.payload.message,
        };
      default:
        return state;
    }
  }

  return { authInitialState, authReducer };
}
