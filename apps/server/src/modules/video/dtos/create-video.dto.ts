import type { YoutubeVideoData } from "../video.type";

export interface CreateVideoDto {
  userId: string;
  youtubeVideoId: string;
  videoData: YoutubeVideoData;
}
