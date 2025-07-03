import type { Note, Prisma } from "@tubenote/db";
import type {
  ICreateNoteDto,
  IFindManyDto,
  IPaginationQueryDto,
  IParamIdDto,
  ISearchAndPaginationQueryDto,
  IUpdateNoteDto,
} from "@tubenote/dtos";
import type { IPaginatedData } from "@tubenote/types";
import type { Response } from "express";

import type { EmptyRecord, TypedRequest } from "@/modules/shared/types";

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
  find: (
    userId: string,
    noteId: string,
    tx?: Prisma.TransactionClient
  ) => Promise<Note | null>;

  /**
   * Creates a new note.
   *
   * @param userId - The unique identifier of the user.
   * @param videoId - The unique identifier of the video associated with the note.
   * @param data - Data transfer object containing the note details.
   * @param tx - Optional transaction client for database operations.
   *
   * @returns A promise that resolves to the newly created note.
   */
  create: (
    userId: string,
    videoId: string,
    data: ICreateNoteDto,
    tx?: Prisma.TransactionClient
  ) => Promise<Note>;

  /**
   * Updates an existing note.
   *
   * @param userId - The unique identifier of the user.
   * @param noteId - The unique identifier of the note to update.
   * @param data - The data transfer object containing the data to update.
   * @param tx - Optional transaction client for database operations.
   *
   * @returns A promise that resolves to the updated note.
   * @throws {Error} - Throws an error if the update operation fails.
   */
  update: (
    userId: string,
    noteId: string,
    data: IUpdateNoteDto,
    tx?: Prisma.TransactionClient
  ) => Promise<Note>;

  /**
   * Deletes a note.
   *
   * @param userId - The unique identifier of the user.
   * @param noteId - The unique identifier of the note to delete.
   * @param tx - Optional transaction client for database operations.
   *
   * @returns A promise that resolves to the deleted note.
   */
  delete: (
    userId: string,
    noteId: string,
    tx?: Prisma.TransactionClient
  ) => Promise<Note>;

  /**
   * Retrieves multiple notes with pagination.
   *
   * @param userId - The unique identifier of the user.
   * @param queryOptions - Data transfer object containing pagination and sorting parameters.
   *                      This includes parameters like `limit`, `page`, `sortBy`, and `order`.
   *                      The `q` parameter is used for searching notes by title, content,
   *                      or tags.
   * @param tx - Optional transaction client for database operations.
   *
   * @returns A promise that resolves to an array of notes.
   */
  findMany: (
    userId: string,
    queryOptions: ISearchAndPaginationQueryDto,
    tx?: Prisma.TransactionClient
  ) => Promise<Note[]>;

  /**
   * Retrieves multiple notes associated with a specific video.
   *
   * @param userId - The unique identifier of the user.
   * @param videoId - The unique identifier of the video.
   * @param findManyDto - Data transfer object containing the video ID along with pagination parameters.
   * @param tx - Optional transaction client for database operations.
   *
   * @returns A promise that resolves to an array of notes.
   */
  findManyByVideoId: (
    userId: string,
    videoId: string,
    findManyDto: IFindManyDto,
    tx?: Prisma.TransactionClient
  ) => Promise<Note[]>;

  /**
   * Counts the total number of notes for a specific user.
   *
   * @param userId - The unique identifier of the user.
   * @param searchQuery - Optional search query to filter notes by title, content, or tags.
   * @param tx - Optional transaction client for database operations.
   *
   * @returns A promise that resolves to the number of notes.
   */
  count: (userId: string, searchQuery?: string, tx?: Prisma.TransactionClient) => Promise<number>;

  /**
   * Counts the total number of notes associated with a specific video for a given user.
   *
   * @param userId - The unique identifier of the user whose notes are being counted
   * @param ytVideoId - The YouTube video ID to count notes for
   * @param tx - Optional Prisma transaction client for database operations
   *
   * @returns A promise that resolves to the total count of notes for the specified user and video
   */
  countByYtVideoId: (
    userId: string,
    ytVideoId: string,
    tx?: Prisma.TransactionClient,
  ) => Promise<number>;

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
  search: (
    userId: string,
    query: string,
    findManyDto: IFindManyDto,
    tx?: Prisma.TransactionClient
  ) => Promise<Note[]>;
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
  findNote: (
    userId: string,
    noteId: string,
    tx?: Prisma.TransactionClient
  ) => Promise<Note>;

  /**
   * Creates a new note.
   *
   * @param userId - The unique identifier of the user.
   * @param videoId - The unique identifier of the video associated with the note.
   * @param data - Data transfer object containing the note details.
   * @param tx - Optional transaction client for database operations.
   *
   * @returns A promise that resolves to the newly created note.
   */
  createNote: (
    userId: string,
    videoId: string,
    data: ICreateNoteDto,
    tx?: Prisma.TransactionClient
  ) => Promise<Note>;

  /**
   * Updates an existing note.
   *
   * @param userId - The unique identifier of the user.
   * @param noteId - The unique identifier of the note to update.
   * @param data - Data transfer object containing the updated note data.
   *
   * @returns A promise that resolves to the updated note.
   */
  updateNote: (
    userId: string,
    noteId: string,
    data: IUpdateNoteDto
  ) => Promise<Note>;

  /**
   * Deletes a note.
   *
   * @param userId - The unique identifier of the user.
   * @param noteId - The unique identifier of the note to delete.
   *
   * @returns A promise that resolves to the deleted note.
   */
  deleteNote: (userId: string, noteId: string) => Promise<Note>;

  /**
   * Fetches paginated notes for a user.
   *
   * @param userId - The unique identifier of the user.
   * @param queryOptions - Data transfer object containing pagination, sorting, and filtering parameters.
   * @returns A promise that resolves to the paginated notes information.
   */
  fetchUserNotes: (
    userId: string,
    queryOptions: ISearchAndPaginationQueryDto
  ) => Promise<IPaginatedData<Note>>;

  /**
   * Fetches notes associated with a specific video with pagination.
   *
   * @param userId - The unique identifier of the user.
   * @param videoId - The unique identifier of the video.
   * @param findManyDto - Data transfer object containing pagination, sorting, and filtering parameters.
   *
   * @returns A promise that resolves to the paginated notes information.
   */
  fetchNotesByVideoId: (
    userId: string,
    videoId: string,
    findManyDto: IFindManyDto
  ) => Promise<IPaginatedData<Note>>;

  /**
   * Fetches the count of notes associated with a specific YouTube video for a given user.
   *
   * @param userId - The unique identifier of the user.
   * @param ytVideoId - The YouTube video identifier.
   *
   * @returns A promise that resolves to the number of notes associated with the video.
   *
   */
  fetchNotesCountByVideoId: (userId: string, ytVideoId: string) => Promise<number>;
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
  createNote: (
    req: TypedRequest<ICreateNoteDto, IParamIdDto>,
    res: Response
  ) => Promise<void>;

  /**
   * Handles updating an existing note.
   *
   * @param req - The request object containing the updated note data and note ID in the URL parameters.
   * @param res - The response object used to send the HTTP response.
   * @returns A promise that resolves when the note is updated.
   */
  updateNote: (
    req: TypedRequest<IUpdateNoteDto, IParamIdDto>,
    res: Response
  ) => Promise<void>;

  /**
   * Handles deleting a note.
   *
   * @param req - The request object containing the note ID in the URL parameters.
   * @param res - The response object used to send the HTTP response.
   * @returns A promise that resolves when the note is deleted.
   */
  deleteNote: (
    req: TypedRequest<EmptyRecord, IParamIdDto>,
    res: Response
  ) => Promise<void>;

  /**
   * Retrieves a note by its identifier.
   *
   * @param req - The request object containing the note ID in the URL parameters.
   * @param res - The response object used to send the HTTP response.
   * @returns A promise that resolves when the note is retrieved.
   */
  getNoteById: (
    req: TypedRequest<EmptyRecord, IParamIdDto>,
    res: Response
  ) => Promise<void>;

  /**
   * Retrieves the count of notes associated with a specific YouTube video for the authenticated user.
   *
   * @param req - The typed request object containing user ID and video ID parameters
   * @param req.userId - The authenticated user's ID
   * @param req.params.id - The YouTube video ID to count notes for
   * @param res - The Express response object
   *
   * @returns A Promise that resolves to void, sends a formatted JSON response with the notes count
   *
   */
  getNotesCountByVideoId: (
    req: TypedRequest<EmptyRecord, IParamIdDto>,
    res: Response,
  ) => Promise<void>;

  /**
   * Retrieves paginated notes for the authenticated user.
   *
   * @param req - The request object containing pagination query parameters.
   * @param res - The response object used to send the HTTP response.
   * @returns A promise that resolves when the notes are retrieved.
   */
  getUserNotes: (
    req: TypedRequest<EmptyRecord, EmptyRecord, ISearchAndPaginationQueryDto>,
    res: Response
  ) => Promise<void>;

  /**
   * Retrieves notes associated with a specific video ID with pagination support.
   *
   * @param req - The request object containing the video ID in the URL parameters and pagination query parameters.
   * @param res - The response object used to send the HTTP response.
   * @returns A promise that resolves when the notes are retrieved.
   */
  getNotesByVideoId: (
    req: TypedRequest<EmptyRecord, IParamIdDto, IPaginationQueryDto>,
    res: Response
  ) => Promise<void>;
}
