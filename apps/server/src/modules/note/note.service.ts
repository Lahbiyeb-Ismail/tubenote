import { ERROR_MESSAGES } from "../../constants/errorMessages";
import { NotFoundError } from "../../errors";

import type { FindManyDto } from "../../common/dtos/find-many.dto";
import type { CreateNoteDto } from "./dtos/create-note.dto";
import type { DeleteNoteDto } from "./dtos/delete-note.dto";
import type { FindNoteDto } from "./dtos/find-note.dto";
import type { UpdateNoteDto } from "./dtos/update-note.dto";
import type { INoteDatabase } from "./note.db";
import type { NoteEntry, UserNotes } from "./note.type";

export interface INoteService {
  findNote(findNoteDto: FindNoteDto): Promise<NoteEntry>;
  createNote(userId: string, createNoteDto: CreateNoteDto): Promise<NoteEntry>;
  updateNote(
    findNoteDto: FindNoteDto,
    updateNoteDto: UpdateNoteDto
  ): Promise<NoteEntry>;
  deleteNote(deleteNoteDto: DeleteNoteDto): Promise<void>;
  fetchUserNotes(findManyDto: FindManyDto): Promise<UserNotes>;
  fetchRecentNotes(findManyDto: FindManyDto): Promise<NoteEntry[]>;
  fetchRecentlyUpdatedNotes(findManyDto: FindManyDto): Promise<NoteEntry[]>;
  fetchNotesByVideoId(id: string, findManyDto: FindManyDto): Promise<UserNotes>;
}

export class NoteService implements INoteService {
  private noteDB: INoteDatabase;

  constructor(noteDB: INoteDatabase) {
    this.noteDB = noteDB;
  }

  async findNote(findNoteDto: FindNoteDto): Promise<NoteEntry> {
    const note = await this.noteDB.find(findNoteDto);

    if (!note) {
      throw new NotFoundError(ERROR_MESSAGES.RESOURCE_NOT_FOUND);
    }

    return note;
  }

  async createNote(
    userId: string,
    createNoteDto: CreateNoteDto
  ): Promise<NoteEntry> {
    const note = await this.noteDB.create(userId, createNoteDto);

    return note;
  }

  async updateNote(
    findNoteDto: FindNoteDto,
    updateNoteDto: UpdateNoteDto
  ): Promise<NoteEntry> {
    await this.findNote(findNoteDto);

    const updatedNote = await this.noteDB.update(findNoteDto, updateNoteDto);

    return updatedNote;
  }

  async deleteNote(deleteNoteDto: DeleteNoteDto): Promise<void> {
    await this.findNote(deleteNoteDto);

    await this.noteDB.delete(deleteNoteDto);
  }

  async fetchUserNotes(findManyDto: FindManyDto): Promise<UserNotes> {
    const [notes, notesCount] = await Promise.all([
      this.noteDB.findMany(findManyDto),
      this.noteDB.count(findManyDto.userId),
    ]);

    const totalPages = Math.ceil(notesCount / findManyDto.limit);

    return { notes, notesCount, totalPages };
  }

  async fetchRecentNotes(findManyDto: FindManyDto): Promise<NoteEntry[]> {
    const recentNotes = await this.noteDB.findMany(findManyDto);

    return recentNotes;
  }

  async fetchRecentlyUpdatedNotes(
    findManyDto: FindManyDto
  ): Promise<NoteEntry[]> {
    const recentlyUpdatedNotes = await this.noteDB.findMany(findManyDto);

    return recentlyUpdatedNotes;
  }

  async fetchNotesByVideoId(
    id: string,
    findManyDto: FindManyDto
  ): Promise<UserNotes> {
    const [notes, notesCount] = await Promise.all([
      this.noteDB.findManyByVideoId(id, findManyDto),
      this.noteDB.count(findManyDto.userId),
    ]);

    const totalPages = Math.ceil(notesCount / findManyDto.limit);

    return { notes, notesCount, totalPages };
  }
}
