import type { Response } from "express";

import type { Note } from "./note.model";

import type { EmptyRecord, TypedRequest } from "@/types";

import type { IdParamDto } from "@common/dtos/id-param.dto";
import type { QueryPaginationDto } from "@common/dtos/query-pagination.dto";

import type { CreateNoteDto, UpdateNoteDto } from "@modules/note";

import type {
  ICreateDto,
  IDeleteDto,
  IFindAllDto,
  IFindUniqueDto,
  IUpdateDto,
} from "@modules/shared";

/**
 * Represents paginated notes data for a user.
 */
export interface PaginatedNotes {
  /**
   * The list of notes.
   */
  notes: Note[];
  /**
   * The total count of notes.
   */
  notesCount: number;
  /**
   * The total number of pages available based on the notes count and pagination limit.
   */
  totalPages: number;
}

/**
 * Interface defining the repository methods for interacting with note data.
 */
export interface INoteRepository {
  /**
   * Executes a series of operations within a database transaction.
   *
   * @template T - The type of the result returned from the transaction.
   * @param fn - A function that receives a transactional note repository and returns a promise.
   * @returns A promise that resolves with the result of the transactional operations.
   */
  transaction<T>(fn: (tx: INoteRepository) => Promise<T>): Promise<T>;

  /**
   * Finds a note using the specified criteria.
   *
   * @param findNoteDto - Data transfer object containing the note ID and user ID.
   * @returns A promise that resolves to the found note or null if no note is found.
   */
  find(findNoteDto: IFindUniqueDto): Promise<Note | null>;

  /**
   * Creates a new note.
   *
   * @param createNoteDto - Data transfer object containing the note details.
   * @returns A promise that resolves to the newly created note.
   */
  create(createNoteDto: ICreateDto<Note>): Promise<Note>;

  /**
   * Updates an existing note.
   *
   * @param {IUpdateDto<Note>} updateNoteDto - The data transfer object containing the note's ID, user ID, and the data to update.
   * @returns A promise that resolves to the updated note.
   * @throws {Error} - Throws an error if the update operation fails.
   */
  update(updateNoteDto: IUpdateDto<Note>): Promise<Note>;

  /**
   * Deletes a note.
   *
   * @param deleteNoteDto - Data transfer object containing the note ID and user ID.
   * @returns A promise that resolves to the deleted note.
   */
  delete(deleteNoteDto: IDeleteDto): Promise<Note>;

  /**
   * Retrieves multiple notes with pagination.
   *
   * @param findManyDto - Data transfer object containing pagination and sorting parameters.
   * @returns A promise that resolves to an array of notes.
   */
  findMany(findManyDto: IFindAllDto): Promise<Note[]>;

  /**
   * Retrieves multiple notes associated with a specific video.
   *
   * @param dto - Data transfer object containing the video ID along with pagination parameters.
   * @returns A promise that resolves to an array of notes.
   */
  findManyByVideoId(dto: IFindAllDto & { videoId: string }): Promise<Note[]>;

  /**
   * Counts the total number of notes for a specific user.
   *
   * @param userId - The unique identifier of the user.
   * @returns A promise that resolves to the number of notes.
   */
  count(userId: string): Promise<number>;
}

/**
 * Interface defining the service methods for managing notes.
 */
export interface INoteService {
  /**
   * Finds a note using the specified criteria.
   *
   * @param findNoteDto - Data transfer object containing the note ID and user ID.
   * @returns A promise that resolves to the found note.
   */
  findNote(findNoteDto: IFindUniqueDto): Promise<Note>;

  /**
   * Creates a new note.
   *
   * @param createNoteDto - Data transfer object containing the note details.
   * @returns A promise that resolves to the newly created note.
   */
  createNote(createNoteDto: CreateNoteDto): Promise<Note>;

  /**
   * Updates an existing note.
   *
   * @param findNoteDto - Data transfer object containing the note ID and user ID.
   * @param updateNoteDto - Data transfer object containing the updated note data.
   * @returns A promise that resolves to the updated note.
   */
  updateNote(
    findNoteDto: IFindUniqueDto,
    updateNoteDto: UpdateNoteDto
  ): Promise<Note>;

  /**
   * Deletes a note.
   *
   * @param deleteNoteDto - Data transfer object containing the note ID and user ID.
   * @returns A promise that resolves to the deleted note.
   */
  deleteNote(deleteNoteDto: IDeleteDto): Promise<Note>;

  /**
   * Fetches paginated notes for a user.
   *
   * @param findManyDto - Data transfer object containing pagination, sorting, and filtering parameters.
   * @returns A promise that resolves to the paginated notes information.
   */
  fetchUserNotes(findManyDto: IFindAllDto): Promise<PaginatedNotes>;

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
  ): Promise<PaginatedNotes>;
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
  createNote(req: TypedRequest<CreateNoteDto>, res: Response): Promise<void>;

  /**
   * Handles updating an existing note.
   *
   * @param req - The request object containing the updated note data and note ID in the URL parameters.
   * @param res - The response object used to send the HTTP response.
   * @returns A promise that resolves when the note is updated.
   */
  updateNote(
    req: TypedRequest<UpdateNoteDto, IdParamDto>,
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
    req: TypedRequest<EmptyRecord, IdParamDto>,
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
    req: TypedRequest<EmptyRecord, IdParamDto>,
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
    req: TypedRequest<EmptyRecord, EmptyRecord, QueryPaginationDto>,
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
    req: TypedRequest<EmptyRecord, IdParamDto, QueryPaginationDto>,
    res: Response
  ): Promise<void>;
}
