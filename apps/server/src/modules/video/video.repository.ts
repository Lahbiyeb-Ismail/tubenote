import type { Prisma, PrismaClient } from "@prisma/client";

import { ERROR_MESSAGES } from "@/constants/error-messages.contants";
import handleAsyncOperation from "@/utils/handle-async-operation";

import type { CreateVideoDto, IVideoRepository, Video } from "@modules/video";

import type { FindManyDto } from "@common/dtos/find-many.dto";

export class VideoRepository implements IVideoRepository {
  constructor(private readonly _db: PrismaClient) {}

  async transaction<T>(fn: (tx: IVideoRepository) => Promise<T>): Promise<T> {
    // Use Prisma's transaction system
    return this._db.$transaction(async (prismaTx: Prisma.TransactionClient) => {
      // Create a new repository instance with the transactional client
      const txRepository = new VideoRepository(prismaTx as PrismaClient);
      return await fn(txRepository);
    });
  }

  async findByYoutubeId(youtubeId: string): Promise<Video | null> {
    return handleAsyncOperation(
      () =>
        this._db.video.findUnique({
          where: { youtubeId },
        }),
      { errorMessage: ERROR_MESSAGES.FAILD_TO_FIND }
    );
  }

  async findMany(findManyDto: FindManyDto): Promise<Video[]> {
    const { userId, limit, skip, sort } = findManyDto;

    return handleAsyncOperation(
      () =>
        this._db.video.findMany({
          where: { users: { every: { id: userId } } },
          take: limit,
          skip,
          orderBy: {
            [sort.by]: sort.order,
          },
        }),
      { errorMessage: ERROR_MESSAGES.FAILD_TO_FIND }
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
      { errorMessage: ERROR_MESSAGES.FAILD_TO_COUNT }
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
      { errorMessage: ERROR_MESSAGES.FAILD_TO_CREATE }
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
        errorMessage: ERROR_MESSAGES.FAILD_TO_UPDATE,
      }
    );
  }
}
