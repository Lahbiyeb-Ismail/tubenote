import type { ICreateNoteDto } from "./create-note.dto";

/**
 * Interface for update note data transfer object (DTO).
 *
 * Represents the data structure for updating an existing note. It extends a partial
 * version of the ICreateNoteDto interface, omitting the "youtubeId" and "isPublic" properties,
 * which cannot be updated after creation.
 *
 * @remarks
 * This DTO is typically used in PATCH or PUT operations for updating note content.
 */
export interface IUpdateNoteDto
  extends Partial<Omit<ICreateNoteDto, "youtubeId" | "isPublic">> {}
