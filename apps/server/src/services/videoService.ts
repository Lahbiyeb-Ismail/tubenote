import type { Video } from "@prisma/client";
import videoDatabase, {
  type IFindMany,
  type IVideo,
} from "../databases/videoDatabase";
import { NotFoundError } from "../errors";
import { fetchYoutubeVideoData } from "../helpers/video.helper";

class VideoService {
  async fetchUserVideos({ userId, limit, skip }: IFindMany): Promise<{
    videos: IVideo[];
    videosCount: number;
    totalPages: number;
  }> {
    const [videos, videosCount] = await Promise.all([
      videoDatabase.findMany({ userId, limit, skip }),
      videoDatabase.count(userId),
    ]);

    const totalPages = Math.ceil(videosCount / limit);

    return { videos, videosCount, totalPages };
  }

  async find({
    videoId,
    userId,
  }: { videoId: string; userId: string }): Promise<IVideo> {
    const video = await videoDatabase.findUnique(videoId);

    if (video) {
      return await this.linkVideoToUser(video, userId);
    }

    if (!video) {
      const youtubeVideoData = await fetchYoutubeVideoData(videoId);

      if (!youtubeVideoData.length) {
        throw new NotFoundError("No video found.");
      }

      const newVideo = await videoDatabase.create(youtubeVideoData[0], userId);

      return await this.linkVideoToUser(newVideo, userId);
    }

    return video;
  }

  async linkVideoToUser(video: Video, userId: string): Promise<Video> {
    if (video.userIds.includes(userId)) {
      return video;
    }

    const updatedVideo = await videoDatabase.connectVideoToUser(
      video.id,
      userId
    );

    return updatedVideo;
  }
}

export default new VideoService();
