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
