import type { Prisma, Video } from "@tubenote/db";
import type {
  ICreateVideoDto,
  IParamIdDto,
  ISearchAndPaginationQueryDto,
} from "@tubenote/dtos";
import type { IPaginatedData } from "@tubenote/types";
import type { Response } from "express";

import type { EmptyRecord, TypedRequest } from "@/modules/shared/types";

export interface IVideoRepository {
  findByYoutubeId: (
    youtubeId: string,
    tx?: Prisma.TransactionClient
  ) => Promise<Video | null>;
  findMany: (
    userId: string,
    queryOptions: ISearchAndPaginationQueryDto,
    tx?: Prisma.TransactionClient
  ) => Promise<Video[]>;
  count: (userId: string, searchQuery?: string, tx?: Prisma.TransactionClient) => Promise<number>;
  create: (
    userId: string,
    data: ICreateVideoDto,
    tx?: Prisma.TransactionClient
  ) => Promise<Video>;
  connectVideoToUser: (
    videoId: string,
    userId: string,
    tx?: Prisma.TransactionClient
  ) => Promise<Video>;
}

export interface IVideoService {
  getUserVideos: (
    userId: string,
    queryOptions: ISearchAndPaginationQueryDto,
  ) => Promise<IPaginatedData<Video>>;
  getUserVideosCount: (userId: string) => Promise<number>;
  getVideoByYoutubeId: (userId: string, videoYoutubeId: string) => Promise<Video>;
}

export interface IVideoController {
  getYoutubeVideoTranscript: (
    req: TypedRequest<EmptyRecord, IParamIdDto>,
    res: Response
  ) => Promise<void>;
  getUserVideos: (
    req: TypedRequest<EmptyRecord, EmptyRecord, ISearchAndPaginationQueryDto>,
    res: Response
  ) => Promise<void>;
  getUserVideosCount: (
    req: TypedRequest<EmptyRecord>,
    res: Response
  ) => Promise<void>;
  getVideoByYoutubeId: (
    req: TypedRequest<EmptyRecord, IParamIdDto>,
    res: Response
  ) => Promise<void>;
}
