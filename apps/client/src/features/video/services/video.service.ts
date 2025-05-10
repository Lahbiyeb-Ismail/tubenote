import type { AxiosError } from "axios";

import type { IPaginationQueryDto } from "@tubenote/dtos";
import type {
  IApiErrorResponse,
  IApiSuccessResponse,
  Video,
} from "@tubenote/types";
import { asyncTryCatch } from "@tubenote/utils";

import { extractVideoId } from "@/helpers";
import { axiosInstance } from "@/lib";

/**
 * Fetches video data for a given YouTube video URL.
 *
 * @param youtubeVideoUrl - The URL of the YouTube video to fetch data for.
 * @returns A promise that resolves to an API success response containing the video data.
 * @throws An error if the request fails, with a message from the API response or a default error message.
 */
export async function saveVideoData(
  youtubeVideoUrl: string
): Promise<IApiSuccessResponse<Video>> {
  const youtubeVideoId = extractVideoId(youtubeVideoUrl);

  const { data: response, error } = await asyncTryCatch(
    axiosInstance.post<IApiSuccessResponse<Video>>(`/videos/${youtubeVideoId}`)
  );

  if (error) {
    const axiosError = error as AxiosError<IApiErrorResponse>;

    throw new Error(
      axiosError.response?.data.payload.message ||
        "An error occurred while fetching video data."
    );
  }

  return response.data;
}

/**
 * Fetches video notes for a specific video ID with pagination.
 *
 * @param videoId - The unique identifier of the video.
 * @param paginationQuery - An object containing pagination parameters such as page, limit, order, and sortBy.
 * @returns A promise that resolves to an object containing the video notes data.
 * @throws An error if the request fails, including the error message from the server if available.
 */
export async function getUserVideos(
  paginationQuery: IPaginationQueryDto
): Promise<IApiSuccessResponse<Video[]>> {
  const { page, limit, order, sortBy } = paginationQuery;

  const { data: response, error } = await asyncTryCatch(
    axiosInstance.get<IApiSuccessResponse<Video[]>>(
      `/videos?page=${page}&limit=${limit}&order=${order}&sortBy=${sortBy}`
    )
  );

  if (error) {
    const axiosError = error as AxiosError<IApiErrorResponse>;

    throw new Error(
      axiosError.response?.data.payload.message ||
        "An error occurred while fetching user videos."
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
  videoId: string
): Promise<IApiSuccessResponse<Video>> {
  const { data: response, error } = await asyncTryCatch(
    axiosInstance.get<IApiSuccessResponse<Video>>(`/videos/${videoId}`)
  );

  if (error) {
    const axiosError = error as AxiosError<IApiErrorResponse>;

    throw new Error(
      axiosError.response?.data.payload.message ||
        "An error occurred while fetching the video by ID."
    );
  }

  return response.data;
}
