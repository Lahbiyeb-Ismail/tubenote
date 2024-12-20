import type { Video } from "@prisma/client";

import videoDB, { type IFindMany, type IVideo } from "../databases/videoDB";

import { fetchYoutubeVideoData } from "../helpers/video.helper";

import { NotFoundError } from "../errors";

class VideoService {
  async fetchUserVideos({ userId, limit, skip }: IFindMany): Promise<{
    videos: IVideo[];
    videosCount: number;
    totalPages: number;
  }> {
    const [videos, videosCount] = await Promise.all([
      videoDB.findMany({ userId, limit, skip }),
      videoDB.count(userId),
    ]);

    const totalPages = Math.ceil(videosCount / limit);

    return { videos, videosCount, totalPages };
  }

  async find({
    videoId,
    userId,
  }: { videoId: string; userId: string }): Promise<IVideo> {
    const video = await videoDB.findUnique(videoId);

    if (video) {
      return await this.linkVideoToUser(video, userId);
    }

    if (!video) {
      const youtubeVideoData = await fetchYoutubeVideoData(videoId);

      if (!youtubeVideoData.length) {
        throw new NotFoundError("No video found.");
      }

      const newVideo = await videoDB.create(youtubeVideoData[0], userId);

      return await this.linkVideoToUser(newVideo, userId);
    }

    return video;
  }

  async linkVideoToUser(video: Video, userId: string): Promise<Video> {
    if (video.userIds.includes(userId)) {
      return video;
    }

    const updatedVideo = await videoDB.connectVideoToUser(video.id, userId);

    return updatedVideo;
  }
}

export default new VideoService();
