import type { Note } from "@modules/note";

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
  title: string;
  description: string;
  channelTitle: string;
  tags: string[];
  embedHtmlPlayer: string;
  thumbnails: Thumbnails;
}

export interface Video extends YoutubeVideoData {
  id: string;
  youtubeId: string;
  createdAt: Date;
  updatedAt: Date;
  notes?: Note[];
  userIds?: string[];
}
