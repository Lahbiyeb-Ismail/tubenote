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

  async fetchYoutubeVideoData(youtubeId: string): Promise<YoutubeVideoData> {
    const response = await fetch(
      `${YOUTUBE_API_URL}/videos?id=${youtubeId}&key=${YOUTUBE_API_KEY}&part=snippet,statistics,player`
    );

    if (!response.ok) {
      throw new BadRequestError(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (!data.items.length) {
      throw new NotFoundError(ERROR_MESSAGES.RESOURCE_NOT_FOUND);
    }

    return data.items[0];
  }

  async findVideoByYoutubeId(youtubeId: string): Promise<Video | null> {
    const video = await this._videoRepository.findByYoutubeId(youtubeId);

    return video;
  }

  async createVideo(userId: string, youtubeVideoId: string): Promise<Video> {
    const videoData = await this.fetchYoutubeVideoData(youtubeVideoId);

    const newVideo = await this._videoRepository.create({
      userId,
      youtubeVideoId,
      videoData,
    });

    return newVideo;
  }

  async linkVideoToUser(video: Video, userId: string): Promise<Video> {
    const updatedVideo = await this._videoRepository.connectVideoToUser(
      video.id,
      userId
    );

    return updatedVideo;
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

    const video = await this.findVideoByYoutubeId(youtubeVideoId);

    if (!video) {
      return await this.createVideo(userId, youtubeVideoId);
    }

    if (video && video.userIds && video.userIds.includes(userId)) return video;

    return await this.linkVideoToUser(video, userId);
  }
}
