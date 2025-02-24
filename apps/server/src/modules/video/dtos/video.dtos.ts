import type { YoutubeVideoData } from "@modules/video/video.model";

export interface CreateVideoDto {
  userId: string;
  videoData: YoutubeVideoData;
}

export interface FindVideoDto {
  youtubeVideoId: string;
  userId: string;
}
