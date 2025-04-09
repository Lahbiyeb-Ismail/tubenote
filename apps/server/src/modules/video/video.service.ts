import type { Prisma } from "@prisma/client";

import type { IFindManyDto } from "@tubenote/dtos";
import type { Video, YoutubeVideoData } from "@tubenote/types";

import {
  ERROR_MESSAGES,
  YOUTUBE_API_KEY,
  YOUTUBE_API_URL,
} from "@/modules/shared/constants";

import { BadRequestError, NotFoundError } from "@/modules/shared/api-errors";

import type { IPaginatedData } from "@/modules/shared/dtos";
import type { IPrismaService } from "@/modules/shared/services";

import type {
  IVideoRepository,
  IVideoService,
  IVideoServiceOptions,
} from "./video.types";

export class VideoService implements IVideoService {
  private static _instance: VideoService;

  private constructor(
    private readonly _videoRepository: IVideoRepository,
    private readonly _prismaService: IPrismaService
  ) {}

  public static getInstance(options: IVideoServiceOptions): VideoService {
    if (!this._instance) {
      this._instance = new VideoService(
        options.videoRepository,
        options.prismaService
      );
    }

    return this._instance;
  }

  private async _findVideoByYoutubeId(
    tx: Prisma.TransactionClient,
    youtubeId: string
  ): Promise<Video | null> {
    return this._videoRepository.findByYoutubeId(youtubeId, tx);
  }

  private async _createVideo(
    tx: Prisma.TransactionClient,
    userId: string,
    youtubeVideoId: string
  ): Promise<Video> {
    const videoData = await this.getYoutubeVideoData(youtubeVideoId);

    return this._videoRepository.create(userId, videoData, tx);
  }

  private async _linkVideoToUser(
    tx: Prisma.TransactionClient,
    video: Video,
    userId: string
  ): Promise<Video> {
    return this._videoRepository.connectVideoToUser(video.id, userId, tx);
  }

  async getYoutubeVideoData(youtubeId: string): Promise<YoutubeVideoData> {
    const response = await fetch(
      `${YOUTUBE_API_URL}/videos?id=${youtubeId}&key=${YOUTUBE_API_KEY}&part=snippet,statistics,player`
    );

    if (!response.ok) {
      throw new BadRequestError(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (!data?.items?.length) {
      throw new NotFoundError(ERROR_MESSAGES.RESOURCE_NOT_FOUND);
    }

    const { title, description, channelTitle, thumbnails, tags } =
      data.items[0].snippet;

    const { embedHtml: embedHtmlPlayer } = data.items[0].player;

    return {
      youtubeId: data.items[0].id,
      title,
      description,
      channelTitle,
      embedHtmlPlayer,
      tags,
      thumbnails,
    };
  }

  async getUserVideos(
    userId: string,
    findManyDto: IFindManyDto
  ): Promise<IPaginatedData<Video>> {
    return this._prismaService.transaction(async (tx) => {
      const data = await this._videoRepository.findMany(
        userId,
        findManyDto,
        tx
      );

      const totalItems = await this._videoRepository.count(userId, tx);

      const totalPages = Math.ceil(totalItems / findManyDto.limit);
      return { data, totalItems, totalPages };
    });
  }

  async findVideoOrCreate(
    userId: string,
    videoYoutubeId: string
  ): Promise<Video> {
    if (!videoYoutubeId || !userId) {
      throw new BadRequestError(ERROR_MESSAGES.BAD_REQUEST);
    }

    return this._prismaService.transaction(async (tx) => {
      const existingVideo = await this._findVideoByYoutubeId(
        tx,
        videoYoutubeId
      );

      if (!existingVideo) {
        // If video doesn't exist, create it.
        return this._createVideo(tx, userId, videoYoutubeId);
      }

      if (existingVideo.userIds?.includes(userId)) {
        // If video is already linked to the user, return it.
        return existingVideo;
      }

      // Otherwise, link the existing video to the user.
      return this._linkVideoToUser(tx, existingVideo, userId);
    });
  }
}
