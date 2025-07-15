import type { Video } from "@tubenote/db";
import type { ISearchAndPaginationQueryDto } from "@tubenote/dtos";
import type { IApiSuccessResponse } from "@tubenote/types";

import { axiosInstance } from "@/shared/lib";
import { extractVideoId } from "@/shared/utils";

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

  const response = await axiosInstance.post<IApiSuccessResponse<Video>>(`/videos/${youtubeVideoId}`);

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

  const response = await axiosInstance.get<IApiSuccessResponse<VideoWithCount[]>>(
    `/videos?page=${page}&limit=${limit}&order=${order}&sortBy=${sortBy}&q=${q}`,
  );

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
  const response = await axiosInstance.get<IApiSuccessResponse<Video>>(`/videos/${videoId}`);

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
 */
export async function getUserVideosCount(): Promise<IApiSuccessResponse<number>> {
  const response = await axiosInstance.get<IApiSuccessResponse<number>>("/videos/count");

  return response.data;
}
