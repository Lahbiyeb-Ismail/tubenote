import type { AuthAction, AuthState } from '@/types/auth.types';

export const authInitialState: AuthState = {
  accessToken: null,
  errorMessage: '',
  successMessage: '',
  isAuthenticated: false,
  user: null,
};

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        accessToken: action.payload.accessToken,
        user: action.payload.user,
        isAuthenticated: true,
        errorMessage: '',
      };
    case 'REGISTER_SUCCESS':
      return {
        ...state,
        successMessage: action.payload.successMessage,
      };
    case 'REQUEST_FAIL':
      return {
        ...state,
        errorMessage: action.payload.errorMessage,
      };
    default:
      return state;
  }
}

export default authReducer;
