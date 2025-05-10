import type { Prisma } from "@prisma/client";
import { inject, injectable } from "inversify";

import type {
  ICreateNoteDto,
  IFindManyDto,
  IUpdateNoteDto,
} from "@tubenote/dtos";
import type { IPaginatedData, Note } from "@tubenote/types";

import { TYPES } from "@/config/inversify/types";

import { NotFoundError } from "@/modules/shared/api-errors";
import { ERROR_MESSAGES } from "@/modules/shared/constants";

import type { IPrismaService } from "@/modules/shared/services";

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
    @inject(TYPES.PrismaService) private _prismaService: IPrismaService
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
    tx?: Prisma.TransactionClient
  ): Promise<Note> {
    const note = await this._noteRepository.find(userId, noteId, tx);

    if (!note) {
      throw new NotFoundError(ERROR_MESSAGES.RESOURCE_NOT_FOUND);
    }

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
    tx?: Prisma.TransactionClient
  ): Promise<Note> {
    return await this._noteRepository.create(userId, videoId, data, tx);
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
    data: IUpdateNoteDto
  ): Promise<Note> {
    return await this._prismaService.transaction(async (tx) => {
      await this.findNote(userId, noteId, tx);

      return this._noteRepository.update(userId, noteId, data, tx);
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
      await this.findNote(userId, noteId, tx);

      return this._noteRepository.delete(userId, noteId, tx);
    });
  }

  /**
   * Fetches the notes for a user based on the provided criteria.
   *
   * @param userId - The unique identifier of the user.
   * @param findManyDto - The data transfer object containing the criteria for finding notes.
   *
   * @returns {Promise<IPaginatedData<Note>>} A promise that resolves to an object containing the paginated notes, total number of notes, and total pages.
   */
  async fetchUserNotes(
    userId: string,
    findManyDto: IFindManyDto
  ): Promise<IPaginatedData<Note>> {
    return await this._prismaService.transaction(async (tx) => {
      const data = await this._noteRepository.findMany(userId, findManyDto, tx);

      const totalItems = await this._noteRepository.count(userId, tx);

      const totalPages = Math.ceil(totalItems / findManyDto.limit);

      return { data, totalItems, totalPages };
    });
  }

  /**
   * Retrieves recent notes for a user.
   *
   * @param userId - The unique identifier of the user.
   * @param findManyDto - Data transfer object containing pagination, and sorting details.
   *
   * @returns {Promise<Note[]>} A promise that resolves to an array of recent notes.
   */
  async fetchRecentNotes(
    userId: string,
    findManyDto: IFindManyDto
  ): Promise<Note[]> {
    return await this._noteRepository.findMany(userId, findManyDto);
  }

  /**
   * Retrieves recently updated notes for a user.
   *
   * Note: This method currently uses the same repository method as fetchRecentNotes.
   *
   * @param userId - The unique identifier of the user.
   * @param findManyDto - Data transfer object containing pagination, and sorting details.
   *
   * @returns {Promise<Note[]>} A promise that resolves to an array of recently updated notes.
   */
  async fetchRecentlyUpdatedNotes(
    userId: string,
    findManyDto: IFindManyDto
  ): Promise<Note[]> {
    return await this._noteRepository.findMany(userId, findManyDto);
  }

  /**
   * Fetches notes associated with a specific video ID.
   *
   * @param dto - Data transfer object containing the video ID and pagination information.
   * @returns A promise that resolves to an object containing the paginated notes, total number of notes, and total pages.
   *
   * @template IFindManyDto - Interface for the data transfer object that includes pagination and user information.
   * @template IPaginatedData - Interface for the paginated items response.
   * @template Note - Type representing a note.
   */
  async fetchNotesByVideoId(
    userId: string,
    videoId: string,
    findManyDto: IFindManyDto
  ): Promise<IPaginatedData<Note>> {
    return await this._prismaService.transaction(async (tx) => {
      const data = await this._noteRepository.findManyByVideoId(
        userId,
        videoId,
        findManyDto,
        tx
      );

      const totalItems = await this._noteRepository.count(userId, tx);

      const totalPages = Math.ceil(totalItems / findManyDto.limit);

      return { data, totalItems, totalPages };
    });
  }
}
