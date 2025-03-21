import { ERROR_MESSAGES } from "@/modules/shared/constants";
import { handleAsyncOperation } from "@/modules/shared/utils";

import type {
  ICreateDto,
  IDeleteDto,
  IFindAllDto,
  IFindUniqueDto,
  IUpdateDto,
} from "@/modules/shared/dtos";
import type { IPrismaService } from "@/modules/shared/services";

import type { Prisma } from "@prisma/client";
import type { Note } from "./note.model";
import type { INoteRepository, INoteRepositoryOptions } from "./note.types";

/**
 * Repository for performing CRUD operations on Notes.
 *
 * Implements the INoteRepository interface to provide a set of methods to interact with the note data
 * via the PrismaClient. It uses a utility function for handling asynchronous operations with standardized
 * error messaging.
 */
export class NoteRepository implements INoteRepository {
  private static _instance: NoteRepository;

  /**
   * Creates an instance of NoteRepository.
   *
   * @param _db - An instance of PrismaClient for database operations.
   */
  private constructor(private readonly _db: IPrismaService) {}

  /**
   * Gets the singleton instance of NoteRepository.
   *
   * @param db - An instance of PrismaClient for database operations.
   * @returns The singleton instance of NoteRepository.
   */
  public static getInstance(options: INoteRepositoryOptions): NoteRepository {
    if (!this._instance) {
      this._instance = new NoteRepository(options.db);
    }
    return this._instance;
  }

  /**
   * Finds a single note based on the provided criteria.
   *
   * @param findNoteDto - The DTO containing noteId and userId to locate the note.
   * @returns A Promise that resolves with the found Note or null if no note matches the criteria.
   */
  async find(
    findNoteDto: IFindUniqueDto,
    tx?: Prisma.TransactionClient
  ): Promise<Note | null> {
    const client = tx ?? this._db;

    const { id, userId } = findNoteDto;

    return handleAsyncOperation(
      () =>
        client.note.findUnique({
          where: {
            id,
            userId,
          },
        }),
      { errorMessage: ERROR_MESSAGES.FAILED_TO_FIND }
    );
  }

  /**
   * Creates a new note.
   *
   * @param createNoteDto - The DTO containing the data required to create a note.
   * @returns A Promise that resolves with the created Note.
   */
  async create(
    createNoteDto: ICreateDto<Note>,
    tx?: Prisma.TransactionClient
  ): Promise<Note> {
    const client = tx ?? this._db;

    return handleAsyncOperation(
      () =>
        client.note.create({
          data: {
            ...createNoteDto.data,
            userId: createNoteDto.userId,
          },
        }),
      { errorMessage: ERROR_MESSAGES.FAILED_TO_CREATE }
    );
  }

  /**
   * Updates a note in the database.
   *
   * @param {IUpdateDto<Note>} updateNoteDto - The data transfer object containing the note's ID, user ID, and the data to update.
   * @returns {Promise<Note>} - A promise that resolves to the updated note.
   * @throws {Error} - Throws an error if the update operation fails.
   */
  async update(
    updateNoteDto: IUpdateDto<Note>,
    tx?: Prisma.TransactionClient
  ): Promise<Note> {
    const client = tx ?? this._db;

    const { id, userId, data } = updateNoteDto;

    return handleAsyncOperation(
      () =>
        client.note.update({
          where: {
            id,
            userId,
          },
          data,
        }),
      { errorMessage: ERROR_MESSAGES.FAILED_TO_UPDATE }
    );
  }

  /**
   * Deletes a note.
   *
   * @param deleteNoteDto - The DTO containing noteId and userId to locate the note.
   * @returns A Promise that resolves with the deleted Note.
   */
  async delete(
    deleteNoteDto: IDeleteDto,
    tx?: Prisma.TransactionClient
  ): Promise<Note> {
    const client = tx ?? this._db;

    const { id, userId } = deleteNoteDto;

    return handleAsyncOperation(
      () =>
        client.note.delete({
          where: { id, userId },
        }),
      { errorMessage: ERROR_MESSAGES.FAILED_TO_DELETE }
    );
  }

  /**
   * Retrieves multiple notes for a given user with pagination and sorting options.
   *
   * @param findManyDto - The DTO containing userId, limit, sort options, and skip value.
   * @returns A Promise that resolves with an array of Notes.
   */
  async findMany(
    findManyDto: IFindAllDto,
    tx?: Prisma.TransactionClient
  ): Promise<Note[]> {
    const client = tx ?? this._db;

    const { userId, limit, sort, skip = 0 } = findManyDto;

    return handleAsyncOperation(
      () =>
        client.note.findMany({
          where: {
            userId,
          },
          take: limit,
          skip,
          orderBy: {
            [sort.by]: sort.order,
          },
        }),
      { errorMessage: "Failed to fetch user notes." }
    );
  }

  /**
   * Retrieves multiple notes for a given user filtered by video ID with pagination and sorting options.
   *
   * @param dto - The DTO containing videoId, userId, limit, sort options, and skip value.
   * @returns A Promise that resolves with an array of Notes associated with the given video ID.
   */
  async findManyByVideoId(
    dto: IFindAllDto & { videoId: string },
    tx?: Prisma.TransactionClient
  ): Promise<Note[]> {
    const client = tx ?? this._db;

    const { videoId, userId, limit, sort, skip = 0 } = dto;

    return handleAsyncOperation(
      () =>
        client.note.findMany({
          where: {
            userId,
            youtubeId: videoId,
          },
          take: limit,
          skip,
          orderBy: {
            [sort.by]: sort.order,
          },
        }),
      { errorMessage: "Failed to fetch user notes." }
    );
  }

  /**
   * Counts the number of notes for a given user.
   *
   * @param userId - The ID of the user whose notes are to be counted.
   * @returns A Promise that resolves with the count of notes.
   */
  async count(userId: string, tx?: Prisma.TransactionClient): Promise<number> {
    const client = tx ?? this._db;

    return handleAsyncOperation(
      () =>
        client.note.count({
          where: {
            userId,
          },
        }),
      { errorMessage: "Failed to count notes." }
    );
  }
}
