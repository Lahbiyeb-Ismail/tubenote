import NoteDB from "./noteDB";

import { ERROR_MESSAGES } from "../../constants/errorMessages";
import { NotFoundError } from "../../errors";

import type { FindManyParams } from "../../types/shared.types";
import type {
  CreateNoteParams,
  DeleteNoteParams,
  FindNoteParams,
  NoteEntry,
  UpdateNoteParams,
  UserNotes,
} from "./note.type";

class NoteService {
  async findNote({ userId, noteId }: FindNoteParams): Promise<NoteEntry> {
    const note = await NoteDB.find({ userId, noteId });

    if (!note) {
      throw new NotFoundError(ERROR_MESSAGES.RESOURCE_NOT_FOUND);
    }

    return note;
  }

  async addNewNote({ data }: CreateNoteParams): Promise<NoteEntry> {
    const note = await NoteDB.create({ data });

    return note;
  }

  async updateNote({
    userId,
    noteId,
    data,
  }: UpdateNoteParams): Promise<NoteEntry> {
    const note = await this.findNote({ userId, noteId });

    const updatedNote = await NoteDB.update({
      noteId: note.id,
      userId: note.userId,
      data,
    });

    return updatedNote;
  }

  async deleteNote({ userId, noteId }: DeleteNoteParams): Promise<void> {
    const note = await this.findNote({ userId, noteId });

    await NoteDB.delete({ userId: note.userId, noteId: note.id });
  }

  async fetchUserNotes({
    userId,
    skip,
    limit,
    sort,
  }: FindManyParams): Promise<UserNotes> {
    const [notes, notesCount] = await Promise.all([
      NoteDB.findMany({
        userId,
        skip,
        limit,
        sort,
      }),
      NoteDB.count(userId),
    ]);

    const totalPages = Math.ceil(notesCount / limit);

    return { notes, notesCount, totalPages };
  }

  async fetchRecentNotes({
    userId,
    limit,
    sort,
  }: FindManyParams): Promise<NoteEntry[]> {
    const recentNotes = await NoteDB.findMany({
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
    const recentlyUpdatedNotes = await NoteDB.findMany({
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
      NoteDB.findManyByVideoId({
        userId,
        videoId,
        skip,
        limit,
        sort,
      }),
      NoteDB.count(userId),
    ]);

    const totalPages = Math.ceil(notesCount / limit);

    return { notes, notesCount, totalPages };
  }
}

export default new NoteService();
