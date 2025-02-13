import { YOUTUBE_API_KEY, YOUTUBE_API_URL } from "@constants/app.contants";
import { ERROR_MESSAGES } from "@constants/error-messages.contants";

import { BadRequestError, NotFoundError } from "@/errors";

import type {
  FindVideoDto,
  IVideoRepository,
  IVideoService,
  UserVideos,
  Video,
  YoutubeVideoData,
} from "@modules/video";

import type { FindManyDto } from "@common/dtos/find-many.dto";

export class VideoService implements IVideoService {
  constructor(private readonly _videoRepository: IVideoRepository) {}

  private async _getYoutubeVideoData(
    youtubeId: string
  ): Promise<YoutubeVideoData> {
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

    return data.items[0];
  }

  private async _findVideoByYoutubeId(
    tx: IVideoRepository,
    youtubeId: string
  ): Promise<Video | null> {
    return tx.findByYoutubeId(youtubeId);
  }

  private async _createVideo(
    tx: IVideoRepository,
    userId: string,
    youtubeVideoId: string
  ): Promise<Video> {
    const videoData = await this._getYoutubeVideoData(youtubeVideoId);

    return tx.create({
      userId,
      youtubeVideoId,
      videoData,
    });
  }

  private async _linkVideoToUser(
    tx: IVideoRepository,
    video: Video,
    userId: string
  ): Promise<Video> {
    return tx.connectVideoToUser(video.id, userId);
  }

  async getUserVideos(findManyDto: FindManyDto): Promise<UserVideos> {
    return this._videoRepository.transaction(async (tx) => {
      const [videos, videosCount] = await Promise.all([
        tx.findMany(findManyDto),
        tx.count(findManyDto.userId),
      ]);

      const totalPages = Math.ceil(videosCount / findManyDto.limit);
      return { videos, videosCount, totalPages };
    });
  }

  async findVideoOrCreate(findVideoDto: FindVideoDto): Promise<Video> {
    const { userId, youtubeVideoId } = findVideoDto;

    if (!youtubeVideoId || !userId) {
      throw new BadRequestError(ERROR_MESSAGES.BAD_REQUEST);
    }

    return this._videoRepository.transaction(async (tx) => {
      const existingVideo = await this._findVideoByYoutubeId(
        tx,
        youtubeVideoId
      );

      if (!existingVideo) {
        // If video doesn't exist, create it.
        return this._createVideo(tx, userId, youtubeVideoId);
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
