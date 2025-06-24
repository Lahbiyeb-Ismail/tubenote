import type { Prisma, Video } from "@tubenote/db";
import type {
  ICreateVideoDto,
  IFindManyDto,
  IPaginationQueryDto,
  IParamIdDto,
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
    findManyDto: IFindManyDto,
    tx?: Prisma.TransactionClient
  ) => Promise<Video[]>;
  count: (userId: string, tx?: Prisma.TransactionClient) => Promise<number>;
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
    findManyDto: IFindManyDto
  ) => Promise<IPaginatedData<Video>>;
  getUserVideosCount: (userId: string) => Promise<number>;
  saveVideo: (userId: string, videoYoutubeId: string) => Promise<Video>;
  getVideoByYoutubeId: (videoYoutubeId: string) => Promise<Video | null>;
}

export interface IVideoController {
  getYoutubeVideoTranscript: (
    req: TypedRequest<EmptyRecord, IParamIdDto>,
    res: Response
  ) => Promise<void>;
  getUserVideos: (
    req: TypedRequest<EmptyRecord, EmptyRecord, IPaginationQueryDto>,
    res: Response
  ) => Promise<void>;
  getUserVideosCount: (
    req: TypedRequest<EmptyRecord>,
    res: Response
  ) => Promise<void>;
  saveVideoData: (
    req: TypedRequest<EmptyRecord, IParamIdDto>,
    res: Response
  ) => Promise<void>;
  getVideoByYoutubeId: (
    req: TypedRequest<EmptyRecord, IParamIdDto>,
    res: Response
  ) => Promise<void>;
}
