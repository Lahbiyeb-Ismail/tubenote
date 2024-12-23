import noteDB from "../databases/noteDB";

import { ERROR_MESSAGES } from "../constants/errorMessages";
import { NotFoundError } from "../errors";

import type {
  CreateNoteParams,
  DeleteNoteParams,
  FindNoteParams,
  NoteEntry,
  UpdateNoteParams,
  UserNotes,
} from "../types/note.type";
import type { FindManyParams } from "../types/shared.types";

class NoteService {
  async findNote({ userId, noteId }: FindNoteParams): Promise<NoteEntry> {
    const note = await noteDB.find({ userId, noteId });

    if (!note) {
      throw new NotFoundError(ERROR_MESSAGES.RESOURCE_NOT_FOUND);
    }

    return note;
  }

  async addNewNote({ data }: CreateNoteParams): Promise<NoteEntry> {
    const note = await noteDB.create({ data });

    return note;
  }

  async updateNote({
    userId,
    noteId,
    data,
  }: UpdateNoteParams): Promise<NoteEntry> {
    const note = await this.findNote({ userId, noteId });

    const updatedNote = await noteDB.update({
      noteId: note.id,
      userId: note.userId,
      data,
    });

    return updatedNote;
  }

  async deleteNote({ userId, noteId }: DeleteNoteParams): Promise<void> {
    const note = await this.findNote({ userId, noteId });

    await noteDB.delete({ userId: note.userId, noteId: note.id });
  }

  async fetchUserNotes({
    userId,
    skip,
    limit,
    sort,
  }: FindManyParams): Promise<UserNotes> {
    const [notes, notesCount] = await Promise.all([
      noteDB.findMany({
        userId,
        skip,
        limit,
        sort,
      }),
      noteDB.count(userId),
    ]);

    const totalPages = Math.ceil(notesCount / limit);

    return { notes, notesCount, totalPages };
  }

  async fetchRecentNotes({
    userId,
    limit,
    sort,
  }: FindManyParams): Promise<NoteEntry[]> {
    const recentNotes = await noteDB.findMany({
      userId,
      limit,
      sort,
    });

    return recentNotes;
  }

  async fetchRecentlyUpdatedNotes({
    userId,
    limit,
    sort,
  }: FindManyParams): Promise<NoteEntry[]> {
    const recentlyUpdatedNotes = await noteDB.findMany({
      userId,
      limit,
      sort,
    });

    return recentlyUpdatedNotes;
  }

  async fetchNotesByVideoId({
    userId,
    videoId,
    skip,
    limit,
    sort,
  }: FindManyParams & { videoId: string }): Promise<UserNotes> {
    const [notes, notesCount] = await Promise.all([
      noteDB.findManyByVideoId({
        userId,
        videoId,
        skip,
        limit,
        sort,
      }),
      noteDB.count(userId),
    ]);

    const totalPages = Math.ceil(notesCount / limit);

    return { notes, notesCount, totalPages };
  }
}

export default new NoteService();
