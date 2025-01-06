import type { NoteEntry } from "../note/note.type";

interface Snippet {
  publishedAt: string;
  channelId: string;
  title: string;
  description: string;
  channelTitle: string;
  categoryId: string;
  liveBroadcastContent: string;
  tags: string[];
  thumbnails: Thumbnails;
}

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

interface Statistics {
  viewCount: string;
  likeCount: string;
  favoriteCount: string;
  commentCount: string;
}

interface Player {
  embedHtml: string;
}

export interface YoutubeVideoData {
  snippet: Snippet;
  statistics: Statistics;
  player: Player;
}

export interface VideoEntry extends YoutubeVideoData {
  id: string;
  youtubeId: string;
  notes?: NoteEntry[];
  userIds?: string[];
}

export interface UserVideos {
  videos: VideoEntry[];
  videosCount: number;
  totalPages: number;
}
