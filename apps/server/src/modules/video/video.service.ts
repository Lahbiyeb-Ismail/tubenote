import type { Prisma, Video } from "@tubenote/db";
import type { IFindManyDto } from "@tubenote/dtos";
import type { IPaginatedData } from "@tubenote/types";

import { youtubeApiService } from "@tubenote/youtube-api";
import { inject, injectable } from "inversify";

import type { IPrismaService } from "@/modules/shared/services";

import { TYPES } from "@/config/inversify/types";
import { BadRequestError } from "@/modules/shared/api-errors";
import {
  ERROR_MESSAGES,
} from "@/modules/shared/constants";

import type { IVideoRepository, IVideoService } from "./video.types";

@injectable()
export class VideoService implements IVideoService {
  constructor(
    @inject(TYPES.VideoRepository) private _videoRepository: IVideoRepository,
    @inject(TYPES.PrismaService) private _prismaService: IPrismaService,
  ) {}

  private async _findVideoByYoutubeId(
    youtubeId: string,
    tx?: Prisma.TransactionClient,
  ): Promise<Video | null> {
    return this._videoRepository.findByYoutubeId(youtubeId, tx);
  }

  private async _createVideo(
    tx: Prisma.TransactionClient,
    userId: string,
    youtubeVideoId: string,
  ): Promise<Video> {
    const videoData = await youtubeApiService.getYoutubeVideoData(youtubeVideoId);

    return this._videoRepository.create(userId, videoData, tx);
  }

  private async _linkVideoToUser(
    tx: Prisma.TransactionClient,
    video: Video,
    userId: string,
  ): Promise<Video> {
    return this._videoRepository.connectVideoToUser(video.id, userId, tx);
  }

  async getUserVideos(
    userId: string,
    findManyDto: IFindManyDto,
  ): Promise<IPaginatedData<Video>> {
    return this._prismaService.transaction(async (tx) => {
      const data = await this._videoRepository.findMany(
        userId,
        findManyDto,
        tx,
      );

      const totalItems = await this._videoRepository.count(userId, tx);

      const totalPages = Math.ceil(totalItems / findManyDto.limit);
      return { data, totalItems, totalPages };
    });
  }

  async saveVideo(userId: string, videoYoutubeId: string): Promise<Video> {
    if (!videoYoutubeId || !userId) {
      throw new BadRequestError(ERROR_MESSAGES.BAD_REQUEST);
    }

    return this._prismaService.transaction(async (tx) => {
      const existingVideo = await this._findVideoByYoutubeId(
        videoYoutubeId,
        tx,
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

  async getVideoByYoutubeId(videoYoutubeId: string): Promise<Video | null> {
    return this._findVideoByYoutubeId(videoYoutubeId);
  }
}
