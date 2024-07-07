import type { noteTitleFormSchema, searchFormSchema } from "@/schemas";
import type { z } from "zod";

export type SearchFormType = z.infer<typeof searchFormSchema>;

export type NoteTitleType = z.infer<typeof noteTitleFormSchema>;

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
  id: string;
  noteTitle: string;
  noteContent: string;
  videoId: string;
  userId: string;
  videoTitle: string;
  videoThumbnail: string;
  createdAt: string;
};

export type UserDataType = {
  id: string;
  username: string;
  email: string | null;
  picture: string | null;
  userId: string;
};
