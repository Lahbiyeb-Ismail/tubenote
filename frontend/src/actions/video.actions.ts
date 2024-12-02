import axiosInstance from '@/lib/axios.lib';

import extractVideoId from '@/helpers/extractVideoId';
import type { Video } from '@/types/video.types';

/**
 * Saves video data by extracting the video ID from the provided URL
 * and sending it to the server.
 *
 * @param {string} videoUrl - The URL of the video to be saved.
 * @returns {Promise<Video | null>} - A promise that resolves to the saved
 * video data or null if the video ID could not be extracted.
 */
export async function saveVideoData(videoUrl: string): Promise<Video> {
  const videoId = extractVideoId(videoUrl);

  const response = await axiosInstance.post('/videos', { videoId });

  return response.data;
}

/**
 * Fetches the list of videos for the user.
 *
 * @returns {Promise<Video[]>} A promise that resolves to an array of Video objects.
 */
export async function getUserVideos(): Promise<Video[]> {
  const response = await axiosInstance.get('/videos');

  return response.data;
}

/**
 * Fetches a video by its ID.
 *
 * @param {string} videoId - The ID of the video to fetch.
 * @returns {Promise<Video>} A promise that resolves to the video data.
 */
export async function getVideoById(videoId: string): Promise<Video> {
  const response = await axiosInstance.get(`/videos/${videoId}`);

  return response.data;
}
