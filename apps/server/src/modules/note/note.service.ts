import type { Prisma } from "@prisma/client";

import type { ICreateNoteDto, IUpdateNoteDto, Note } from "@tubenote/shared";

import { NotFoundError } from "@/modules/shared/api-errors";
import { ERROR_MESSAGES } from "@/modules/shared/constants";

import type { IPrismaService } from "@/modules/shared/services";

import type { IFindAllDto, IPaginatedData } from "@/modules/shared/dtos";

import type {
  INoteRepository,
  INoteService,
  INoteServiceOptions,
} from "./note.types";

/**
 * Service class for handling business logic related to Notes.
 *
 * Provides methods to create, read, update, delete, and fetch notes with various filtering and pagination
 * options. It utilizes the NoteRepository to interact with the underlying data source and encapsulates
 * additional logic such as error handling and transaction management.
 */
export class NoteService implements INoteService {
  private static _instance: NoteService;

  /**
   * Creates an instance of NoteService.
   *
   * @param _noteRepository - An instance of the note repository to delegate data operations.
   */
  private constructor(
    private readonly _noteRepository: INoteRepository,
    private readonly _prismaService: IPrismaService
  ) {}

  public static getInstance(options: INoteServiceOptions): NoteService {
    if (!this._instance) {
      this._instance = new NoteService(
        options.noteRepository,
        options.prismaService
      );
    }
    return this._instance;
  }

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
   * @param createNoteDto - The data transfer object containing the note details.
   * @param tx - Optional transaction client for database operations.
   *
   * @returns {Promise<Note>} A promise that resolves to the newly created note.
   */
  async createNote(
    userId: string,
    videoId: string,
    createNoteDto: ICreateNoteDto,
    tx?: Prisma.TransactionClient
  ): Promise<Note> {
    return await this._noteRepository.create(
      userId,
      videoId,
      createNoteDto,
      tx
    );
  }

  /**
   * Updates a note with the provided data.
   *
   * @param {string} userId - The unique identifier of the user.
   * @param {string} noteId - The unique identifier of the note to update.
   * @param {IUpdateNoteDto} updateNoteDto - The data transfer object containing the note update information.
   *
   * @returns {Promise<Note>} - A promise that resolves to the updated note.
   * @throws {Error} - Throws an error if the note is not found.
   */
  async updateNote(
    userId: string,
    noteId: string,
    updateNoteDto: IUpdateNoteDto
  ): Promise<Note> {
    return await this._prismaService.transaction(async (tx) => {
      await this.findNote(userId, noteId, tx);

      return this._noteRepository.update(userId, noteId, updateNoteDto, tx);
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
   * @param {IFindAllDto} findManyDto - The data transfer object containing the criteria for finding notes.
   * @returns {Promise<IPaginatedData<Note>>} A promise that resolves to an object containing the paginated notes, total number of notes, and total pages.
   */
  async fetchUserNotes(
    findManyDto: IFindAllDto
  ): Promise<IPaginatedData<Note>> {
    return await this._prismaService.transaction(async (tx) => {
      const data = await this._noteRepository.findMany(findManyDto, tx);

      const totalItems = await this._noteRepository.count(
        findManyDto.userId,
        tx
      );

      const totalPages = Math.ceil(totalItems / findManyDto.limit);

      return { data, totalItems, totalPages };
    });
  }

  /**
   * Retrieves recent notes for a user.
   *
   * @param {FindManyDto} findManyDto - Data transfer object containing user id, pagination, and sorting details.
   * @returns {Promise<Note[]>} A promise that resolves to an array of recent notes.
   */
  async fetchRecentNotes(findManyDto: IFindAllDto): Promise<Note[]> {
    return await this._noteRepository.findMany(findManyDto);
  }

  /**
   * Retrieves recently updated notes for a user.
   *
   * Note: This method currently uses the same repository method as fetchRecentNotes.
   *
   * @param {FindManyDto} findManyDto - Data transfer object containing user id, pagination, and sorting details.
   * @returns {Promise<Note[]>} A promise that resolves to an array of recently updated notes.
   */
  async fetchRecentlyUpdatedNotes(findManyDto: IFindAllDto): Promise<Note[]> {
    return await this._noteRepository.findMany(findManyDto);
  }

  /**
   * Fetches notes associated with a specific video ID.
   *
   * @param dto - Data transfer object containing the video ID and pagination information.
   * @returns A promise that resolves to an object containing the paginated notes, total number of notes, and total pages.
   *
   * @template IFindAllDto - Interface for the data transfer object that includes pagination and user information.
   * @template IPaginatedData - Interface for the paginated items response.
   * @template Note - Type representing a note.
   */
  async fetchNotesByVideoId(
    dto: IFindAllDto & { videoId: string }
  ): Promise<IPaginatedData<Note>> {
    return await this._prismaService.transaction(async (tx) => {
      const data = await this._noteRepository.findManyByVideoId(dto, tx);

      const totalItems = await this._noteRepository.count(dto.userId, tx);

      const totalPages = Math.ceil(totalItems / dto.limit);

      return { data, totalItems, totalPages };
    });
  }
}
