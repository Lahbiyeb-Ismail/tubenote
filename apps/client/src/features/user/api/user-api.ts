import type { User } from "@tubenote/db";
import type { IUpdatePasswordDto, IUpdateUserDto } from "@tubenote/dtos";
import type { IApiSuccessResponse } from "@tubenote/types";

import { axiosInstance } from "@/shared/lib";

/**
 * Fetches the current user's data from the server.
 *
 * @returns {Promise<IApiSuccessResponse<User>>} A promise that resolves to the user's data wrapped in an API success response.
 * @throws {Error} Throws an error if the request fails. If the error is an Axios error with a response,
 * the error message from the server is thrown. Otherwise, a generic error message is thrown.
 */
export async function getCurrentUser(): Promise<IApiSuccessResponse<User>> {
  const response = await axiosInstance.get<IApiSuccessResponse<User>>("/users/me");

  return response.data;
}

/**
 * Updates the current user's data on the server.
 *
 * @param updateUserData - An object containing the updated user data conforming to the `IUpdateUserDto` interface.
 * @returns A promise that resolves to an `IApiSuccessResponse` containing the updated `User` object.
 * @throws An error if the update operation fails. The error message will either be the server-provided message
 *         or a generic "Failed to update user data." message if no response is available.
 */
export async function updateCurrentUser(
  updateUserData: IUpdateUserDto,
): Promise<IApiSuccessResponse<User>> {
  const response = await axiosInstance.patch<IApiSuccessResponse<User>>("/users/me", updateUserData);

  return response.data;
}

/**
 * Updates the user's password by sending a PATCH request to the server.
 *
 * @param updatePasswordData - An object containing the data required to update the password.
 * @returns A promise that resolves to an API success response containing the updated user data.
 * @throws An error if the request fails. If the server responds with an error, the error message
 *         from the server is thrown. Otherwise, a generic error message is thrown.
 */
export async function updatePassword(
  updatePasswordData: IUpdatePasswordDto,
): Promise<IApiSuccessResponse<User>> {
  const response = await axiosInstance.patch<IApiSuccessResponse<User>>(
    "/users/update-password",
    updatePasswordData,
  );

  return response.data;
}
