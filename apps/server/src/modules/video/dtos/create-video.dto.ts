import type { YoutubeVideoData } from "../dtos/video.dto";

export interface CreateVideoDto {
  userId: string;
  youtubeVideoId: string;
  videoData: YoutubeVideoData;
}
