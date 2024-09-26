import type { User } from '@/types';
import type { AuthAction, AuthState } from '@/types/auth.types';

export const authInitialState: AuthState = {
  accessToken: JSON.parse(localStorage.getItem('accessToken') as string) || null,
  errorMessage: '',
  successMessage: '',
  isAuthenticated: JSON.parse(localStorage.getItem("isAuthenticated") as string) || false,
  user: JSON.parse(localStorage.getItem('user') as string) as User || null,
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
    case 'LOGOUT':
      return {
        ...state,
        accessToken: null,
        user: null,
        isAuthenticated: false,
      };
    default:
      return state;
  }
}

export default authReducer;
