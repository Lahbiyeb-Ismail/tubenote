import type { Prisma } from "@prisma/client";
import { inject, injectable } from "inversify";

import type { ICreateVideoDto, IFindManyDto } from "@tubenote/dtos";
import type { Video } from "@tubenote/types";

import { TYPES } from "@/config/inversify/types";

import { ERROR_MESSAGES } from "@/modules/shared/constants";
import { handleAsyncOperation } from "@/modules/shared/utils";

import type { IPrismaService } from "@/modules/shared/services";

import type { IVideoRepository } from "./video.types";

@injectable()
export class VideoRepository implements IVideoRepository {
  constructor(@inject(TYPES.PrismaService) private _db: IPrismaService) {}

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
    userId: string,
    findManyDto: IFindManyDto,
    tx?: Prisma.TransactionClient
  ): Promise<Video[]> {
    const client = tx ?? this._db;

    const { limit, skip, sort } = findManyDto;

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
    userId: string,
    data: ICreateVideoDto,
    tx?: Prisma.TransactionClient
  ): Promise<Video> {
    const client = tx ?? this._db;

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
