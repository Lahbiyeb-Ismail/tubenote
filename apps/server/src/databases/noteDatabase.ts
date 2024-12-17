import type { Note, Prisma } from "@prisma/client";

import prismaClient from "../lib/prisma";
import handleAsyncOperation from "../utils/handleAsyncOperation";

interface IUserId {
  userId: string;
}
interface INoteId {
  noteId: string;
}

export interface IUpdateNote extends IUserId, INoteId {
  data: Prisma.NoteUpdateInput;
}

export interface IDeleteNote extends IUserId, INoteId {}

class NoteDatabase {
  async find({ noteId, userId }: IUserId & INoteId): Promise<Note | null> {
    return handleAsyncOperation(
      () =>
        prismaClient.note.findFirst({
          where: {
            id: noteId,
            userId,
          },
        }),
      { errorMessage: "Failed to find note." }
    );
  }

  async create(noteData: Prisma.NoteCreateInput): Promise<Note> {
    return handleAsyncOperation(
      () =>
        prismaClient.note.create({
          data: {
            ...noteData,
          },
        }),
      { errorMessage: "Failed to create note." }
    );
  }

  async update({ userId, noteId, data }: IUpdateNote): Promise<Note> {
    return handleAsyncOperation(
      () =>
        prismaClient.note.update({
          where: {
            id: noteId,
            userId,
          },
          data,
        }),
      { errorMessage: "Failed to update note." }
    );
  }

  async delete({ userId, noteId }: IDeleteNote): Promise<void> {
    handleAsyncOperation(
      () =>
        prismaClient.note.delete({
          where: {
            id: noteId,
            userId,
          },
        }),
      { errorMessage: "Failed to delete note." }
    );
  }
}

export default new NoteDatabase();
