import type { User } from "@tubenote/db";
import type { IUpdatePasswordDto, IUpdateUserDto } from "@tubenote/dtos";
import type { IApiSuccessResponse } from "@tubenote/types";

import type { ISessionData } from "@/types";

import { axiosInstance } from "@/lib/axios";

/**
 * Service class for managing user-related operations.
 * Handles user data retrieval, updates, and password management.
 */
export class UserService {
  /**
   * Retrieves the current user's information based on session data.
   *
   * @param sessionData - The session data containing access token and session ID
   * @returns A promise that resolves to an API success response containing the user data
   * @throws Will throw an error if the API request fails or user is not authenticated
   */
  async getCurrentUser(sessionData: ISessionData): Promise<IApiSuccessResponse<User>> {
    const userRes = await axiosInstance.get<IApiSuccessResponse<User>>(`/users/me`, {
      headers: {
        "Authorization": `Bearer ${sessionData.accessToken}`,
        "X-Session-ID": sessionData.sessionId,
      },
    });

    return userRes.data;
  }

  /**
   * Updates the current user's profile information.
   *
   * @param sessionData - The session data containing access token and session ID
   * @param userData - The user data to be updated
   * @returns A promise that resolves to an API success response containing the updated user data
   * @throws Will throw an error if the API request fails or validation errors occur
   */
  async updateUser(sessionData: ISessionData, userData: IUpdateUserDto): Promise<IApiSuccessResponse<User>> {
    const userRes = await axiosInstance.put<IApiSuccessResponse<User>>(`/users/me`, userData, {
      headers: {
        "Authorization": `Bearer ${sessionData.accessToken}`,
        "X-Session-ID": sessionData.sessionId,
      },
    });

    return userRes.data;
  }

  /**
   * Updates the current user's password.
   *
   * @param sessionData - The session data containing access token and session ID
   * @param passwordData - The password update data containing old and new passwords
   * @returns A promise that resolves to an API success response containing the updated user data
   * @throws Will throw an error if the API request fails, old password is incorrect, or validation errors occur
   */
  async updatePassword(sessionData: ISessionData, passwordData: IUpdatePasswordDto): Promise<IApiSuccessResponse<User>> {
    const userRes = await axiosInstance.put<IApiSuccessResponse<User>>(`/users/update-password`, passwordData, {
      headers: {
        "Authorization": `Bearer ${sessionData.accessToken}`,
        "X-Session-ID": sessionData.sessionId,
      },
    });

    return userRes.data;
  }
}
