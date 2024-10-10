import type { ReactNode } from 'react';

export type Video = {
  id: string;
  youtubeId: string;
  userId: string;
  snippet: Snippet;
  statistics: Statistics;
  player: Player;
};

type Snippet = {
  publishedAt: string;
  channelId: string;
  title: string;
  description: string;
  channelTitle: string;
  tags: string[];
  categoryId: string;
  liveBroadcastContent: string;
  defaultAudioLanguage: string;
  thumbnails: Thumbnails;
};

type Thumbnails = {
  default: ThumbnailSize;
  medium: ThumbnailSize;
  high: ThumbnailSize;
  standard: ThumbnailSize;
  maxres: ThumbnailSize;
};

type ThumbnailSize = {
  url: string;
  width: number;
  height: number;
};

type Statistics = {
  viewCount: string;
  likeCount: string;
  favoriteCount: string;
  commentCount: string;
};

type Player = {
  embedHtml: string;
};

export type VideoProviderProps = {
  children: ReactNode;
};

export type VideoState = {
  video: Video | null;
  message: string | null;
  success: boolean;
};

export type VideoContextType = {
  state: VideoState;
  saveVideo: (videoUrl: string) => void;
  isLoading: boolean;
};

export type VideoAction =
  | {
      type: 'SAVE_VIDEO_SUCCESS';
      payload: { message: string; video: Video; success: true };
    }
  | { type: 'SAVE_VIDEO_FAIL'; payload: { message: string; success: false } };
