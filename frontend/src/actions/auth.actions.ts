import axios from 'axios';

import type {
  RegisterFormData,
  RegisterResponse,
  LoginFormData,
  LoginResponse,
} from '@/types/auth.types';
import { API_URL } from '@/utils/constants';
import axiosInstance from '@/lib/axios.lib';

/**
 * Registers a new user with the provided registration credentials.
 *
 * @param registerCredentials - The registration data required to create a new user.
 * @returns A promise that resolves to the registration response.
 */
export async function registerUser(
  registerCredentials: RegisterFormData
): Promise<RegisterResponse> {
  const response = await axios.post(
    `${API_URL}/auth/register`,
    registerCredentials
  );

  return response.data;
}

/**
 * Logs in a user with the provided login credentials.
 *
 * @param loginCredentials - The login form data containing user credentials.
 * @returns A promise that resolves to the login response.
 */
export async function loginUser(
  loginCredentials: LoginFormData
): Promise<LoginResponse> {
  const response = await axios.post(`${API_URL}/auth/login`, loginCredentials, {
    withCredentials: true,
  });

  return response.data;
}

/**
 * Logs out the currently authenticated user by making a POST request
 * to the logout endpoint.
 *
 * @async
 * @function logoutUser
 * @returns {Promise<void>} A promise that resolves when the logout request
 * is complete.
 */
export async function logoutUser() {
  await axiosInstance.post(`${API_URL}/auth/logout`);
}
