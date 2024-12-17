import type { Note, Prisma } from "@prisma/client";

import noteDatabase, {
  type IDeleteNote,
  type IUpdateNote,
} from "../databases/noteDatabase";
import { NotFoundError } from "../errors";

class NoteService {
  async addNewNote(noteData: Prisma.NoteCreateInput): Promise<Note> {
    const note = await noteDatabase.create(noteData);

    return note;
  }

  async updateNote({ noteId, userId, data }: IUpdateNote): Promise<Note> {
    const note = await noteDatabase.find({ noteId, userId });

    if (!note) {
      throw new NotFoundError("Note not found.");
    }

    const updatedNote = await noteDatabase.update({
      noteId,
      userId,
      data,
    });

    return updatedNote;
  }

  async deleteNote({ noteId, userId }: IDeleteNote): Promise<void> {
    const note = await noteDatabase.find({ noteId, userId });

    if (!note) {
      throw new NotFoundError("Note not found.");
    }

    await noteDatabase.delete({ noteId, userId });
  }
}

export default new NoteService();
