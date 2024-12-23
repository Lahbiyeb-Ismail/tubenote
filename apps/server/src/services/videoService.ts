import videoDB from "../databases/videoDB";

import { YOUTUBE_API_KEY, YOUTUBE_API_URL } from "../constants";

import { ERROR_MESSAGES } from "../constants/errorMessages";
import { BadRequestError, NotFoundError } from "../errors";
import type {
  FindUserVideosParams,
  FindVideoParams,
  UserVideos,
  VideoEntry,
} from "../types/video.type";

class VideoService {
  private async fetchYoutubeVideoData(videoId: string): Promise<any> {
    const response = await fetch(
      `${YOUTUBE_API_URL}/videos?id=${videoId}&key=${YOUTUBE_API_KEY}&part=snippet,statistics,player`
    );

    if (!response.ok) {
      throw new BadRequestError(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    return data.items;
  }

  async findUserVideos({
    userId,
    limit,
    skip,
  }: FindUserVideosParams): Promise<UserVideos> {
    const [videos, videosCount] = await Promise.all([
      videoDB.findMany({ userId, limit, skip }),
      videoDB.count(userId),
    ]);

    const totalPages = Math.ceil(videosCount / limit);

    return { videos, videosCount, totalPages };
  }

  async findVideoById({
    videoId,
    userId,
  }: FindVideoParams): Promise<VideoEntry> {
    const video = await videoDB.findById(videoId);

    if (video) {
      return await this.linkVideoToUser(video, userId);
    }

    if (!video) {
      const youtubeVideoData = await this.fetchYoutubeVideoData(videoId);

      if (!youtubeVideoData.length) {
        throw new NotFoundError(ERROR_MESSAGES.RESOURCE_NOT_FOUND);
      }

      const newVideo = await videoDB.create({
        videoData: youtubeVideoData[0],
        userId,
      });

      return await this.linkVideoToUser(newVideo, userId);
    }

    return video;
  }

  async linkVideoToUser(
    video: VideoEntry,
    userId: string
  ): Promise<VideoEntry> {
    if (video.userIds && video.userIds.includes(userId)) {
      return video;
    }

    const updatedVideo = await videoDB.connectVideoToUser(video.id, userId);

    return updatedVideo;
  }
}

export default new VideoService();
