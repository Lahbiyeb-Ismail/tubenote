export interface ICreateNoteDto {
  title: string;
  content: string;
  videoTitle: string;
  youtubeId: string;
  thumbnail: string;
  timestamp: Timestamp;
}

export interface Timestamp {
  start: number;
  end: number;
}
