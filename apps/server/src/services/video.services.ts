import type { Prisma, Video } from "@prisma/client";

import { fetchYoutubeVideoDetails } from "../helpers/video.helper";
import prismaClient from "../lib/prisma";
import handleAsyncOperation from "../utils/handleAsyncOperation";

import { NotFoundError } from "../errors";

import { findUser } from "./user.services";

type UserId = {
  userId: string;
};
type VideoId = {
  videoId: string;
};

type CreateVideoEntry = UserId & VideoId;

type FetchUserVideos = UserId & {
  limit: number;
  skip: number;
};

/**
 * Finds the first video that matches the given parameters.
 *
 * @param params - The parameters to filter the videos.
 * @returns A promise that resolves to the found video or null if no video matches the parameters.
 * @throws Will throw an error if the operation fails.
 */
export async function findVideo(
  params: Prisma.VideoWhereInput
): Promise<Video | null> {
  return handleAsyncOperation(
    () =>
      prismaClient.video.findFirst({
        where: { ...params },
      }),
    { errorMessage: "Faild to find video" }
  );
}

/**
 * Finds an existing video by its YouTube ID or creates a new one if it doesn't exist.
 * If the video exists, it links the user to the video.
 * If the video does not exist, it fetches the video details from YouTube and creates a new video.
 *
 * @param prisma - The Prisma TransactionClient instance for database operations.
 * @param videoId - The YouTube ID of the video to find or create.
 * @param userId - The ID of the user to link to the video.
 * @returns A promise that resolves to the found or newly created Video object.
 * @throws An error if no video data is found from YouTube.
 */
async function findOrCreateVideo(
  videoId: string,
  userId: string
): Promise<Video> {
  const existingVideo = await prismaClient.video.findUnique({
    where: { youtubeId: videoId },
  });

  if (existingVideo) {
    return linkUserToVideo(existingVideo, userId);
  }

  const videoData = await fetchYoutubeVideoDetails(videoId);
  if (!videoData.length) {
    throw new Error("No video data found");
  }

  return createNewVideo(videoData[0], userId);
}

/**
 * Links a user to a video by adding the user's ID to the video's userIds array if it is not already present.
 *
 * @param prisma - The Prisma TransactionClient instance used to interact with the database.
 * @param video - The video object to which the user will be linked.
 * @param userId - The ID of the user to be linked to the video.
 * @returns A promise that resolves to the updated video object.
 */
async function linkUserToVideo(video: Video, userId: string): Promise<Video> {
  if (video.userIds.includes(userId)) {
    return video;
  }

  return prismaClient.video.update({
    where: { id: video.id },
    data: {
      userIds: {
        push: userId,
      },
    },
  });
}

/**
 * Creates a new video record in the database.
 *
 * @param prisma - The Prisma TransactionClient instance used to interact with the database.
 * @param videoData - The data of the video to be created, including snippet, statistics, and player information.
 * @param userId - The ID of the user creating the video.
 * @returns A promise that resolves to the created Video object.
 */
async function createNewVideo(videoData: any, userId: string): Promise<Video> {
  const { snippet, statistics, player } = videoData;
  return prismaClient.video.create({
    data: {
      youtubeId: videoData.id,
      userIds: [userId],
      snippet: {
        title: snippet.title,
        categoryId: snippet.categoryId,
        channelId: snippet.channelId,
        channelTitle: snippet.channelTitle,
        description: snippet.description,
        liveBroadcastContent: snippet.liveBroadcastContent,
        publishedAt: snippet.publishedAt,
        tags: snippet.tags || [],
        thumbnails: snippet.thumbnails,
      },
      statistics,
      player,
    },
  });
}

/**
 * Links a video to a user by updating the user's videoIds array in the database.
 * If the user is not found, it throws a NotFoundError.
 * If the video is already linked to the user, it returns without making any changes.
 *
 * @param prisma - The Prisma TransactionClient instance used to interact with the database.
 * @param userId - The ID of the user to whom the video will be linked.
 * @param videoId - The ID of the video to be linked to the user.
 * @returns A promise that resolves when the video has been successfully linked to the user.
 * @throws NotFoundError - If the user with the specified ID is not found.
 */
async function linkVideoToUser(userId: string, videoId: string): Promise<void> {
  const user = await findUser({ id: userId });

  if (!user) {
    throw new NotFoundError("User not found");
  }

  if (user.videoIds.includes(videoId)) {
    return;
  }

  await prismaClient.user.update({
    where: { id: userId },
    data: {
      videoIds: {
        push: videoId,
      },
    },
  });
}

/**
 * Creates a video entry and links it to a user.
 *
 * This function performs the following steps:
 * 1. Finds or creates a video entry using the provided `videoId` and `userId`.
 * 2. Links the created or found video entry to the user.
 *
 * @param {Object} params - The parameters for creating a video entry.
 * @param {string} params.videoId - The ID of the video to be created or found.
 * @param {string} params.userId - The ID of the user to link the video to.
 * @returns {Promise<Video>} A promise that resolves to the created or found video entry.
 * @throws Will throw an error if the video entry cannot be created or linked to the user.
 */
export async function createVideoEntry({
  videoId,
  userId,
}: CreateVideoEntry): Promise<Video> {
  return handleAsyncOperation(
    async () => {
      const video = await findOrCreateVideo(videoId, userId);

      await linkVideoToUser(userId, video.id);

      return video;
    },
    { errorMessage: "Failed to create or link video entry to user" }
  );
}

/**
 * Fetches a list of videos for a specific user.
 *
 * @param {Object} params - The parameters for fetching user videos.
 * @param {string} params.userId - The ID of the user whose videos are to be fetched.
 * @param {number} params.limit - The maximum number of videos to fetch.
 * @param {number} params.skip - The number of videos to skip before starting to fetch.
 * @returns {Promise<Video[]>} A promise that resolves to an array of videos.
 * @throws {NotFoundError} If the user is not found.
 * @throws {Error} If there is an error during the operation.
 */
export async function fetchUserVideos({
  userId,
  limit,
  skip,
}: FetchUserVideos): Promise<Video[]> {
  return handleAsyncOperation(
    async () => {
      const user = await prismaClient.user.findFirst({
        where: { id: userId },
        include: { videos: { take: limit, skip } },
      });

      if (!user) throw new NotFoundError("User not found");

      return user.videos;
    },
    { errorMessage: "Failed to find user videos" }
  );
}

/**
 * Retrieves the count of videos associated with a specific user.
 *
 * @param {UserId} param0 - An object containing the user ID.
 * @param {string} param0.userId - The ID of the user whose videos are to be counted.
 * @returns {Promise<number>} A promise that resolves to the count of videos associated with the user.
 * @throws Will throw an error if the operation fails.
 */
export async function getUserVideosCount({ userId }: UserId): Promise<number> {
  return handleAsyncOperation(
    () =>
      prismaClient.video.count({
        where: {
          userIds: { has: userId },
        },
      }),
    { errorMessage: "Failed to count user videos." }
  );
}
