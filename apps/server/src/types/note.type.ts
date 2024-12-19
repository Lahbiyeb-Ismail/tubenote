import type { Note, Prisma } from "@prisma/client";

import type {
  noteBodySchema,
  noteIdParamSchema,
  updateNoteBodySchema,
} from "../schemas/note.schema";

import type { INoteId, IPagination, IUserId } from "./shared.types";

export type NoteBody = typeof noteBodySchema;

export type UpdateNoteBody = typeof updateNoteBodySchema;

export type NoteIdParam = typeof noteIdParamSchema;

export interface NoteSortingOptions {
  orderBy?:
    | Prisma.NoteOrderByWithRelationInput
    | Prisma.NoteOrderByWithRelationInput[];
}

export interface ICreateNote {
  data: Prisma.NoteCreateInput;
}
export interface INoteFilter {
  where: Prisma.NoteWhereInput;
}

export interface INoteFilterUnique {
  where: Prisma.NoteWhereUniqueInput;
}
export interface IFindNote extends IUserId, INoteId {}

export interface IUpdateNote extends INoteFilterUnique {
  data: Prisma.NoteUpdateInput;
}

export interface IDeleteNote extends IUserId, INoteId {}

export interface IFindNotes
  extends IPagination,
    NoteSortingOptions,
    INoteFilter {}

export interface IUserNotes {
  notes: Note[];
  notesCount: number;
  totalPages: number;
}
