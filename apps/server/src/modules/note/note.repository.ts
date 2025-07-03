import type { Note, Prisma } from "@tubenote/db";
import type {
  ICreateNoteDto,
  IFindManyDto,
  ISearchAndPaginationQueryDto,
  IUpdateNoteDto,
} from "@tubenote/dtos";

import { ERROR_MESSAGES } from "@tubenote/api-errors";
import { inject, injectable } from "inversify";

import type { IPrismaService } from "@/modules/shared/services";

import { TYPES } from "@/config/inversify/types";
import { handleAsyncOperation } from "@/modules/shared/utils";

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
    @inject(TYPES.PrismaService) private readonly _db: IPrismaService,
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
    tx?: Prisma.TransactionClient,
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
      { errorMessage: ERROR_MESSAGES.FAILED_TO_FIND },
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
    tx?: Prisma.TransactionClient,
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
      { errorMessage: ERROR_MESSAGES.FAILED_TO_CREATE },
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
    tx?: Prisma.TransactionClient,
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
      { errorMessage: ERROR_MESSAGES.FAILED_TO_UPDATE },
    );
  }

  /**
   * Deletes a note.
   *
   * @param userId - The ID of the user who owns the note.
   * @param noteId - The ID of the note to delete.
   * @param tx - Optional transaction client for database operations.
   *
   * @returns A Promise that resolves with the deleted Note.
   */
  async delete(
    userId: string,
    noteId: string,
    tx?: Prisma.TransactionClient,
  ): Promise<Note> {
    const client = tx ?? this._db;

    return handleAsyncOperation(
      () =>
        client.note.delete({
          where: { id: noteId, userId },
        }),
      { errorMessage: ERROR_MESSAGES.FAILED_TO_DELETE },
    );
  }

  /**
   * Retrieves multiple notes for a given user with pagination and sorting options.
   *
   * @param userId - The ID of the user whose notes are to be fetched.
   * @param queryOptions - Data transfer object containing pagination and sorting parameters.
   *                      This includes parameters like `limit`, `page`, `sortBy`, and `order`.
   *                      The `q` parameter is used for searching notes by title, content,
   *                      or tags.
   *
   * @returns A Promise that resolves with an array of Notes.
   */
  async findMany(
    userId: string,
    queryOptions: ISearchAndPaginationQueryDto,
    tx?: Prisma.TransactionClient,
  ): Promise<Note[]> {
    const client = tx ?? this._db;

    const { limit, order, page, sortBy, q: searchQuery } = queryOptions;

    const skip = (page - 1) * limit;

    return handleAsyncOperation(
      () =>
        client.note.findMany({
          where: {
            userId,
            OR: [
              {
                title: {
                  contains: searchQuery,
                  mode: "insensitive", // Case-insensitive search
                },
              },
              {
                content: {
                  contains: searchQuery,
                  mode: "insensitive", // Case-insensitive search
                },
              },
              {
                tags: {
                  has: searchQuery, // Check if array contains the exact query
                },
              },
            ],
          },
          take: limit,
          skip,
          orderBy: {
            [sortBy]: order,
          },
        }),
      { errorMessage: "Failed to fetch user notes." },
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
    tx?: Prisma.TransactionClient,
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
      { errorMessage: "Failed to fetch user notes." },
    );
  }

  /**
   * Counts the number of notes for a given user.
   *
   * @param userId - The ID of the user whose notes are to be counted.
   * @param searchQuery - Optional search query to filter notes by title, content, or tags.
   * @param tx - Optional Prisma transaction client for database operations.
   *
   * @returns A Promise that resolves with the count of notes.
   */
  async count(userId: string, searchQuery?: string, tx?: Prisma.TransactionClient): Promise<number> {
    const client = tx ?? this._db;

    return handleAsyncOperation(
      () =>
        client.note.count({
          where: {
            userId,
            OR: [
              {
                title: {
                  contains: searchQuery,
                  mode: "insensitive", // Case-insensitive search
                },
              },
              {
                content: {
                  contains: searchQuery,
                  mode: "insensitive", // Case-insensitive search
                },
              },
              {
                tags: {
                  has: searchQuery, // Check if array contains the exact query
                },
              },
            ],
          },
        }),
      { errorMessage: "Failed to count notes." },
    );
  }

  /**
   * Counts the total number of notes associated with a specific video for a given user.
   *
   * @param userId - The unique identifier of the user whose notes are being counted
   * @param ytVideoId - The YouTube video ID to count notes for
   * @param tx - Optional Prisma transaction client for database operations
   * @returns A promise that resolves to the total count of notes for the specified user and video
   * @throws Will throw an error if the database operation fails
   */
  async countByYtVideoId(
    userId: string,
    ytVideoId: string,
    tx?: Prisma.TransactionClient,
  ): Promise<number> {
    const client = tx ?? this._db;

    return handleAsyncOperation(
      () =>
        client.note.count({
          where: {
            userId,
            youtubeId: ytVideoId,
          },
        }),
      { errorMessage: "Failed to count notes." },
    );
  }

  /**
   * Searches for notes based on a query string.
   *
   * @param userId - The unique identifier of the user.
   * @param query - The search query.
   * @param findManyDto - Data transfer object containing pagination and sorting parameters.
   * @param tx - Optional transaction client for database operations.
   *
   * @returns A promise that resolves to an array of notes.
   */
  async search(
    userId: string,
    query: string,
    findManyDto: IFindManyDto,
    tx?: Prisma.TransactionClient,
  ): Promise<Note[]> {
    const client = tx ?? this._db;

    const { limit, sort, skip } = findManyDto;

    return handleAsyncOperation(
      () =>
        client.note.findMany({
          where: {
            userId,
            OR: [
              {
                title: {
                  contains: query,
                  mode: "insensitive", // Case-insensitive search
                },
              },
              {
                content: {
                  contains: query,
                  mode: "insensitive", // Case-insensitive search
                },
              },
              {
                tags: {
                  has: query, // Check if array contains the exact query
                },
              },
            ],
          },
          take: limit,
          skip,
          orderBy: {
            [sort.by]: sort.order,
          },
        }),
      { errorMessage: "Failed to search notes." },
    );
  }
}
