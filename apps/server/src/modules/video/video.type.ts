import type { VideoDto } from "./dtos/video.dto";

export interface UserVideos {
  videos: VideoDto[];
  videosCount: number;
  totalPages: number;
}
