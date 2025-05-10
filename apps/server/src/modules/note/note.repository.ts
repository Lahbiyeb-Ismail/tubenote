import type { Prisma } from "@prisma/client";
import { inject, injectable } from "inversify";

import type {
  ICreateNoteDto,
  IFindManyDto,
  IUpdateNoteDto,
} from "@tubenote/dtos";
import type { Note } from "@tubenote/types";

import { TYPES } from "@/config/inversify/types";

import { ERROR_MESSAGES } from "@/modules/shared/constants";
import { handleAsyncOperation } from "@/modules/shared/utils";

import type { IPrismaService } from "@/modules/shared/services";

import type { INoteRepository } from "./note.types";

/**
 * Repository for performing CRUD operations on Notes.
 *
 * Implements the INoteRepository interface to provide a set of methods to interact with the note data
 * via the PrismaClient. It uses a utility function for handling asynchronous operations with standardized
 * error messaging.
 */
@injectable()
export class NoteRepository implements INoteRepository {
  /**
   * Creates an instance of NoteRepository.
   *
   * @param _db - An instance of PrismaClient for database operations.
   */
  constructor(
    @inject(TYPES.PrismaService) private readonly _db: IPrismaService
  ) {}

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
   * @param data - The DTO containing the data required to create a note.
   * @param tx - Optional transaction client for database operations.
   *
   * @returns A Promise that resolves with the created Note.
   */
  async create(
    userId: string,
    videoId: string,
    data: ICreateNoteDto,
    tx?: Prisma.TransactionClient
  ): Promise<Note> {
    const client = tx ?? this._db;

    return handleAsyncOperation(
      () =>
        client.note.create({
          data: {
            userId,
            videoId,
            ...data,
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
   * @param data - The DTO containing the data to update the note.
   * @param tx - Optional transaction client for database operations.
   *
   * @returns {Promise<Note>} - A promise that resolves to the updated note.
   * @throws {Error} - Throws an error if the update operation fails.
   */
  async update(
    userId: string,
    noteId: string,
    data: IUpdateNoteDto,
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
          data,
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
   * @param userId - The ID of the user whose notes are to be fetched.
   * @param findManyDto - The DTO containing pagination and sorting options.
   *
   * @returns A Promise that resolves with an array of Notes.
   */
  async findMany(
    userId: string,
    findManyDto: IFindManyDto,
    tx?: Prisma.TransactionClient
  ): Promise<Note[]> {
    const client = tx ?? this._db;

    const { limit, sort, skip } = findManyDto;

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
   * @param userId - The ID of the user whose notes are to be fetched.
   * @param videoId - The ID of the video associated with the notes.
   * @param findManyDto - The DTO containing pagination and sorting options.
   *
   * @returns A Promise that resolves with an array of Notes associated with the given video ID.
   */
  async findManyByVideoId(
    userId: string,
    videoId: string,
    findManyDto: IFindManyDto,
    tx?: Prisma.TransactionClient
  ): Promise<Note[]> {
    const client = tx ?? this._db;

    const { limit, sort, skip } = findManyDto;

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
