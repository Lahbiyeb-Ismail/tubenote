import NoteDB from "./note.db";

import { ERROR_MESSAGES } from "../../constants/errorMessages";
import { NotFoundError } from "../../errors";

import type { FindManyDto } from "../../common/dtos/find-many.dto";
import type { CreateNoteDto } from "./dtos/create-note.dto";
import type { DeleteNoteDto } from "./dtos/delete-note.dto";
import type { FindNoteDto } from "./dtos/find-note.dto";
import type { UpdateNoteDto } from "./dtos/update-note.dto";
import type { NoteEntry, UserNotes } from "./note.type";

class NoteService {
  async findNote(findNoteDto: FindNoteDto): Promise<NoteEntry> {
    const note = await NoteDB.find(findNoteDto);

    if (!note) {
      throw new NotFoundError(ERROR_MESSAGES.RESOURCE_NOT_FOUND);
    }

    return note;
  }

  async createNote(
    userId: string,
    createNoteDto: CreateNoteDto
  ): Promise<NoteEntry> {
    const note = await NoteDB.create(userId, createNoteDto);

    return note;
  }

  async updateNote(
    findNoteDto: FindNoteDto,
    updateNoteDto: UpdateNoteDto
  ): Promise<NoteEntry> {
    await this.findNote(findNoteDto);

    const updatedNote = await NoteDB.update(findNoteDto, updateNoteDto);

    return updatedNote;
  }

  async deleteNote(deleteNoteDto: DeleteNoteDto): Promise<void> {
    await this.findNote(deleteNoteDto);

    await NoteDB.delete(deleteNoteDto);
  }

  async fetchUserNotes(findManyDto: FindManyDto): Promise<UserNotes> {
    const [notes, notesCount] = await Promise.all([
      NoteDB.findMany(findManyDto),
      NoteDB.count(findManyDto.userId),
    ]);

    const totalPages = Math.ceil(notesCount / findManyDto.limit);

    return { notes, notesCount, totalPages };
  }

  async fetchRecentNotes(findManyDto: FindManyDto): Promise<NoteEntry[]> {
    const recentNotes = await NoteDB.findMany(findManyDto);

    return recentNotes;
  }

  async fetchRecentlyUpdatedNotes(
    findManyDto: FindManyDto
  ): Promise<NoteEntry[]> {
    const recentlyUpdatedNotes = await NoteDB.findMany(findManyDto);

    return recentlyUpdatedNotes;
  }

  async fetchNotesByVideoId(
    id: string,
    findManyDto: FindManyDto
  ): Promise<UserNotes> {
    const [notes, notesCount] = await Promise.all([
      NoteDB.findManyByVideoId(id, findManyDto),
      NoteDB.count(findManyDto.userId),
    ]);

    const totalPages = Math.ceil(notesCount / findManyDto.limit);

    return { notes, notesCount, totalPages };
  }
}

export default new NoteService();
