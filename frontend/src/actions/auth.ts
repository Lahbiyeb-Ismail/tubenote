import axios from 'axios';

import { API_URL } from '@/utils/constants';
import type { LoginFormData, RegisterFormData } from '@/lib/schemas';
import type { LoginResponse, RegisterResponse } from '@/types';
import axiosInstance from '@/lib/auth.lib';

export const loginUser = async (
  loginData: LoginFormData
): Promise<LoginResponse> => {
  const response = await axios.post(`${API_URL}/auth/login`, loginData);

  return response.data;
};

export const registerUser = async (
  registerData: RegisterFormData
): Promise<RegisterResponse> => {
  const response = await axios.post(`${API_URL}/auth/signup`, registerData);

  return response.data;
};

export const logoutUser = async () => {
  await axios.post(`${API_URL}/auth/logout`);
}
