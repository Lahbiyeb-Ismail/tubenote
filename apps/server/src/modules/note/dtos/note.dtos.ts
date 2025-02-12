import type { FindManyDto } from "@/common/dtos/find-many.dto";
import type { Note } from "@modules/note";

/**
 * Data Transfer Object for creating a new note.
 * Excludes system-generated fields such as `id`, `createAt`, and `updatedAt`.
 */
export interface CreateNoteDto
  extends Omit<Note, "id" | "createdAt" | "updatedAt"> {}

/**
 * Data Transfer Object for updating an existing note.
 * Only allows updating of specific fields: `title`, `content`, and `timestamp`.
 */
export interface UpdateNoteDto
  extends Partial<Pick<Note, "title" | "content" | "timestamp">> {}

/**
 * Data Transfer Object for finding a specific note.
 * Contains the note identifier and the user identifier.
 */
export interface FindNoteDto {
  /**
   * The unique identifier of the note.
   */
  noteId: string;
  /**
   * The unique identifier of the user who owns the note.
   */
  userId: string;
}

/**
 * Data Transfer Object for deleting a note.
 * Contains the note identifier and the user identifier.
 */
export interface DeleteNoteDto {
  /**
   * The unique identifier of the note to be deleted.
   */
  noteId: string;
  /**
   * The unique identifier of the user who owns the note.
   */
  userId: string;
}

/**
 * Data Transfer Object for finding notes associated with a specific video.
 * Extends the pagination DTO to include pagination and sorting options, and adds the video identifier.
 */
export interface FindNotesByVideoIdDto extends FindManyDto {
  /**
   * The unique identifier of the video.
   */
  videoId: string;
}
