import { YOUTUBE_API_KEY, YOUTUBE_API_URL } from "../../constants";

import { ERROR_MESSAGES } from "../../constants/errorMessages";
import { BadRequestError, NotFoundError } from "../../errors";
import type {
  FindUserVideosParams,
  FindVideoParams,
  UserVideos,
  VideoEntry,
  YoutubeVideoData,
} from "./video.type";

import VideoDB from "./videoDB";

class VideoService {
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

  async findUserVideos({
    userId,
    limit,
    skip,
  }: FindUserVideosParams): Promise<UserVideos> {
    const [videos, videosCount] = await Promise.all([
      VideoDB.findMany({ userId, limit, skip }),
      VideoDB.count(userId),
    ]);

    const totalPages = Math.ceil(videosCount / limit);

    return { videos, videosCount, totalPages };
  }

  async findVideoByYoutubeId(youtubeId: string): Promise<VideoEntry | null> {
    const video = await VideoDB.findByYoutubeId(youtubeId);

    return video;
  }

  async createVideo({
    userId,
    youtubeId,
  }: { userId: string; youtubeId: string }): Promise<VideoEntry> {
    const youtubeVideoData = await this.fetchYoutubeVideoData(youtubeId);

    const newVideo = await VideoDB.create({
      userId,
      videoData: youtubeVideoData,
      youtubeId,
    });

    return newVideo;
  }

  async linkVideoToUser(
    video: VideoEntry,
    userId: string
  ): Promise<VideoEntry> {
    const updatedVideo = await VideoDB.connectVideoToUser(video.id, userId);

    return updatedVideo;
  }

  async getVideoData({
    userId,
    youtubeId,
  }: { youtubeId: string; userId: string }): Promise<VideoEntry> {
    if (!youtubeId || !userId) {
      throw new BadRequestError(ERROR_MESSAGES.BAD_REQUEST);
    }

    const video = await this.findVideoByYoutubeId(youtubeId);

    if (video && video.userIds && video.userIds.includes(userId)) return video;

    if (video && video.userIds && !video.userIds.includes(userId)) {
      return await this.linkVideoToUser(video, userId);
    }

    const newVideo = await this.createVideo({ userId, youtubeId });

    return await this.linkVideoToUser(newVideo, userId);
  }
}

export default new VideoService();
