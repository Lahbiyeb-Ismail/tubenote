import axios from 'axios';

import type { RegisterFormData, RegisterResponse } from '@/types/auth.types';
import { API_URL } from '@/utils/constants';

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
