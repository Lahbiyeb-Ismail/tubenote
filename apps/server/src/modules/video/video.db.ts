import type { FindManyDto } from "../../common/dtos/find-many.dto";
import prismaClient from "../../lib/prisma";

import handleAsyncOperation from "../../utils/handleAsyncOperation";
import type { CreateVideoDto } from "./dtos/create-video.dto";

import type { VideoEntry } from "./video.type";

class VideoDatabase {
  async findByYoutubeId(youtubeId: string): Promise<VideoEntry | null> {
    return handleAsyncOperation(
      () =>
        prismaClient.video.findUnique({
          where: { youtubeId },
        }),
      { errorMessage: "Faild to find video" }
    );
  }

  async findMany(findManyDto: FindManyDto): Promise<VideoEntry[]> {
    const { userId, limit, skip, sort } = findManyDto;

    return handleAsyncOperation(
      async () => {
        const videos = await prismaClient.video.findMany({
          where: { users: { every: { id: userId } } },
          omit: { userIds: true },
          take: limit,
          skip,
          orderBy: {
            [sort.by]: sort.order,
          },
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

  async create(createVideoDto: CreateVideoDto): Promise<VideoEntry> {
    return handleAsyncOperation(
      async () => {
        const { userId, youtubeVideoId, videoData } = createVideoDto;
        const { snippet, statistics, player } = videoData;

        return await prismaClient.video.create({
          data: {
            youtubeId: youtubeVideoId,
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

  async connectVideoToUser(
    videoId: string,
    userId: string
  ): Promise<VideoEntry> {
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
