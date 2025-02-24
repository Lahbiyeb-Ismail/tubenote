import type { EmptyRecord, TypedRequest } from "@/types";
import type { Response } from "express";

import type { FindVideoDto, Video, YoutubeVideoData } from "@modules/video";

import type { PaginatedItems } from "@/common/dtos/paginated-items.dto";
import type { IdParamDto } from "@common/dtos/id-param.dto";
import type { QueryPaginationDto } from "@common/dtos/query-pagination.dto";
import type { ICreateDto, IFindAllDto } from "@modules/shared";

export interface IVideoRepository {
  transaction<T>(fn: (tx: IVideoRepository) => Promise<T>): Promise<T>;
  findByYoutubeId(youtubeId: string): Promise<Video | null>;
  findMany(findAllDto: IFindAllDto): Promise<Video[]>;
  count(userId: string): Promise<number>;
  create(createVideoDto: ICreateDto<YoutubeVideoData>): Promise<Video>;
  connectVideoToUser(videoId: string, userId: string): Promise<Video>;
}

export interface IVideoService {
  getYoutubeVideoData(youtubeId: string): Promise<YoutubeVideoData>;
  findVideoOrCreate(findVideoDto: FindVideoDto): Promise<Video>;
  getUserVideos(findAllDto: IFindAllDto): Promise<PaginatedItems<Video>>;
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
