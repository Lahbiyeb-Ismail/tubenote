import { YOUTUBE_API_KEY, YOUTUBE_API_URL } from "@constants/app.contants";
import { ERROR_MESSAGES } from "@constants/error-messages.contants";

import { BadRequestError, NotFoundError } from "@/errors";

import type { IFindAllDto, IFindUniqueDto } from "@modules/shared";
import type {
  IVideoRepository,
  IVideoService,
  Video,
  YoutubeVideoData,
} from "@modules/video";

import type { PaginatedItems } from "@/common/dtos/paginated-items.dto";

export class VideoService implements IVideoService {
  constructor(private readonly _videoRepository: IVideoRepository) {}

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
    const videoData = await this.getYoutubeVideoData(youtubeVideoId);

    return tx.create({
      userId,
      data: videoData,
    });
  }

  private async _linkVideoToUser(
    tx: IVideoRepository,
    video: Video,
    userId: string
  ): Promise<Video> {
    return tx.connectVideoToUser(video.id, userId);
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

  async getUserVideos(findAllDto: IFindAllDto): Promise<PaginatedItems<Video>> {
    return this._videoRepository.transaction(async (tx) => {
      const [items, totalItems] = await Promise.all([
        tx.findMany(findAllDto),
        tx.count(findAllDto.userId),
      ]);

      const totalPages = Math.ceil(totalItems / findAllDto.limit);
      return { items, totalItems, totalPages };
    });
  }

  async findVideoOrCreate(findVideoDto: IFindUniqueDto): Promise<Video> {
    const { userId, id: youtubeVideoId } = findVideoDto;

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
