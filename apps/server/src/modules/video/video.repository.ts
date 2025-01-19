import type { PrismaClient } from "@prisma/client";

import handleAsyncOperation from "@/utils/handle-async-operation";

import type { Video } from "./video.model";
import type { IVideoRepository } from "./video.types";

import type { FindManyDto } from "@common/dtos/find-many.dto";
import type { CreateVideoDto } from "./dtos/create-video.dto";

export class VideoRepository implements IVideoRepository {
  constructor(private readonly _db: PrismaClient) {}

  async findByYoutubeId(youtubeId: string): Promise<Video | null> {
    return handleAsyncOperation(
      () =>
        this._db.video.findUnique({
          where: { youtubeId },
        }),
      { errorMessage: "Faild to find video" }
    );
  }

  async findMany(findManyDto: FindManyDto): Promise<Video[]> {
    const { userId, limit, skip, sort } = findManyDto;

    return handleAsyncOperation(
      async () => {
        const videos = await this._db.video.findMany({
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
        this._db.video.count({
          where: {
            userIds: { has: userId },
          },
        }),
      { errorMessage: "Failed to count user videos." }
    );
  }

  async create(createVideoDto: CreateVideoDto): Promise<Video> {
    return handleAsyncOperation(
      async () => {
        const { userId, youtubeVideoId, videoData } = createVideoDto;
        const { snippet, statistics, player } = videoData;

        return await this._db.video.create({
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

  async connectVideoToUser(videoId: string, userId: string): Promise<Video> {
    return handleAsyncOperation(
      () =>
        this._db.video.update({
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
