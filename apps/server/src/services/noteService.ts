import type { Note, Prisma } from "@prisma/client";

import noteDatabase, {
  type IDeleteNote,
  type IFindMany,
  type IFindNote,
  type IUpdateNote,
} from "../databases/noteDatabase";
import { NotFoundError } from "../errors";

class NoteService {
  async findNote({ noteId, userId }: IFindNote): Promise<Note> {
    const note = await noteDatabase.find({ noteId, userId });

    if (!note) {
      throw new NotFoundError("Note not found.");
    }

    return note;
  }

  async addNewNote(noteData: Prisma.NoteCreateInput): Promise<Note> {
    const note = await noteDatabase.create(noteData);

    return note;
  }

  async updateNote({ noteId, userId, data }: IUpdateNote): Promise<Note> {
    await this.findNote({ userId, noteId });

    const updatedNote = await noteDatabase.update({
      noteId,
      userId,
      data,
    });

    return updatedNote;
  }

  async deleteNote({ noteId, userId }: IDeleteNote): Promise<void> {
    await this.findNote({ userId, noteId });

    await noteDatabase.delete({ noteId, userId });
  }

  async fetchUserNotes({ userId, skip, limit }: IFindMany): Promise<{
    notes: Note[];
    notesCount: number;
    totalPages: number;
  }> {
    const [notes, notesCount] = await Promise.all([
      noteDatabase.findMany({ userId, skip, limit }),
      noteDatabase.count({ userId }),
    ]);

    const totalPages = Math.ceil(notesCount / limit);

    return { notes, notesCount, totalPages };
  }
}

export default new NoteService();
