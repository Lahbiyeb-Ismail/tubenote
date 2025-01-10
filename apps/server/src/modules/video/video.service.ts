import { YOUTUBE_API_KEY, YOUTUBE_API_URL } from "../../constants";
import { ERROR_MESSAGES } from "../../constants/errorMessages";

import { BadRequestError, NotFoundError } from "../../errors";

import { IVideoDatabase } from "./video.db";

import type { VideoDto, YoutubeVideoData } from "./dtos/video.dto";
import type { UserVideos } from "./video.type";

import type { FindManyDto } from "../../common/dtos/find-many.dto";
import type { FindVideoDto } from "./dtos/find-video.dto";

export interface IVideoService {
  fetchYoutubeVideoData(youtubeId: string): Promise<YoutubeVideoData>;
  findVideoByYoutubeId(youtubeId: string): Promise<VideoDto | null>;
  createVideo(userId: string, youtubeVideoId: string): Promise<VideoDto>;
  linkVideoToUser(video: VideoDto, userId: string): Promise<VideoDto>;
  getUserVideos(findManyDto: FindManyDto): Promise<UserVideos>;
  findVideoOrCreate(findVideoDto: FindVideoDto): Promise<VideoDto>;
}

export class VideoService implements IVideoService {
  private videoDB: IVideoDatabase;

  constructor(videoDB: IVideoDatabase) {
    this.videoDB = videoDB;
  }

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

  async findVideoByYoutubeId(youtubeId: string): Promise<VideoDto | null> {
    const video = await this.videoDB.findByYoutubeId(youtubeId);

    return video;
  }

  async createVideo(userId: string, youtubeVideoId: string): Promise<VideoDto> {
    const videoData = await this.fetchYoutubeVideoData(youtubeVideoId);

    const newVideo = await this.videoDB.create({
      userId,
      youtubeVideoId,
      videoData,
    });

    return newVideo;
  }

  async linkVideoToUser(video: VideoDto, userId: string): Promise<VideoDto> {
    const updatedVideo = await this.videoDB.connectVideoToUser(
      video.id,
      userId
    );

    return updatedVideo;
  }

  async getUserVideos(findManyDto: FindManyDto): Promise<UserVideos> {
    const [videos, videosCount] = await Promise.all([
      this.videoDB.findMany(findManyDto),
      this.videoDB.count(findManyDto.userId),
    ]);

    const totalPages = Math.ceil(videosCount / findManyDto.limit);

    return { videos, videosCount, totalPages };
  }

  async findVideoOrCreate(findVideoDto: FindVideoDto): Promise<VideoDto> {
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
