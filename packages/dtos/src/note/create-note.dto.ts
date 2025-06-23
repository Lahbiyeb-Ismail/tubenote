/**
 * Data Transfer Object for creating a new note.
 * This interface defines the structure of data required to create a note associated with a YouTube video.
 */
export interface ICreateNoteDto {
  /** The title of the note */
  title: string;
  /** The content/body of the note */
  content: string;
  /** The title of the associated YouTube video */
  videoTitle: string;
  /** The URL or path to the thumbnail image of the video */
  thumbnail: string;
  /** The YouTube video identifier */
  youtubeId: string;
  /** Array of tags associated with the note for categorization and search */
  tags: string[];
  /** Optional category classification for the note */
  category?: string | null;
  /** Optional flag indicating whether the note is publicly accessible. Defaults to private if not specified */
  isPublic?: boolean;
  /** Timestamp representing when the note was created or the relevant point in the video */
  timestamp: Timestamp;
}

export interface Timestamp {
  start: number;
  end: number;
}
