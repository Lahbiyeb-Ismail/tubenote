import type { EmptyRecord, TypedRequest } from "@modules/shared";
import type { Response } from "express";

import type { Video, YoutubeVideoData } from "@modules/video";

import type {
  ICreateDto,
  IFindAllDto,
  IFindUniqueDto,
  IPaginatedItems,
  IParamIdDto,
  IQueryPaginationDto,
} from "@modules/shared";

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
