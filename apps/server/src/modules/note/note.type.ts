export interface NoteEntry {
  id: string;
  userId: string;
  videoId: string;
  youtubeId: string;
  title: string;
  content: string;
  videoTitle: string;
  thumbnail: string;
  timestamp: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserNotes {
  notes: NoteEntry[];
  notesCount: number;
  totalPages: number;
}
