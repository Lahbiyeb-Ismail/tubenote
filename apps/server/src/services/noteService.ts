import type { Note, Prisma } from "@prisma/client";

import noteDatabase from "../databases/noteDatabase";

class NoteService {
  async addNewNote(noteData: Prisma.NoteCreateInput): Promise<Note> {
    const note = await noteDatabase.create(noteData);

    return note;
  }
}

export default new NoteService();
