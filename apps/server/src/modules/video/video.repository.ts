import type { Prisma } from "@prisma/client";

import type { Video, YoutubeVideoData } from "@tubenote/types";

import { ERROR_MESSAGES } from "@/modules/shared/constants";
import { handleAsyncOperation } from "@/modules/shared/utils";

import type { ICreateDto, IFindAllDto } from "@/modules/shared/dtos";
import type { IPrismaService } from "@/modules/shared/services";

import type { IVideoRepository, IVideoRepositoryOptions } from "./video.types";

export class VideoRepository implements IVideoRepository {
  private static _instance: VideoRepository;

  private constructor(private readonly _db: IPrismaService) {}

  public static getInstance(options: IVideoRepositoryOptions): VideoRepository {
    if (!this._instance) {
      this._instance = new VideoRepository(options.db);
    }

    return this._instance;
  }

  async findByYoutubeId(
    youtubeId: string,
    tx?: Prisma.TransactionClient
  ): Promise<Video | null> {
    const client = tx ?? this._db;

    return handleAsyncOperation(
      () =>
        client.video.findUnique({
          where: { youtubeId },
        }),
      { errorMessage: ERROR_MESSAGES.FAILED_TO_FIND }
    );
  }

  async findMany(
    findAllDto: IFindAllDto,
    tx?: Prisma.TransactionClient
  ): Promise<Video[]> {
    const client = tx ?? this._db;

    const { userId, limit, skip, sort } = findAllDto;

    return handleAsyncOperation(
      () =>
        client.video.findMany({
          where: { users: { every: { id: userId } } },
          take: limit,
          skip,
          orderBy: {
            [sort.by]: sort.order,
          },
        }),
      { errorMessage: ERROR_MESSAGES.FAILED_TO_FIND }
    );
  }

  async count(userId: string, tx?: Prisma.TransactionClient): Promise<number> {
    const client = tx ?? this._db;

    return handleAsyncOperation(
      () =>
        client.video.count({
          where: {
            userIds: { has: userId },
          },
        }),
      { errorMessage: ERROR_MESSAGES.FAILED_TO_COUNT }
    );
  }

  async create(
    createVideoDto: ICreateDto<YoutubeVideoData>,
    tx?: Prisma.TransactionClient
  ): Promise<Video> {
    const client = tx ?? this._db;

    const { userId, data } = createVideoDto;

    return handleAsyncOperation(
      async () =>
        client.video.create({
          data: {
            userIds: [userId],
            ...data,
          },
        }),
      { errorMessage: ERROR_MESSAGES.FAILED_TO_CREATE }
    );
  }

  async connectVideoToUser(
    videoId: string,
    userId: string,
    tx?: Prisma.TransactionClient
  ): Promise<Video> {
    const client = tx ?? this._db;

    return handleAsyncOperation(
      () =>
        client.video.update({
          where: { id: videoId },
          data: {
            userIds: {
              push: userId,
            },
          },
        }),
      {
        errorMessage: ERROR_MESSAGES.FAILED_TO_UPDATE,
      }
    );
  }
}
