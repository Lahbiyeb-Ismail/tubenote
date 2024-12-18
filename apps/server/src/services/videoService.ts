import videoDatabase, {
  type IFindMany,
  type IVideo,
} from "../databases/videoDatabase";

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
}

export default new VideoService();
