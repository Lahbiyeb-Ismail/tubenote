export interface YouTubeVideoItem {
  snippet: {
    title: string;
    description: string;
    publishedAt: string;
    channelTitle: string;
    thumbnails: {
      high: {
        url: string;
        width: number;
        height: number;
      };
    };
  };
  player: {
    embedHtml: string;
  };
  statistics: {
    viewCount: string;
    likeCount: string;
    dislikeCount: string;
    favoriteCount: string;
    commentCount: string;
  };
}

export interface YouTubeAPIResponse {
  items: YouTubeVideoItem[];
}

export type VideoPart = 'snippet, statistics, player';

export interface Note {
  noteTitle: string;
  noteContent: string;
  videoTitle: string;
  videoThumbnail: string;
  userId: string;
  videoId: string;
}
