import type { searchFormSchema } from "@/schemas";
import { z } from "zod";

export type SearchFormType = z.infer<typeof searchFormSchema>;

export type VideoDataResponseType = {
  id: string;
  title: string;
  description: string;
  videoPlayer: string;
  videoUrlId: string;
  channelTitle: string;
  publishedAt: string;
  viewCount: string;
  likeCount: string;
  dislikeCount: string;
  commentCount: string;
  favoriteCount: string;
  videoThumbnail: string;
};

export type Note = {
  title: string;
  videoId: string;
  content?: string;
};

export type UserDataType = {
  id: string;
  username: string;
  email: string | null;
  picture: string | null;
  userId: string;
};
