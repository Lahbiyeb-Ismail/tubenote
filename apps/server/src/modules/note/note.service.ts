import type { Note, Prisma } from "@tubenote/db";
import type {
  ICreateNoteDto,
  IFindManyDto,
  ISearchAndPaginationQueryDto,
  IUpdateNoteDto,
} from "@tubenote/dtos";
import type { IPaginatedData } from "@tubenote/types";

import { ERROR_MESSAGES, NotFoundError } from "@tubenote/api-errors";
import { inject, injectable } from "inversify";

import type { ICacheService, IPrismaService } from "@/modules/shared/services";

import { TYPES } from "@/config/inversify/types";

import type { INoteRepository, INoteService } from "./note.types";

/**
 * Service class for handling business logic related to Notes.
 *
 * Provides methods to create, read, update, delete, and fetch notes with various filtering and pagination
 * options. It utilizes the NoteRepository to interact with the underlying data source and encapsulates
 * additional logic such as error handling and transaction management.
 */
@injectable()
export class NoteService implements INoteService {
  /**
   * Creates an instance of NoteService.
   *
   * @param _noteRepository - An instance of the note repository to delegate data operations.
   */
  constructor(
    @inject(TYPES.NoteRepository) private _noteRepository: INoteRepository,
    @inject(TYPES.PrismaService) private _prismaService: IPrismaService,
    @inject(TYPES.CacheService) private _cacheService: ICacheService,
  ) {}

  /**
   * Retrieves a note based on the given criteria.
   *
   * @param userId - The unique identifier of the user.
   * @param noteId - The unique identifier of the note to find.
   * @param tx - Optional transaction client for database operations.
   *
   * @returns {Promise<Note>} A promise that resolves to the found note.
   * @throws {NotFoundError} If no note is found matching the criteria.
   */
  async findNote(
    userId: string,
    noteId: string,
    tx?: Prisma.TransactionClient,
  ): Promise<Note> {
    const cacheKey = `note:${userId}:${noteId}`;
    const cachedNote = await this._cacheService.get<Note>(cacheKey);

    if (cachedNote) {
      return cachedNote;
    }

    const note = await this._noteRepository.find(userId, noteId, tx);

    if (!note) {
      throw new NotFoundError(ERROR_MESSAGES.RESOURCE_NOT_FOUND);
    }

    await this._cacheService.set(cacheKey, note, 60 * 60); // Cache for 1 hour

    return note;
  }

  /**
   * Creates a new note.
   *
   * @param userId - The unique identifier of the user.
   * @param videoId - The unique identifier of the video associated with the note.
   * @param data - The data transfer object containing the note details.
   * @param tx - Optional transaction client for database operations.
   *
   * @returns {Promise<Note>} A promise that resolves to the newly created note.
   */
  async createNote(
    userId: string,
    videoId: string,
    data: ICreateNoteDto,
    tx?: Prisma.TransactionClient,
  ): Promise<Note> {
    const note = await this._noteRepository.create(userId, videoId, data, tx);

    // Invalidate relevant caches
    await this._cacheService.del(`noteCount:${userId}:${videoId}`); // Invalidate note count for video

    return note;
  }

  /**
   * Updates a note with the provided data.
   *
   * @param {string} userId - The unique identifier of the user.
   * @param {string} noteId - The unique identifier of the note to update.
   * @param {IUpdateNoteDto} data - The data transfer object containing the note update information.
   *
   * @returns {Promise<Note>} - A promise that resolves to the updated note.
   * @throws {Error} - Throws an error if the note is not found.
   */
  async updateNote(
    userId: string,
    noteId: string,
    data: IUpdateNoteDto,
  ): Promise<Note> {
    return await this._prismaService.transaction(async (tx) => {
      const updatedNote = await this._noteRepository.update(userId, noteId, data, tx);

      // Invalidate relevant caches
      await this._cacheService.del(`note:${userId}:${noteId}`);

      return updatedNote;
    });
  }

  /**
   * Deletes an existing note.
   *
   * Executes the delete operation within a transaction. It first verifies the note's existence and then proceeds
   * with the deletion.
   *
   * @param userId - The unique identifier of the user.
   * @param noteId - The unique identifier of the note to delete.
   *
   * @returns {Promise<Note>} A promise that resolves to the deleted note.
   * @throws {NotFoundError} If the note is not found.
   */
  async deleteNote(userId: string, noteId: string): Promise<Note> {
    return await this._prismaService.transaction(async (tx) => {
      const deletedNote = await this._noteRepository.delete(userId, noteId, tx);

      // Invalidate relevant caches
      await this._cacheService.del(`note:${userId}:${noteId}`);
      await this._cacheService.del(`noteCount:${userId}:${deletedNote.videoId}`);

      return deletedNote;
    });
  }

  /**
   * Fetches the notes for a user based on the provided criteria.
   *
   * @param userId - The unique identifier of the user.
   * @param queryOptions - Data transfer object containing pagination and sorting parameters.
   *
   * @returns {Promise<IPaginatedData<Note>>} A promise that resolves to an object containing the paginated notes, total number of notes, and total pages.
   */
  async fetchUserNotes(
    userId: string,
    queryOptions: ISearchAndPaginationQueryDto,
  ): Promise<IPaginatedData<Note>> {
    return await this._prismaService.transaction(async (tx) => {
      const data = await this._noteRepository.findMany(userId, queryOptions, tx);

      const totalItems = await this._noteRepository.count(userId, queryOptions.q, tx);

      const totalPages = Math.ceil(totalItems / queryOptions.limit);

      return { data, totalItems, totalPages };
    });
  }

  /**
   * Fetches notes associated with a specific video ID.
   *
   * @param userId - The unique identifier of the user.
   * @param videoId - The unique identifier of the video.
   * @param findManyDto - The data transfer object containing pagination and sorting options.
   * @returns A promise that resolves to an object containing the paginated notes, total number of notes, and total pages.
   *
   * @template IFindManyDto - Interface for the data transfer object that includes pagination and user information.
   * @template IPaginatedData - Interface for the paginated items response.
   * @template Note - Type representing a note.
   */
  async fetchNotesByVideoId(
    userId: string,
    videoId: string,
    findManyDto: IFindManyDto,
  ): Promise<IPaginatedData<Note>> {
    return await this._prismaService.transaction(async (tx) => {
      const data = await this._noteRepository.findManyByVideoId(
        userId,
        videoId,
        findManyDto,
        tx,
      );

      const totalItems = await this._noteRepository.count(userId, "", tx);

      const totalPages = Math.ceil(totalItems / findManyDto.limit);

      return { data, totalItems, totalPages };
    });
  }

  /**
   * Retrieves the count of notes associated with a specific YouTube video for a given user.
   *
   * @param userId - The unique identifier of the user
   * @param ytVideoId - The YouTube video identifier
   * @returns A promise that resolves to the number of notes associated with the video
   *
   * @example
   * ```typescript
   * const noteCount = await noteService.getNotesCountByVideo('user123', 'dQw4w9WgXcQ');
   * console.log(`User has ${noteCount} notes for this video`);
   * ```
   */
  async fetchNotesCountByVideoId(userId: string, ytVideoId: string): Promise<number> {
    const cacheKey = `noteCount:${userId}:${ytVideoId}`;
    const cachedCount = await this._cacheService.get<number>(cacheKey);

    if (cachedCount !== undefined) {
      return cachedCount;
    }

    const count = await this._noteRepository.countByYtVideoId(userId, ytVideoId);

    await this._cacheService.set(cacheKey, count, 60 * 60); // Cache for 1 hour

    return count;
  }
}
