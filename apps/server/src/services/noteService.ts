import type { Note } from "@prisma/client";

import noteDB from "../databases/noteDB";

import { NotFoundError } from "../errors";

import type {
  ICreateNote,
  IFindNotes,
  INoteFilterUnique,
  IUpdateNote,
  IUserNotes,
} from "../types/note.type";

class NoteService {
  async findNote({ where }: INoteFilterUnique): Promise<Note> {
    const note = await noteDB.find({ where });

    if (!note) {
      throw new NotFoundError("Note not found.");
    }

    return note;
  }

  async addNewNote({ data }: ICreateNote): Promise<Note> {
    const note = await noteDB.create({ data });

    return note;
  }

  async updateNote({ where, data }: IUpdateNote): Promise<Note> {
    await this.findNote({ where });

    const updatedNote = await noteDB.update({
      where,
      data,
    });

    return updatedNote;
  }

  async deleteNote({ where }: INoteFilterUnique): Promise<void> {
    await this.findNote({ where });

    await noteDB.delete({ where });
  }

  async fetchUserNotes({
    where,
    skip,
    limit,
  }: IFindNotes): Promise<IUserNotes> {
    const [notes, notesCount] = await Promise.all([
      noteDB.findMany({ where, skip, limit }),
      noteDB.count({ where }),
    ]);

    const totalPages = Math.ceil(notesCount / limit);

    return { notes, notesCount, totalPages };
  }

  async fetchRecentNotes({
    where,
    limit,
    orderBy,
  }: IFindNotes): Promise<Note[]> {
    const recentNotes = await noteDB.findMany({
      where,
      limit,
      orderBy,
    });

    return recentNotes;
  }

  async fetchRecentlyUpdatedNotes({
    where,
    limit,
    orderBy,
  }: IFindNotes): Promise<Note[]> {
    const recentlyUpdatedNotes = await noteDB.findMany({
      where,
      limit,
      orderBy,
    });

    return recentlyUpdatedNotes;
  }

  async fetchNotesByVideoId({
    where,
    skip,
    limit,
  }: IFindNotes): Promise<IUserNotes> {
    const [notes, notesCount] = await Promise.all([
      noteDB.findMany({
        where,
        skip,
        limit,
      }),
      noteDB.count({ where }),
    ]);

    const totalPages = Math.ceil(notesCount / limit);

    return { notes, notesCount, totalPages };
  }
}

export default new NoteService();
