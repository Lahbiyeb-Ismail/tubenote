import type { AuthAction, AuthState } from '@/types/auth.types';
import {
  removeStorageValue,
  getStorageValue,
  setStorageValue,
} from '@/utils/localStorage';

export function useAuthReducer() {
  const accessToken = getStorageValue<string>('accessToken');

  const authInitialState: AuthState = {
    errorMessage: '',
    successMessage: '',
    isAuthenticated: !!accessToken,
    accessToken,
  };

  function authReducer(state: AuthState, action: AuthAction): AuthState {
    switch (action.type) {
      case 'LOGIN_SUCCESS':
        setStorageValue('accessToken', action.payload.accessToken);
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
        };
      case 'LOGOUT_SUCCESS':
        removeStorageValue('accessToken');
        return {
          ...state,
          accessToken: null,
          isAuthenticated: false,
          errorMessage: '',
          successMessage: '',
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

  return { authInitialState, authReducer };
}
