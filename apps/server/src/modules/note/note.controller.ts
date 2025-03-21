import type { Response } from "express";
import httpStatus from "http-status";

import type { EmptyRecord, TypedRequest } from "@/modules/shared/types";

import type {
  ICreateBodyDto,
  IFindAllDto,
  IPaginatedItems,
  IParamIdDto,
  IQueryPaginationDto,
  IUpdateBodyDto,
} from "@/modules/shared/dtos";

import type { Note } from "./note.model";
import type {
  INoteController,
  INoteControllerOptions,
  INoteService,
} from "./note.types";

/**
 * Controller for handling note-related operations.
 *
 * This controller provides endpoints for creating, updating, deleting,
 * and retrieving notes for an authenticated user.
 * It also supports pagination for list endpoints.
 */
export class NoteController implements INoteController {
  private static _instance: NoteController;

  /**
   * Creates an instance of NoteController.
   *
   * @param _noteService - An instance of the note service that handles business logic.
   */
  private constructor(private readonly _noteService: INoteService) {}

  /**
   * Gets the singleton instance of NoteController.
   *
   * @param noteService - An instance of the note service that handles business logic.
   * @returns The singleton instance of NoteController.
   */
  public static getInstance(options: INoteControllerOptions): NoteController {
    if (!this._instance) {
      this._instance = new NoteController(options.noteService);
    }
    return this._instance;
  }

  /**
   * Sends a standardized paginated response.
   *
   * @private
   * @param res - Express response object used to send the HTTP response.
   * @param paginationQuery - The query parameters containing pagination details.
   * @param result - The result object containing notes data and pagination metadata.
   */
  private _sendPaginatedResponse(
    res: Response,
    paginationQuery: IQueryPaginationDto,
    result: IPaginatedItems<Note>
  ): void {
    const currentPage = Number(paginationQuery.page) || 1;

    res.status(httpStatus.OK).json({
      success: true,
      data: result.items,
      pagination: {
        totalPages: result.totalPages,
        currentPage,
        totalItems: result.totalItems,
        hasNextPage: currentPage < result.totalPages,
        hasPrevPage: currentPage > 1,
      },
    });
  }

  /**
   * Extracts and calculates pagination parameters from the query.
   *
   * @private
   * @param queries - The query parameters containing pagination and sorting details.
   * @param defaultLimit - The default limit for items per page (default is 8).
   * @returns An object with pagination parameters (skip, limit, and sort options) excluding the userId.
   */
  private _getPaginationQueries(
    queries: IQueryPaginationDto,
    defaultLimit = 8
  ): Omit<IFindAllDto, "userId"> {
    const page = Math.max(Number(queries.page) || 1, 1);
    const limit = Math.max(Number(queries.limit) || defaultLimit, 1);
    const skip = (page - 1) * limit;

    return {
      skip,
      limit,
      sort: {
        by: queries.sortBy || "createdAt",
        order: queries.order || "desc",
      },
    };
  }

  /**
   * Adds a new note for the authenticated user.
   *
   * @param req - The request object containing note data (excluding userId) in the body and the userId on the request.
   * @param res - The response object used to send the HTTP status and result.
   * @returns A promise that resolves to void.
   */
  async createNote(
    req: TypedRequest<ICreateBodyDto<Note>>,
    res: Response
  ): Promise<void> {
    const userId = req.userId;
    const note = await this._noteService.createNote({ userId, data: req.body });

    res.status(httpStatus.CREATED).json({
      success: true,
      data: note,
      message: "Note created successfully.",
    });
  }

  /**
   * Updates an existing note for the authenticated user.
   *
   * @param req - The request object containing the note ID in the parameters and updated note data in the body.
   * @param res - The response object used to send the HTTP status and updated note data.
   * @returns A promise that resolves to void.
   */
  async updateNote(
    req: TypedRequest<IUpdateBodyDto<Note>, IParamIdDto>,
    res: Response
  ): Promise<void> {
    const userId = req.userId;
    const { id } = req.params;

    const updatedNote = await this._noteService.updateNote({
      id,
      userId,
      data: req.body,
    });

    res.status(httpStatus.OK).json({
      success: true,
      data: updatedNote,
      message: "Note updated successfully.",
    });
  }

  /**
   * Deletes a note based on the provided note ID and user ID.
   *
   * @param req - The request object containing the note ID in the parameters and the userId.
   * @param res - The response object used to send the HTTP status and confirmation message.
   * @returns A promise that resolves to void.
   */
  async deleteNote(
    req: TypedRequest<EmptyRecord, IParamIdDto>,
    res: Response
  ): Promise<void> {
    const userId = req.userId;
    const { id } = req.params;

    await this._noteService.deleteNote({ id, userId });

    res
      .status(httpStatus.OK)
      .json({ success: true, message: "Note deleted successfully." });
  }

  /**
   * Retrieves a note by its ID for the authenticated user.
   *
   * @param req - The request object containing the note ID in the parameters and the userId.
   * @param res - The response object used to send the HTTP status and note data.
   * @returns A promise that resolves to void.
   */
  async getNoteById(
    req: TypedRequest<EmptyRecord, IParamIdDto>,
    res: Response
  ): Promise<void> {
    const userId = req.userId;
    const { id } = req.params;

    const note = await this._noteService.findNote({ id, userId });

    res.status(httpStatus.OK).json({
      success: true,
      data: note,
    });
  }

  /**
   * Retrieves the notes of a user with pagination.
   *
   * @param req - The request object containing the userId and pagination query parameters.
   * @param res - The response object used to send the HTTP status, notes data, and pagination metadata.
   * @returns A promise that resolves to void.
   */
  async getUserNotes(
    req: TypedRequest<EmptyRecord, EmptyRecord, IQueryPaginationDto>,
    res: Response
  ): Promise<void> {
    const userId = req.userId;
    const paginationQueries = this._getPaginationQueries(req.query);

    const result = await this._noteService.fetchUserNotes({
      userId,
      ...paginationQueries,
    });

    this._sendPaginatedResponse(res, req.query, result);
  }

  /**
   * Retrieves the most recent notes for a specific user.
   *
   * @param req - The request object containing the userId and pagination query parameters.
   * @param res - The response object used to send the HTTP status and recent notes data.
   * @returns A promise that resolves to void.
   */
  async getUserRecentNotes(
    req: TypedRequest<EmptyRecord, EmptyRecord, IQueryPaginationDto>,
    res: Response
  ): Promise<void> {
    const userId = req.userId;
    const paginationQueries = this._getPaginationQueries(req.query, 2);

    const notes = await this._noteService.fetchRecentNotes({
      userId,
      ...paginationQueries,
    });

    res.status(httpStatus.OK).json({ success: true, data: notes });
  }

  /**
   * Retrieves the most recently updated notes for the authenticated user.
   *
   * @param req - The request object containing the userId and pagination query parameters.
   * @param res - The response object used to send the HTTP status and recently updated notes data.
   * @returns A promise that resolves to void.
   */
  async getRecentlyUpdatedNotes(
    req: TypedRequest<EmptyRecord, EmptyRecord, IQueryPaginationDto>,
    res: Response
  ): Promise<void> {
    const userId = req.userId;
    const paginationQueries = this._getPaginationQueries(req.query, 2);

    const notes = await this._noteService.fetchRecentNotes({
      userId,
      ...paginationQueries,
    });

    res.status(httpStatus.OK).json({ success: true, data: notes });
  }

  /**
   * Retrieves notes associated with a specific video ID, with pagination support.
   *
   * @param req - The request object containing the video ID as a parameter, the userId, and pagination query parameters.
   * @param res - The response object used to send the HTTP status, notes data, and pagination metadata.
   * @returns A promise that resolves to void.
   */
  async getNotesByVideoId(
    req: TypedRequest<EmptyRecord, IParamIdDto, IQueryPaginationDto>,
    res: Response
  ): Promise<void> {
    const userId = req.userId;
    const { id } = req.params;

    const paginationQueries = this._getPaginationQueries(req.query);

    const result = await this._noteService.fetchNotesByVideoId({
      videoId: id,
      userId,
      ...paginationQueries,
    });

    this._sendPaginatedResponse(res, req.query, result);
  }
}
