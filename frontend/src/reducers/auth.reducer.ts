import type { AuthAction, AuthState, User } from '@/types/auth.types';

let user: User | null = null;
let accessToken: string | null = null;

if (typeof window !== 'undefined') {
  // This code will only run in the browser
  user = JSON.parse(localStorage.getItem('user') ?? 'null');
  accessToken = localStorage.getItem('accessToken');
}

export const authInitialState: AuthState = {
  errorMessage: '',
  successMessage: '',
  isAuthenticated: false,
  accessToken,
  user,
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
