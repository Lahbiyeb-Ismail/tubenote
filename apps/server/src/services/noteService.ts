import type { Note } from "@prisma/client";

import noteDatabase from "../databases/noteDatabase";

import { NotFoundError } from "../errors";

import type {
  ICreateNote,
  IFindNotes,
  INoteFilter,
  INoteFilterUnique,
  IUpdateNote,
  IUserNotes,
} from "../types/note.type";

class NoteService {
  async findNote({ where }: INoteFilterUnique): Promise<Note> {
    const note = await noteDatabase.find({ where });

    if (!note) {
      throw new NotFoundError("Note not found.");
    }

    return note;
  }

  async addNewNote({ data }: ICreateNote): Promise<Note> {
    const note = await noteDatabase.create({ data });

    return note;
  }

  async updateNote({ where, data }: IUpdateNote): Promise<Note> {
    await this.findNote({ where });

    const updatedNote = await noteDatabase.update({
      where,
      data,
    });

    return updatedNote;
  }

  async deleteNote({ where }: INoteFilterUnique): Promise<void> {
    await this.findNote({ where });

    await noteDatabase.delete({ where });
  }

  async fetchUserNotes({
    where,
    skip,
    limit,
  }: IFindNotes): Promise<IUserNotes> {
    const [notes, notesCount] = await Promise.all([
      noteDatabase.findMany({ where, skip, limit }),
      noteDatabase.count({ where }),
    ]);

    const totalPages = Math.ceil(notesCount / limit);

    return { notes, notesCount, totalPages };
  }

  async fetchRecentNotes({
    where,
    limit,
    orderBy,
  }: IFindNotes): Promise<Note[]> {
    const recentNotes = await noteDatabase.findMany({
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
    const recentlyUpdatedNotes = await noteDatabase.findMany({
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
      noteDatabase.findMany({
        where,
        skip,
        limit,
      }),
      noteDatabase.count({ where }),
    ]);

    const totalPages = Math.ceil(notesCount / limit);

    return { notes, notesCount, totalPages };
  }
}

export default new NoteService();
