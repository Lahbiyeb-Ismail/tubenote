import { NotFoundError } from "@/errors";
import { ERROR_MESSAGES } from "@constants/error-messages.contants";

import type {
  CreateNoteDto,
  DeleteNoteDto,
  FindNoteDto,
  INoteRepository,
  INoteService,
  Note,
  UpdateNoteDto,
  UserNotes,
} from "@modules/note";

import type { FindManyDto } from "@common/dtos/find-many.dto";

export class NoteService implements INoteService {
  constructor(private readonly _noteRepository: INoteRepository) {}

  private async _findNoteOrFail(
    tx: INoteRepository,
    findNoteDto: FindNoteDto
  ): Promise<Note> {
    const note = await tx.find(findNoteDto);

    if (!note) {
      throw new NotFoundError(ERROR_MESSAGES.RESOURCE_NOT_FOUND);
    }

    return note;
  }

  async findNote(findNoteDto: FindNoteDto): Promise<Note> {
    const note = await this._noteRepository.find(findNoteDto);

    if (!note) {
      throw new NotFoundError(ERROR_MESSAGES.RESOURCE_NOT_FOUND);
    }

    return note;
  }

  async createNote(createNoteDto: CreateNoteDto): Promise<Note> {
    const note = await this._noteRepository.create(createNoteDto);

    return note;
  }

  async updateNote(
    findNoteDto: FindNoteDto,
    updateNoteDto: UpdateNoteDto
  ): Promise<Note> {
    const updatedNote = await this._noteRepository.transaction(async (tx) => {
      await this._findNoteOrFail(tx, findNoteDto);

      return tx.update(findNoteDto, updateNoteDto);
    });

    return updatedNote;
  }

  async deleteNote(deleteNoteDto: DeleteNoteDto): Promise<Note> {
    const deletedNote = await this._noteRepository.transaction(async (tx) => {
      await this._findNoteOrFail(tx, deleteNoteDto);

      return tx.delete(deleteNoteDto);
    });

    return deletedNote;
  }

  async fetchUserNotes(findManyDto: FindManyDto): Promise<UserNotes> {
    const paginatedNotes = await this._noteRepository.transaction(
      async (tx) => {
        const notes = await tx.findMany(findManyDto);

        const notesCount = await tx.count(findManyDto.userId);

        const totalPages = Math.ceil(notesCount / findManyDto.limit);

        return { notes, notesCount, totalPages };
      }
    );

    return paginatedNotes;
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
    const paginatedNotes = await this._noteRepository.transaction(
      async (tx) => {
        const notes = await tx.findManyByVideoId(id, findManyDto);

        const notesCount = await tx.count(findManyDto.userId);

        const totalPages = Math.ceil(notesCount / findManyDto.limit);

        return { notes, notesCount, totalPages };
      }
    );

    return paginatedNotes;
  }
}
