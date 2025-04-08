import type { Prisma } from "@prisma/client";

import type { ICreateNoteDto, IUpdateNoteDto, Note } from "@tubenote/shared/";

import { ERROR_MESSAGES } from "@/modules/shared/constants";
import { handleAsyncOperation } from "@/modules/shared/utils";

import type { IFindAllDto } from "@/modules/shared/dtos";
import type { IPrismaService } from "@/modules/shared/services";

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
   * @param userId - The ID of the user who owns the note.
   * @param noteId - The ID of the note to find.
   * @param tx - Optional transaction client for database operations.
   *
   * @returns A Promise that resolves with the found Note or null if no note matches the criteria.
   */
  async find(
    userId: string,
    noteId: string,
    tx?: Prisma.TransactionClient
  ): Promise<Note | null> {
    const client = tx ?? this._db;

    return handleAsyncOperation(
      () =>
        client.note.findUnique({
          where: {
            id: noteId,
            userId,
          },
        }),
      { errorMessage: ERROR_MESSAGES.FAILED_TO_FIND }
    );
  }

  /**
   * Creates a new note.
   *
   * @param userId - The ID of the user who owns the note.
   * @param videoId - The ID of the video associated with the note.
   * @param createNoteDto - The DTO containing the data required to create a note.
   * @param tx - Optional transaction client for database operations.
   *
   * @returns A Promise that resolves with the created Note.
   */
  async create(
    userId: string,
    videoId: string,
    createNoteDto: ICreateNoteDto,
    tx?: Prisma.TransactionClient
  ): Promise<Note> {
    const client = tx ?? this._db;

    return handleAsyncOperation(
      () =>
        client.note.create({
          data: {
            userId,
            videoId,
            ...createNoteDto,
          },
        }),
      { errorMessage: ERROR_MESSAGES.FAILED_TO_CREATE }
    );
  }

  /**
   * Updates a note in the database.
   *
   * @param userId - The ID of the user who owns the note.
   * @param noteId - The ID of the note to update.
   * @param updateNoteDto - The DTO containing the data to update the note.
   * @param tx - Optional transaction client for database operations.
   *
   * @returns {Promise<Note>} - A promise that resolves to the updated note.
   * @throws {Error} - Throws an error if the update operation fails.
   */
  async update(
    userId: string,
    noteId: string,
    updateNoteDto: IUpdateNoteDto,
    tx?: Prisma.TransactionClient
  ): Promise<Note> {
    const client = tx ?? this._db;

    return handleAsyncOperation(
      () =>
        client.note.update({
          where: {
            id: noteId,
            userId,
          },
          data: updateNoteDto,
        }),
      { errorMessage: ERROR_MESSAGES.FAILED_TO_UPDATE }
    );
  }

  /**
   * Deletes a note.
   *
   * @param userId - The ID of the user who owns the note.
   * @param noteId - The ID of the note to delete.
   * @param tx: Optional transaction client for database operations.
   *
   * @returns A Promise that resolves with the deleted Note.
   */
  async delete(
    userId: string,
    noteId: string,
    tx?: Prisma.TransactionClient
  ): Promise<Note> {
    const client = tx ?? this._db;

    return handleAsyncOperation(
      () =>
        client.note.delete({
          where: { id: noteId, userId },
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
