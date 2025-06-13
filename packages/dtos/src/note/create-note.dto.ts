export interface ICreateNoteDto {
  title: string;
  content: string;
  videoTitle: string;
  youtubeId: string;
  thumbnail: string;
  tags: string[];
  category: string | null;
  timestamp: Timestamp;
  isPublic?: boolean;
}

export interface Timestamp {
  start: number;
  end: number;
}
