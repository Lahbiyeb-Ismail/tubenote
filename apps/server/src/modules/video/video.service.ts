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

  async findVideoByYoutubeId(youtubeId: string): Promise<Video | null> {
    return this._videoRepository.findByYoutubeId(youtubeId);
  }

  async createVideo(userId: string, youtubeVideoId: string): Promise<Video> {
    const videoData = await this._getYoutubeVideoData(youtubeVideoId);

    return this._videoRepository.create({
      userId,
      youtubeVideoId,
      videoData,
    });
  }

  async linkVideoToUser(video: Video, userId: string): Promise<Video> {
    return this._videoRepository.connectVideoToUser(video.id, userId);
  }

  async getUserVideos(findManyDto: FindManyDto): Promise<UserVideos> {
    const [videos, videosCount] = await Promise.all([
      this._videoRepository.findMany(findManyDto),
      this._videoRepository.count(findManyDto.userId),
    ]);

    const totalPages = Math.ceil(videosCount / findManyDto.limit);

    return { videos, videosCount, totalPages };
  }

  async findVideoOrCreate(findVideoDto: FindVideoDto): Promise<Video> {
    const { userId, youtubeVideoId } = findVideoDto;

    if (!youtubeVideoId || !userId) {
      throw new BadRequestError(ERROR_MESSAGES.BAD_REQUEST);
    }

    const existingVideo = await this.findVideoByYoutubeId(youtubeVideoId);

    if (!existingVideo) {
      // If video doesn't exist, create it.
      return this.createVideo(userId, youtubeVideoId);
    }

    if (existingVideo.userIds?.includes(userId)) {
      // If video is already linked to the user, return it.
      return existingVideo;
    }

    // Otherwise, link the existing video to the user.
    return this.linkVideoToUser(existingVideo, userId);
  }
}
