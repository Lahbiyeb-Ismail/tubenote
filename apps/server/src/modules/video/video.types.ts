import type { EmptyRecord, TypedRequest } from "@/types";
import type { Response } from "express";

import type { CreateVideoDto, FindVideoDto, Video } from "@modules/video";

import type { FindManyDto } from "@common/dtos/find-many.dto";
import type { IdParamDto } from "@common/dtos/id-param.dto";
import type { QueryPaginationDto } from "@common/dtos/query-pagination.dto";

export interface UserVideos {
  videos: Video[];
  videosCount: number;
  totalPages: number;
}

export interface IVideoRepository {
  transaction<T>(fn: (tx: IVideoRepository) => Promise<T>): Promise<T>;
  findByYoutubeId(youtubeId: string): Promise<Video | null>;
  findMany(findManyDto: FindManyDto): Promise<Video[]>;
  count(userId: string): Promise<number>;
  create(createVideoDto: CreateVideoDto): Promise<Video>;
  connectVideoToUser(videoId: string, userId: string): Promise<Video>;
}

export interface IVideoService {
  findVideoOrCreate(findVideoDto: FindVideoDto): Promise<Video>;
  getUserVideos(findManyDto: FindManyDto): Promise<UserVideos>;
}

export interface IVideoController {
  getUserVideos(
    req: TypedRequest<EmptyRecord, EmptyRecord, QueryPaginationDto>,
    res: Response
  ): Promise<void>;
  getVideoByIdOrCreate(
    req: TypedRequest<EmptyRecord, IdParamDto>,
    res: Response
  ): Promise<void>;
}
