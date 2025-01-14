import type { Response } from "express";
import type { EmptyRecord, TypedRequest } from "../../types";

import type { Video, YoutubeVideoData } from "./video.model";

import type { FindManyDto } from "../../common/dtos/find-many.dto";
import type { IdParamDto } from "../../common/dtos/id-param.dto";
import type { QueryPaginationDto } from "../../common/dtos/query-pagination.dto";

import type { CreateVideoDto } from "./dtos/create-video.dto";
import type { FindVideoDto } from "./dtos/find-video.dto";

export interface UserVideos {
  videos: Video[];
  videosCount: number;
  totalPages: number;
}

export interface IVideoRepository {
  findByYoutubeId(youtubeId: string): Promise<Video | null>;
  findMany(findManyDto: FindManyDto): Promise<Video[]>;
  count(userId: string): Promise<number>;
  create(createVideoDto: CreateVideoDto): Promise<Video>;
  connectVideoToUser(videoId: string, userId: string): Promise<Video>;
}

export interface IVideoService {
  fetchYoutubeVideoData(youtubeId: string): Promise<YoutubeVideoData>;
  findVideoByYoutubeId(youtubeId: string): Promise<Video | null>;
  createVideo(userId: string, youtubeVideoId: string): Promise<Video>;
  linkVideoToUser(video: Video, userId: string): Promise<Video>;
  getUserVideos(findManyDto: FindManyDto): Promise<UserVideos>;
  findVideoOrCreate(findVideoDto: FindVideoDto): Promise<Video>;
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
