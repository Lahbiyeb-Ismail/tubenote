import type { Prisma, PrismaClient } from "@prisma/client";

import { ERROR_MESSAGES } from "@/modules/shared/constants";
import type {
  ICreateDto,
  IDeleteDto,
  IFindAllDto,
  IFindUniqueDto,
  IUpdateDto,
} from "@/modules/shared/dtos";
import { handleAsyncOperation } from "@/modules/shared/utils";

import type { Note } from "./note.model";
import type { INoteRepository } from "./note.types";

/**
 * Repository for performing CRUD operations on Notes.
 *
 * Implements the INoteRepository interface to provide a set of methods to interact with the note data
 * via the PrismaClient. It uses a utility function for handling asynchronous operations with standardized
 * error messaging.
 */
export class NoteRepository implements INoteRepository {
  /**
   * Creates an instance of NoteRepository.
   *
   * @param _db - An instance of PrismaClient for database operations.
   */
  constructor(private readonly _db: PrismaClient) {}

  /**
   * Executes a set of operations within a transaction.
   *
   * This method uses Prisma's transaction API to run the provided function within a transactional scope.
   * A new instance of the repository is created with the transactional client to ensure that all operations
   * participate in the transaction.
   *
   * @template T - The type of the return value from the transactional operation.
   * @param fn - A function that takes an INoteRepository (transactional instance) and returns a Promise.
   * @returns A Promise that resolves with the result of the transactional function.
   */
  async transaction<T>(fn: (tx: INoteRepository) => Promise<T>): Promise<T> {
    return this._db.$transaction(async (prismaTx: Prisma.TransactionClient) => {
      const txRepository = new NoteRepository(prismaTx as PrismaClient);
      return await fn(txRepository);
    });
  }

  /**
   * Finds a single note based on the provided criteria.
   *
   * @param findNoteDto - The DTO containing noteId and userId to locate the note.
   * @returns A Promise that resolves with the found Note or null if no note matches the criteria.
   */
  async find(findNoteDto: IFindUniqueDto): Promise<Note | null> {
    const { id, userId } = findNoteDto;

    return handleAsyncOperation(
      () =>
        this._db.note.findUnique({
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
  async create(createNoteDto: ICreateDto<Note>): Promise<Note> {
    return handleAsyncOperation(
      () =>
        this._db.note.create({
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
  async update(updateNoteDto: IUpdateDto<Note>): Promise<Note> {
    const { id, userId, data } = updateNoteDto;

    return handleAsyncOperation(
      () =>
        this._db.note.update({
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
  async delete(deleteNoteDto: IDeleteDto): Promise<Note> {
    const { id, userId } = deleteNoteDto;

    return handleAsyncOperation(
      () =>
        this._db.note.delete({
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
  async findMany(findManyDto: IFindAllDto): Promise<Note[]> {
    const { userId, limit, sort, skip = 0 } = findManyDto;

    return handleAsyncOperation(
      () =>
        this._db.note.findMany({
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
    dto: IFindAllDto & { videoId: string }
  ): Promise<Note[]> {
    const { videoId, userId, limit, sort, skip = 0 } = dto;

    return handleAsyncOperation(
      () =>
        this._db.note.findMany({
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
  async count(userId: string): Promise<number> {
    return handleAsyncOperation(
      () =>
        this._db.note.count({
          where: {
            userId,
          },
        }),
      { errorMessage: "Failed to count notes." }
    );
  }
}
