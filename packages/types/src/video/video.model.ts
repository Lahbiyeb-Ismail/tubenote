interface Thumbnails {
  default: ThumbnailSize;
  medium: ThumbnailSize;
  high: ThumbnailSize;
  standard: ThumbnailSize;
  maxres: ThumbnailSize;
}

interface ThumbnailSize {
  url: string;
  width: number;
  height: number;
}

export interface YoutubeVideoData {
  youtubeId: string;
  title: string;
  description: string;
  channelTitle: string;
  tags: string[];
  embedHtmlPlayer: string;
  thumbnails: Thumbnails;
}
