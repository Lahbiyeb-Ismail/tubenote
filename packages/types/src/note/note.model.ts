/**
 * Represents a note associated with a user and a video.
 *
 * @property {string} id - Unique identifier for the note.
 * @property {string} userId - Unique identifier of the user who created the note.
 * @property {string} videoId - Identifier for the video associated with the note.
 * @property {string} youtubeId - YouTube-specific identifier for the video.
 * @property {string} title - Title of the note.
 * @property {string} content - Detailed content of the note.
 * @property {string} videoTitle - Title of the associated video.
 * @property {string} thumbnail - URL or identifier for the video's thumbnail image.
 * @property {number} timestamp - Numeric value representing a specific time related to the note (e.g., when the note was taken or referenced).
 * @property {Date} createdAt - Date and time when the note was created.
 * @property {Date} updatedAt - Date and time when the note was last updated.
 */
export interface Note {
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
