import type { Response } from 'express';
import envConfig from '../config/envConfig';
import httpStatus from 'http-status';
import prismaClient from '../lib/prisma';

const YOUTUBE_API_URL = envConfig.youtube.api.url;
const YOUTUBE_API_KEY = envConfig.youtube.api.key;

/**
 * Fetches data for a YouTube video using the YouTube Data API.
 *
 * @param videoId - The ID of the YouTube video to fetch data for.
 * @returns A promise that resolves to the video data, or undefined if an error occurs.
 * @throws Will throw an error if the HTTP request fails.
 */
export async function getYoutubeVideoData(videoId: string) {
  try {
    const response = await fetch(
      `${YOUTUBE_API_URL}${videoId}&key=${YOUTUBE_API_KEY}&part=snippet, statistics, player`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.items;
  } catch (error) {
    console.error('Error fetching video description:', error);
    return undefined;
  }
}

/**
 * Saves YouTube video data to the database.
 *
 * @param videoId - The ID of the YouTube video.
 * @param userId - The ID of the user saving the video.
 * @param res - The HTTP response object.
 * @returns The saved video data.
 *
 * @throws Will return a 404 status if no video is found with the provided ID.
 */
export async function saveVideoData(
  videoId: string,
  userId: string,
  res: Response
) {
  const videoData = await getYoutubeVideoData(videoId);

  if (!videoData.length) {
    res.status(httpStatus.NOT_FOUND).json({
      message:
        'No Video found with the provided id. Please provide a valid video id.',
    });
    return;
  }

  const { snippet, statistics, player } = videoData[0];

  const video = await prismaClient.video.create({
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
  });

  return video;
}
