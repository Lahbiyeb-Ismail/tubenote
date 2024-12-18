import type { Prisma, Video } from "@prisma/client";
import prismaClient from "../lib/prisma";
import handleAsyncOperation from "../utils/handleAsyncOperation";

export interface IFindMany {
  userId: string;
  limit: number;
  skip: number;
}

export interface IVideo extends Omit<Video, "userIds"> {}

class VideoDatabase {
  async find(params: Prisma.VideoWhereInput): Promise<IVideo | null> {
    return handleAsyncOperation(
      () =>
        prismaClient.video.findFirst({
          where: { ...params },
          omit: { userIds: true },
        }),
      { errorMessage: "Faild to find video" }
    );
  }

  async findUnique(videoId: string): Promise<Video | null> {
    return handleAsyncOperation(
      () =>
        prismaClient.video.findUnique({
          where: { youtubeId: videoId },
        }),
      { errorMessage: "Faild to find video" }
    );
  }

  async findMany({ userId, limit, skip }: IFindMany): Promise<IVideo[]> {
    return handleAsyncOperation(
      async () => {
        const videos = await prismaClient.video.findMany({
          where: { users: { some: { id: userId } } },
          omit: { userIds: true },
          take: limit,
          skip,
        });

        return videos;
      },
      { errorMessage: "Failed to find user videos" }
    );
  }

  async count(userId: string): Promise<number> {
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

  async create(videoData: any, userId: string): Promise<Video> {
    return handleAsyncOperation(
      async () => {
        const { snippet, statistics, player } = videoData;
        return await prismaClient.video.create({
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
      },
      { errorMessage: "Failed to create video" }
    );
  }

  async connectVideoToUser(videoId: string, userId: string): Promise<Video> {
    return handleAsyncOperation(
      () =>
        prismaClient.video.update({
          where: { id: videoId },
          data: {
            userIds: {
              push: userId,
            },
          },
        }),
      {
        errorMessage: "Failed to update video",
      }
    );
  }
}

export default new VideoDatabase();
