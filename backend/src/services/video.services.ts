import type { Video } from '@prisma/client';

import prismaClient from '../lib/prisma';
import handleAsyncOperation from '../utils/handleAsyncOperation';
import { fetchYoutubeVideoDetails } from '../helpers/video.helper';

/**
 * Finds a video by its YouTube ID.
 *
 * @param videoId - The YouTube ID of the video to find.
 * @returns A promise that resolves to the video if found, or null if not found.
 * @throws Will throw an error if the operation fails.
 */
export async function findVideo(videoId: string): Promise<Video | null> {
  return handleAsyncOperation(
    () =>
      prismaClient.video.findFirst({
        where: { youtubeId: videoId },
      }),
    { errorMessage: 'Faild to find video' }
  );
}

/**
 * Creates a new video entry in the database.
 *
 * @param videoId - The ID of the YouTube video.
 * @param userId - The ID of the user creating the video entry.
 * @returns A promise that resolves to the created Video object.
 * @throws Will throw an error if no video data is found.
 *
 * This function fetches video details from YouTube using the provided video ID,
 * and then creates a new video entry in the database with the fetched details.
 * If the video data is not found, it throws an error.
 */
export async function createVideoEntry(
  videoId: string,
  userId: string
): Promise<Video> {
  const videoData = await fetchYoutubeVideoDetails(videoId);

  if (!videoData.length) {
    throw new Error('No video data found');
  }

  const { snippet, statistics, player } = videoData[0];

  return handleAsyncOperation(
    () =>
      prismaClient.video.create({
        data: {
          userId,
          youtubeId: videoId,
          snippet: {
            title: snippet.title,
            categoryId: snippet.categoryId,
            channelId: snippet.channelId,
            channelTitle: snippet.channelTitle,
            description: snippet.description,
            liveBroadcastContent: snippet.liveBroadcastContent,
            publishedAt: snippet.publishedAt,
            defaultAudioLanguage: snippet.defaultAudioLanguage,
            tags: snippet.tags,
            thumbnails: snippet.thumbnails,
          },
          statistics,
          player,
        },
      }),
    { errorMessage: 'Failed to create video entry' }
  );
}
