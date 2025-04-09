import type { Prisma } from "@prisma/client";
import type { Response } from "express";

import type { Note } from "@tubenote/types";

import type { ICreateNoteDto, IUpdateNoteDto } from "@tubenote/shared";

import type { EmptyRecord, TypedRequest } from "@/modules/shared/types";

import type {
  IFindAllDto,
  IPaginatedData,
  IParamIdDto,
  IQueryPaginationDto,
} from "@/modules/shared/dtos";

import type { IPrismaService, IResponseFormatter } from "../shared/services";

/**
 * Interface defining the repository methods for interacting with note data.
 */
export interface INoteRepository {
  /**
   * Finds a note using the specified criteria.
   *
   * @param userId - The unique identifier of the user.
   * @param noteId - The unique identifier of the note to find.
   * @param tx - Optional transaction client for database operations.
   *
   * @returns A promise that resolves to the found note or null if no note is found.
   */
  find(
    userId: string,
    noteId: string,
    tx?: Prisma.TransactionClient
  ): Promise<Note | null>;

  /**
   * Creates a new note.
   *
   * @param userId - The unique identifier of the user.
   * @param videoId - The unique identifier of the video associated with the note.
   * @param createNoteDto - Data transfer object containing the note details.
   * @param tx - Optional transaction client for database operations.
   *
   * @returns A promise that resolves to the newly created note.
   */
  create(
    userId: string,
    videoId: string,
    createNoteDto: ICreateNoteDto,
    tx?: Prisma.TransactionClient
  ): Promise<Note>;

  /**
   * Updates an existing note.
   *
   * @param userId - The unique identifier of the user.
   * @param noteId - The unique identifier of the note to update.
   * @param {IUpdateDto<Note>} updateNoteDto - The data transfer object containing the data to update.
   * @param tx - Optional transaction client for database operations.
   *
   * @returns A promise that resolves to the updated note.
   * @throws {Error} - Throws an error if the update operation fails.
   */
  update(
    userId: string,
    noteId: string,
    updateNoteDto: IUpdateNoteDto,
    tx?: Prisma.TransactionClient
  ): Promise<Note>;

  /**
   * Deletes a note.
   *
   * @param userId - The unique identifier of the user.
   * @param noteId - The unique identifier of the note to delete.
   * @param tx - Optional transaction client for database operations.
   *
   * @returns A promise that resolves to the deleted note.
   */
  delete(
    userId: string,
    noteId: string,
    tx?: Prisma.TransactionClient
  ): Promise<Note>;

  /**
   * Retrieves multiple notes with pagination.
   *
   * @param findManyDto - Data transfer object containing pagination and sorting parameters.
   * @returns A promise that resolves to an array of notes.
   */
  findMany(
    findManyDto: IFindAllDto,
    tx?: Prisma.TransactionClient
  ): Promise<Note[]>;

  /**
   * Retrieves multiple notes associated with a specific video.
   *
   * @param dto - Data transfer object containing the video ID along with pagination parameters.
   * @returns A promise that resolves to an array of notes.
   */
  findManyByVideoId(
    dto: IFindAllDto & { videoId: string },
    tx?: Prisma.TransactionClient
  ): Promise<Note[]>;

  /**
   * Counts the total number of notes for a specific user.
   *
   * @param userId - The unique identifier of the user.
   * @param tx - Optional transaction client for database operations.
   *
   * @returns A promise that resolves to the number of notes.
   */
  count(userId: string, tx?: Prisma.TransactionClient): Promise<number>;
}

/**
 * Interface defining the service methods for managing notes.
 */
export interface INoteService {
  /**
   * Finds a note using the specified criteria.
   *
   * @param userId - The unique identifier of the user.
   * @param noteId - The unique identifier of the note to find.
   * @param tx - Optional transaction client for database operations.
   *
   * @returns A promise that resolves to the found note.
   */
  findNote(
    userId: string,
    noteId: string,
    tx?: Prisma.TransactionClient
  ): Promise<Note>;

  /**
   * Creates a new note.
   *
   * @param userId - The unique identifier of the user.
   * @param videoId - The unique identifier of the video associated with the note.
   * @param createNoteDto - Data transfer object containing the note details.
   * @param tx - Optional transaction client for database operations.
   *
   * @returns A promise that resolves to the newly created note.
   */
  createNote(
    userId: string,
    videoId: string,
    createNoteDto: ICreateNoteDto,
    tx?: Prisma.TransactionClient
  ): Promise<Note>;

  /**
   * Updates an existing note.
   *
   * @param userId - The unique identifier of the user.
   * @param noteId - The unique identifier of the note to update.
   * @param updateNoteDto - Data transfer object containing the updated note data.
   *
   * @returns A promise that resolves to the updated note.
   */
  updateNote(
    userId: string,
    noteId: string,
    updateNoteDto: IUpdateNoteDto
  ): Promise<Note>;

  /**
   * Deletes a note.
   *
   * @param userId - The unique identifier of the user.
   * @param noteId - The unique identifier of the note to delete.
   *
   * @returns A promise that resolves to the deleted note.
   */
  deleteNote(userId: string, noteId: string): Promise<Note>;

  /**
   * Fetches paginated notes for a user.
   *
   * @param findManyDto - Data transfer object containing pagination, sorting, and filtering parameters.
   * @returns A promise that resolves to the paginated notes information.
   */
  fetchUserNotes(findManyDto: IFindAllDto): Promise<IPaginatedData<Note>>;

  /**
   * Fetches recent notes for a user.
   *
   * @param findManyDto - Data transfer object containing pagination, sorting, and filtering parameters.
   * @returns A promise that resolves to an array of recent notes.
   */
  fetchRecentNotes(findManyDto: IFindAllDto): Promise<Note[]>;

  /**
   * Fetches recently updated notes for a user.
   *
   * @param findManyDto - Data transfer object containing pagination, sorting, and filtering parameters.
   * @returns A promise that resolves to an array of recently updated notes.
   */
  fetchRecentlyUpdatedNotes(findManyDto: IFindAllDto): Promise<Note[]>;

  /**
   * Fetches notes associated with a specific video with pagination.
   *
   * @param dto - Data transfer object containing the video ID and pagination parameters.
   * @returns A promise that resolves to the paginated notes information.
   */
  fetchNotesByVideoId(
    dto: IFindAllDto & { videoId: string }
  ): Promise<IPaginatedData<Note>>;
}

/**
 * Interface defining the controller methods for handling note-related HTTP requests.
 */
export interface INoteController {
  /**
   * Handles the creation of a new note.
   *
   * @param req - The request object containing the note data.
   * @param res - The response object used to send the HTTP response.
   * @returns A promise that resolves when the note is created.
   */
  createNote(
    req: TypedRequest<ICreateNoteDto, IParamIdDto>,
    res: Response
  ): Promise<void>;

  /**
   * Handles updating an existing note.
   *
   * @param req - The request object containing the updated note data and note ID in the URL parameters.
   * @param res - The response object used to send the HTTP response.
   * @returns A promise that resolves when the note is updated.
   */
  updateNote(
    req: TypedRequest<IUpdateNoteDto, IParamIdDto>,
    res: Response
  ): Promise<void>;

  /**
   * Handles deleting a note.
   *
   * @param req - The request object containing the note ID in the URL parameters.
   * @param res - The response object used to send the HTTP response.
   * @returns A promise that resolves when the note is deleted.
   */
  deleteNote(
    req: TypedRequest<EmptyRecord, IParamIdDto>,
    res: Response
  ): Promise<void>;

  /**
   * Retrieves a note by its identifier.
   *
   * @param req - The request object containing the note ID in the URL parameters.
   * @param res - The response object used to send the HTTP response.
   * @returns A promise that resolves when the note is retrieved.
   */
  getNoteById(
    req: TypedRequest<EmptyRecord, IParamIdDto>,
    res: Response
  ): Promise<void>;

  /**
   * Retrieves paginated notes for the authenticated user.
   *
   * @param req - The request object containing pagination query parameters.
   * @param res - The response object used to send the HTTP response.
   * @returns A promise that resolves when the notes are retrieved.
   */
  getUserNotes(
    req: TypedRequest<EmptyRecord, EmptyRecord, IQueryPaginationDto>,
    res: Response
  ): Promise<void>;

  /**
   * Retrieves the most recent notes for the authenticated user.
   *
   * @param req - The request object containing the user details.
   * @param res - The response object used to send the HTTP response.
   * @returns A promise that resolves when the recent notes are retrieved.
   */
  getUserRecentNotes(req: TypedRequest, res: Response): Promise<void>;

  /**
   * Retrieves the most recently updated notes for the authenticated user.
   *
   * @param req - The request object containing the user details.
   * @param res - The response object used to send the HTTP response.
   * @returns A promise that resolves when the updated notes are retrieved.
   */
  getRecentlyUpdatedNotes(req: TypedRequest, res: Response): Promise<void>;

  /**
   * Retrieves notes associated with a specific video ID with pagination support.
   *
   * @param req - The request object containing the video ID in the URL parameters and pagination query parameters.
   * @param res - The response object used to send the HTTP response.
   * @returns A promise that resolves when the notes are retrieved.
   */
  getNotesByVideoId(
    req: TypedRequest<EmptyRecord, IParamIdDto, IQueryPaginationDto>,
    res: Response
  ): Promise<void>;
}

export interface INoteRepositoryOptions {
  db: IPrismaService;
}

export interface INoteServiceOptions {
  noteRepository: INoteRepository;
  prismaService: IPrismaService;
}

export interface INoteControllerOptions {
  noteService: INoteService;
  responseFormatter: IResponseFormatter;
}
