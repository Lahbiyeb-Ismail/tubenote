import { NotFoundError } from "@/errors";
import { ERROR_MESSAGES } from "@constants/error-messages.contants";

import type {
  CreateNoteDto,
  DeleteNoteDto,
  FindNoteDto,
  FindNotesByVideoIdDto,
  INoteRepository,
  INoteService,
  Note,
  UpdateNoteDto,
  UserNotes,
} from "@modules/note";

import type { FindManyDto } from "@common/dtos/find-many.dto";

export class NoteService implements INoteService {
  constructor(private readonly _noteRepository: INoteRepository) {}

  private async _findNoteOrFail(findNoteDto: FindNoteDto): Promise<Note> {
    const note = await this._noteRepository.find(findNoteDto);

    if (!note) {
      throw new NotFoundError(ERROR_MESSAGES.RESOURCE_NOT_FOUND);
    }

    return note;
  }

  async findNote(findNoteDto: FindNoteDto): Promise<Note> {
    return await this._findNoteOrFail(findNoteDto);
  }

  async createNote(createNoteDto: CreateNoteDto): Promise<Note> {
    return await this._noteRepository.create(createNoteDto);
  }

  async updateNote(
    findNoteDto: FindNoteDto,
    updateNoteDto: UpdateNoteDto
  ): Promise<Note> {
    return await this._noteRepository.transaction(async (tx) => {
      await this._findNoteOrFail(findNoteDto);

      return tx.update(findNoteDto, updateNoteDto);
    });
  }

  async deleteNote(deleteNoteDto: DeleteNoteDto): Promise<Note> {
    return await this._noteRepository.transaction(async (tx) => {
      await this._findNoteOrFail(deleteNoteDto);

      return tx.delete(deleteNoteDto);
    });
  }

  async fetchUserNotes(findManyDto: FindManyDto): Promise<UserNotes> {
    return await this._noteRepository.transaction(async (tx) => {
      const notes = await tx.findMany(findManyDto);

      const notesCount = await tx.count(findManyDto.userId);

      const totalPages = Math.ceil(notesCount / findManyDto.limit);

      return { notes, notesCount, totalPages };
    });
  }

  async fetchRecentNotes(findManyDto: FindManyDto): Promise<Note[]> {
    return await this._noteRepository.findMany(findManyDto);
  }

  async fetchRecentlyUpdatedNotes(findManyDto: FindManyDto): Promise<Note[]> {
    return await this._noteRepository.findMany(findManyDto);
  }

  async fetchNotesByVideoId(dto: FindNotesByVideoIdDto): Promise<UserNotes> {
    return await this._noteRepository.transaction(async (tx) => {
      const [notes, notesCount] = await Promise.all([
        tx.findManyByVideoId(dto),
        tx.count(dto.userId),
      ]);

      const totalPages = Math.ceil(notesCount / dto.limit);

      return { notes, notesCount, totalPages };
    });
  }
}
