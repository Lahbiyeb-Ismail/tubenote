import type { Response } from "express";

import type { EmptyRecord, TypedRequest } from "@/modules/shared/types";

import type {
  ICreateDto,
  IFindAllDto,
  IFindUniqueDto,
  IPaginatedItems,
  IParamIdDto,
  IQueryPaginationDto,
} from "@/modules/shared/dtos";

import type { Prisma } from "@prisma/client";
import type { Video, YoutubeVideoData } from "./video.model";

export interface IVideoRepository {
  findByYoutubeId(
    youtubeId: string,
    tx?: Prisma.TransactionClient
  ): Promise<Video | null>;
  findMany(
    findAllDto: IFindAllDto,
    tx?: Prisma.TransactionClient
  ): Promise<Video[]>;
  count(userId: string, tx?: Prisma.TransactionClient): Promise<number>;
  create(
    createVideoDto: ICreateDto<YoutubeVideoData>,
    tx?: Prisma.TransactionClient
  ): Promise<Video>;
  connectVideoToUser(
    videoId: string,
    userId: string,
    tx?: Prisma.TransactionClient
  ): Promise<Video>;
}

export interface IVideoService {
  getYoutubeVideoData(youtubeId: string): Promise<YoutubeVideoData>;
  findVideoOrCreate(findVideoDto: IFindUniqueDto): Promise<Video>;
  getUserVideos(findAllDto: IFindAllDto): Promise<IPaginatedItems<Video>>;
}

export interface IVideoController {
  getUserVideos(
    req: TypedRequest<EmptyRecord, EmptyRecord, IQueryPaginationDto>,
    res: Response
  ): Promise<void>;
  getVideoByIdOrCreate(
    req: TypedRequest<EmptyRecord, IParamIdDto>,
    res: Response
  ): Promise<void>;
}
