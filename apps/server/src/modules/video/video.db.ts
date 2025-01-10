import type { PrismaClient } from "@prisma/client";

import handleAsyncOperation from "../../utils/handleAsyncOperation";

import type { FindManyDto } from "../../common/dtos/find-many.dto";
import type { CreateVideoDto } from "./dtos/create-video.dto";
import type { VideoDto } from "./dtos/video.dto";

export interface IVideoDatabase {
  findByYoutubeId(youtubeId: string): Promise<VideoDto | null>;
  findMany(findManyDto: FindManyDto): Promise<VideoDto[]>;
  count(userId: string): Promise<number>;
  create(createVideoDto: CreateVideoDto): Promise<VideoDto>;
  connectVideoToUser(videoId: string, userId: string): Promise<VideoDto>;
}

export class VideoDatabase implements IVideoDatabase {
  private database: PrismaClient;

  constructor(database: PrismaClient) {
    this.database = database;
  }

  async findByYoutubeId(youtubeId: string): Promise<VideoDto | null> {
    return handleAsyncOperation(
      () =>
        this.database.video.findUnique({
          where: { youtubeId },
        }),
      { errorMessage: "Faild to find video" }
    );
  }

  async findMany(findManyDto: FindManyDto): Promise<VideoDto[]> {
    const { userId, limit, skip, sort } = findManyDto;

    return handleAsyncOperation(
      async () => {
        const videos = await this.database.video.findMany({
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
        this.database.video.count({
          where: {
            userIds: { has: userId },
          },
        }),
      { errorMessage: "Failed to count user videos." }
    );
  }

  async create(createVideoDto: CreateVideoDto): Promise<VideoDto> {
    return handleAsyncOperation(
      async () => {
        const { userId, youtubeVideoId, videoData } = createVideoDto;
        const { snippet, statistics, player } = videoData;

        return await this.database.video.create({
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

  async connectVideoToUser(videoId: string, userId: string): Promise<VideoDto> {
    return handleAsyncOperation(
      () =>
        this.database.video.update({
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
