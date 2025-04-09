import type { Prisma } from "@prisma/client";
import type { Response } from "express";

import type { ICreateVideoDto, IFindManyDto } from "@tubenote/dtos";
import type { Video, YoutubeVideoData } from "@tubenote/types";

import type { EmptyRecord, TypedRequest } from "@/modules/shared/types";

import type {
  IPaginatedData,
  IParamIdDto,
  IQueryPaginationDto,
} from "@/modules/shared/dtos";

import type {
  IPrismaService,
  IResponseFormatter,
} from "@/modules/shared/services";

export interface IVideoRepository {
  findByYoutubeId(
    youtubeId: string,
    tx?: Prisma.TransactionClient
  ): Promise<Video | null>;
  findMany(
    userId: string,
    findManyDto: IFindManyDto,
    tx?: Prisma.TransactionClient
  ): Promise<Video[]>;
  count(userId: string, tx?: Prisma.TransactionClient): Promise<number>;
  create(
    userId: string,
    data: ICreateVideoDto,
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
  findVideoOrCreate(userId: string, videoYoutubeId: string): Promise<Video>;
  getUserVideos(
    userId: string,
    findManyDto: IFindManyDto
  ): Promise<IPaginatedData<Video>>;
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

export interface IVideoRepositoryOptions {
  db: IPrismaService;
}

export interface IVideoServiceOptions {
  videoRepository: IVideoRepository;
  prismaService: IPrismaService;
}

export interface IVideoControllerOptions {
  responseFormatter: IResponseFormatter;
  videoService: IVideoService;
}
