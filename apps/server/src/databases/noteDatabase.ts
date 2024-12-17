import type { Note, Prisma } from "@prisma/client";

import prismaClient from "../lib/prisma";
import handleAsyncOperation from "../utils/handleAsyncOperation";

class NoteDatabase {
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
}

export default new NoteDatabase();
