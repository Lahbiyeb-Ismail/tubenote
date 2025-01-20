import { NotFoundError } from "@/errors";
import { ERROR_MESSAGES } from "@constants/error-messages.contants";

import type { Note } from "./note.model";

import type { UserNotes } from "./note.types";
import type { INoteRepository, INoteService } from "./note.types";

import type { FindManyDto } from "@common/dtos/find-many.dto";
import type { CreateNoteDto } from "./dtos/create-note.dto";
import type { DeleteNoteDto } from "./dtos/delete-note.dto";
import type { FindNoteDto } from "./dtos/find-note.dto";
import type { UpdateNoteDto } from "./dtos/update-note.dto";

export class NoteService implements INoteService {
  constructor(private readonly _noteRepository: INoteRepository) {}

  async findNote(findNoteDto: FindNoteDto): Promise<Note> {
    const note = await this._noteRepository.find(findNoteDto);

    if (!note) {
      throw new NotFoundError(ERROR_MESSAGES.RESOURCE_NOT_FOUND);
    }

    return note;
  }

  async createNote(
    userId: string,
    createNoteDto: CreateNoteDto
  ): Promise<Note> {
    const note = await this._noteRepository.create(userId, createNoteDto);

    return note;
  }

  async updateNote(
    findNoteDto: FindNoteDto,
    updateNoteDto: UpdateNoteDto
  ): Promise<Note> {
    await this.findNote(findNoteDto);

    const updatedNote = await this._noteRepository.update(
      findNoteDto,
      updateNoteDto
    );

    return updatedNote;
  }

  async deleteNote(deleteNoteDto: DeleteNoteDto): Promise<void> {
    await this.findNote(deleteNoteDto);

    await this._noteRepository.delete(deleteNoteDto);
  }

  async fetchUserNotes(findManyDto: FindManyDto): Promise<UserNotes> {
    const [notes, notesCount] = await Promise.all([
      this._noteRepository.findMany(findManyDto),
      this._noteRepository.count(findManyDto.userId),
    ]);

    const totalPages = Math.ceil(notesCount / findManyDto.limit);

    return { notes, notesCount, totalPages };
  }

  async fetchRecentNotes(findManyDto: FindManyDto): Promise<Note[]> {
    const recentNotes = await this._noteRepository.findMany(findManyDto);

    return recentNotes;
  }

  async fetchRecentlyUpdatedNotes(findManyDto: FindManyDto): Promise<Note[]> {
    const recentlyUpdatedNotes =
      await this._noteRepository.findMany(findManyDto);

    return recentlyUpdatedNotes;
  }

  async fetchNotesByVideoId(
    id: string,
    findManyDto: FindManyDto
  ): Promise<UserNotes> {
    const [notes, notesCount] = await Promise.all([
      this._noteRepository.findManyByVideoId(id, findManyDto),
      this._noteRepository.count(findManyDto.userId),
    ]);

    const totalPages = Math.ceil(notesCount / findManyDto.limit);

    return { notes, notesCount, totalPages };
  }
}
