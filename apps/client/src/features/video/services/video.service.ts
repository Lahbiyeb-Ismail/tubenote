import type { Video } from "@tubenote/db";
import type { ISearchAndPaginationQueryDto } from "@tubenote/dtos";
import type { IApiErrorResponse, IApiSuccessResponse } from "@tubenote/types";
import type { AxiosError } from "axios";

import { asyncTryCatch } from "@tubenote/utils";

import { extractVideoId } from "@/helpers";
import { axiosInstance } from "@/lib";

import type { VideoWithCount } from "../types";

/**
 * Fetches video data for a given YouTube video URL.
 *
 * @param youtubeVideoUrl - The URL of the YouTube video to fetch data for.
 * @returns A promise that resolves to an API success response containing the video data.
 * @throws An error if the request fails, with a message from the API response or a default error message.
 */
export async function saveVideoData(
  youtubeVideoUrl: string,
): Promise<IApiSuccessResponse<Video>> {
  const youtubeVideoId = extractVideoId(youtubeVideoUrl);

  const { data: response, error } = await asyncTryCatch(
    axiosInstance.post<IApiSuccessResponse<Video>>(`/videos/${youtubeVideoId}`),
  );

  if (error) {
    const axiosError = error as AxiosError<IApiErrorResponse>;

    throw new Error(
      axiosError.response?.data.payload.message
      || "An error occurred while fetching video data.",
    );
  }

  return response.data;
}

/**
 * Fetches video notes for a specific video ID with pagination.
 *
 * @param searchParams - An object containing pagination parameters such as page, limit, order, and sortBy.
 * @returns A promise that resolves to an object containing the video notes data.
 * @throws An error if the request fails, including the error message from the server if available.
 */
export async function getUserVideos(
  searchParams: ISearchAndPaginationQueryDto,
): Promise<IApiSuccessResponse<VideoWithCount[]>> {
  const { page, limit, order, sortBy, q } = searchParams;

  const { data: response, error } = await asyncTryCatch(
    axiosInstance.get<IApiSuccessResponse<VideoWithCount[]>>(
      `/videos?page=${page}&limit=${limit}&order=${order}&sortBy=${sortBy}&q=${q}`,
    ),
  );

  if (error) {
    const axiosError = error as AxiosError<IApiErrorResponse>;

    throw new Error(
      axiosError.response?.data.payload.message
      || "An error occurred while fetching user videos.",
    );
  }

  return response.data;
}

/**
 * Fetches a video by its ID from the server.
 *
 * @param videoId - The unique identifier of the video to fetch.
 * @returns A promise that resolves to an object containing the video data.
 * @throws An error if the request fails, including the error message from the server if available.
 */
export async function getVideoById(
  videoId: string,
): Promise<IApiSuccessResponse<Video>> {
  const { data: response, error } = await asyncTryCatch(
    axiosInstance.get<IApiSuccessResponse<Video>>(`/videos/${videoId}`),
  );

  if (error) {
    const axiosError = error as AxiosError<IApiErrorResponse>;

    throw new Error(
      axiosError.response?.data.payload.message
      || "An error occurred while fetching the video by ID.",
    );
  }

  return response.data;
}

/**
 * Retrieves the total count of videos for the current user.
 *
 * Makes a POST request to the `/videos/count` endpoint to fetch the number
 * of videos associated with the authenticated user.
 *
 * @returns A promise that resolves to an API success response containing the video count as a number
 * @throws {Error} Throws an error if the API request fails, with the error message from the server
 *                 or a default message if no specific error message is available
 *
 * @example
 * ```typescript
 * try {
 *   const response = await getUserVideosCount();
 *   console.log(`User has ${response.payload} videos`);
 * } catch (error) {
 *   console.error('Failed to fetch video count:', error.message);
 * }
 * ```
 */
export async function getUserVideosCount(): Promise<IApiSuccessResponse<number>> {
  const { data: response, error } = await asyncTryCatch(
    axiosInstance.get<IApiSuccessResponse<number>>("/videos/count"),
  );

  if (error) {
    const axiosError = error as AxiosError<IApiErrorResponse>;

    throw new Error(
      axiosError.response?.data.payload.message
      || "An error occurred while fetching videos count.",
    );
  }

  return response.data;
}
