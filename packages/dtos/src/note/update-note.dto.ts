import type { ICreateNoteDto } from "./create-note.dto";

export interface IUpdateNoteDto
  extends Partial<Omit<ICreateNoteDto, "youtubeId">> {}
