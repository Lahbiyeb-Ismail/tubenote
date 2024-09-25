import type { AuthAction, AuthState } from '@/types/auth.types';

export const authInitialState: AuthState = {
  accessToken: null,
  isAuthenticated: false,
  errorMessage: '',
  successMessage: '',
};

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        accessToken: action.payload.accessToken,
        isAuthenticated: true,
        errorMessage: '',
      };
    case 'REGISTER_SUCCESS':
      return {
        ...state,
        successMessage: action.payload.successMessage,
        isAuthenticated: false,
        errorMessage: '',
      };
    case 'REQUEST_FAIL':
      return {
        ...state,
        errorMessage: action.payload.errorMessage,
      };
    case 'LOGOUT':
      return {
        ...state,
        accessToken: null,
        isAuthenticated: false,
      };
    default:
      return state;
  }
}

export default authReducer;
