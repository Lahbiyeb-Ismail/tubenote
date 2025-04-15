import type { AxiosError } from "axios";

import axiosInstance from "@/lib/axios.lib";

import type { IUpdatePasswordDto, IUpdateUserDto } from "@tubenote/dtos";
import type {
  IApiErrorResponse,
  IApiSuccessResponse,
  User,
} from "@tubenote/types";
import { asyncTryCatch } from "@tubenote/utils";

/**
 * Fetches the current user's data from the server.
 *
 * @returns {Promise<IApiSuccessResponse<User>>} A promise that resolves to the user's data wrapped in an API success response.
 * @throws {Error} Throws an error if the request fails. If the error is an Axios error with a response,
 * the error message from the server is thrown. Otherwise, a generic error message is thrown.
 */
export async function getCurrentUser(): Promise<IApiSuccessResponse<User>> {
  const { data: response, error } = await asyncTryCatch(
    axiosInstance.get<IApiSuccessResponse<User>>("/users/me")
  );

  if (error) {
    const axiosError = error as AxiosError<IApiErrorResponse>;

    if (axiosError.response) {
      throw new Error(axiosError.response.data.payload.message);
    } else {
      throw new Error("Failed to fetch user data.");
    }
  }

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
  updateUserData: IUpdateUserDto
): Promise<IApiSuccessResponse<User>> {
  const { data: response, error } = await asyncTryCatch(
    axiosInstance.patch<IApiSuccessResponse<User>>("/users/me", updateUserData)
  );

  if (error) {
    const axiosError = error as AxiosError<IApiErrorResponse>;

    if (axiosError.response) {
      throw new Error(axiosError.response.data.payload.message);
    } else {
      throw new Error("Failed to update user data.");
    }
  }

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
  updatePasswordData: IUpdatePasswordDto
): Promise<IApiSuccessResponse<User>> {
  const { data: response, error } = await asyncTryCatch(
    axiosInstance.patch<IApiSuccessResponse<User>>(
      "/users/update-password",
      updatePasswordData
    )
  );

  if (error) {
    const axiosError = error as AxiosError<IApiErrorResponse>;

    if (axiosError.response) {
      throw new Error(axiosError.response.data.payload.message);
    } else {
      throw new Error("Failed to update user data.");
    }
  }

  return response.data;
}
