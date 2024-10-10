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
