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

async function findOrCreateVideo(
  prisma: Prisma.TransactionClient,
  videoId: string,
  userId: string
): Promise<Video> {
  const existingVideo = await prisma.video.findUnique({
    where: { youtubeId: videoId },
  });

  if (existingVideo) {
    return linkUserToVideo(prisma, existingVideo, userId);
  }

  const videoData = await fetchYoutubeVideoDetails(videoId);
  if (!videoData.length) {
    throw new Error("No video data found");
  }

  return createNewVideo(prisma, videoData[0], userId);
}

async function linkUserToVideo(
  prisma: Prisma.TransactionClient,
  video: Video,
  userId: string
): Promise<Video> {
  if (video.userIds.includes(userId)) {
    return video;
  }

  return prisma.video.update({
    where: { id: video.id },
    data: {
      userIds: {
        push: userId,
      },
    },
  });
}

async function createNewVideo(
  prisma: Prisma.TransactionClient,
  videoData: any,
  userId: string
): Promise<Video> {
  const { snippet, statistics, player } = videoData;
  return prisma.video.create({
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

async function linkVideoToUser(
  prisma: Prisma.TransactionClient,
  userId: string,
  videoId: string
): Promise<void> {
  const user = await findUser({ id: userId });

  if (!user) {
    throw new NotFoundError("User not found");
  }

  if (user.videoIds.includes(videoId)) {
    return;
  }

  await prisma.user.update({
    where: { id: userId },
    data: {
      videoIds: {
        push: videoId,
      },
    },
  });
}

export async function createVideoEntry({
  videoId,
  userId,
}: CreateVideoEntry): Promise<Video> {
  return handleAsyncOperation(
    async () => {
      return prismaClient.$transaction(async (prisma) => {
        const video = await findOrCreateVideo(prisma, videoId, userId);
        await linkVideoToUser(prisma, userId, video.id);
        return video;
      });
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
 * @throws Will throw an error if the operation fails.
 */
export async function fetchUserVideos({
  userId,
  limit,
  skip,
}: FetchUserVideos) {
  return handleAsyncOperation(
    () =>
      prismaClient.user.findMany({
        where: { id: userId },
        include: { videos: { include: { notes: true }, take: limit, skip } },
      }),
    { errorMessage: "Failed to find user videos" }
  );
}

/**
 * Retrieves the count of videos associated with a specific user.
 *
 * @param {UserId} param0 - An object containing the user ID.
 * @returns {Promise<number>} - A promise that resolves to the count of videos.
 * @throws Will throw an error if the operation fails.
 */
export async function getUserVideosCount({ userId }: UserId): Promise<number> {
  return handleAsyncOperation(
    () =>
      prismaClient.video.count({
        where: {
          userIds: { equals: [userId] },
        },
      }),
    { errorMessage: "Failed to count user videos." }
  );
}

type UpdateVideo = {
  videoId: string;
  data: Prisma.VideoUpdateuserIdsInput;
};

export async function updateVideo({
  videoId,
  data,
}: UpdateVideo): Promise<Video> {
  return handleAsyncOperation(
    () =>
      prismaClient.video.update({
        where: { youtubeId: videoId },
        data,
      }),
    { errorMessage: "Failed to update video" }
  );
}
