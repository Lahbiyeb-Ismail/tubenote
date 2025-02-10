import type { Response } from "express";
import httpStatus from "http-status";

import type { EmptyRecord, TypedRequest } from "@/types";

import type { FindManyDto } from "@common/dtos/find-many.dto";
import type { IdParamDto } from "@common/dtos/id-param.dto";
import type { QueryPaginationDto } from "@common/dtos/query-pagination.dto";

import type {
  CreateNoteDto,
  INoteController,
  INoteService,
  UpdateNoteDto,
  UserNotes,
} from "@modules/note";

/**
 * Controller for handling note-related operations.
 */
export class NoteController implements INoteController {
  constructor(private readonly _noteService: INoteService) {}

  private _sendPaginatedResponse(
    res: Response,
    paginationQuery: QueryPaginationDto,
    result: UserNotes
  ): void {
    const currentPage = Number(paginationQuery.page) || 1;

    res.status(httpStatus.OK).json({
      success: true,
      data: result.notes,
      pagination: {
        totalPages: result.totalPages,
        currentPage,
        totalItems: result.notesCount,
        hasNextPage: currentPage < result.totalPages,
        hasPrevPage: currentPage > 1,
      },
    });
  }

  private _getPaginationQueries(
    queries: QueryPaginationDto,
    defaultLimit = 8
  ): Omit<FindManyDto, "userId"> {
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
   * @param req - The request object containing the note data and user ID.
   * @param res - The response object used to send the status and result.
   * @returns A promise that resolves to void.
   */
  async createNote(
    req: TypedRequest<Omit<CreateNoteDto, "userId">>,
    res: Response
  ): Promise<void> {
    const userId = req.userId;

    const note = await this._noteService.createNote({ userId, ...req.body });

    res.status(httpStatus.CREATED).json({
      success: true,
      data: note,
      message: "Note created successfully.",
    });
  }

  /**
   * Updates an existing note for the authenticated user.
   *
   * @param req - The request object containing the note ID in the parameters and the updated note data in the body.
   * @param res - The response object used to send the status and updated note data.
   * @returns A promise that resolves to void.
   */
  async updateNote(
    req: TypedRequest<UpdateNoteDto, IdParamDto>,
    res: Response
  ): Promise<void> {
    const userId = req.userId;
    const { id } = req.params;

    const updatedNote = await this._noteService.updateNote(
      { noteId: id, userId },
      req.body
    );

    res.status(httpStatus.OK).json({
      success: true,
      data: updatedNote,
      message: "Note updated successfully.",
    });
  }

  /**
   * Deletes a note based on the provided note ID and user ID.
   *
   * @param req - The request object containing the user ID and note ID.
   * @param res - The response object used to send the status and message.
   * @returns A promise that resolves to void.
   */
  async deleteNote(
    req: TypedRequest<EmptyRecord, IdParamDto>,
    res: Response
  ): Promise<void> {
    const userId = req.userId;
    const { id } = req.params;

    await this._noteService.deleteNote({ noteId: id, userId });

    res
      .status(httpStatus.OK)
      .json({ success: true, message: "Note deleted successfully." });
  }

  /**
   * Retrieves a note by its ID for the authenticated user.
   *
   * @param req - The request object containing the user ID and note ID parameters.
   * @param res - The response object used to send the note data.
   * @returns A promise that resolves to void.
   */
  async getNoteById(
    req: TypedRequest<EmptyRecord, IdParamDto>,
    res: Response
  ): Promise<void> {
    const userId = req.userId;
    const { id } = req.params;

    const note = await this._noteService.findNote({ noteId: id, userId });

    res.status(httpStatus.OK).json({
      success: true,
      data: note,
    });
  }

  /**
   * Retrieves the notes of a user with pagination.
   *
   * @param req - The request object containing user ID and pagination query parameters.
   * @param res - The response object used to send the notes and pagination details.
   * @returns A promise that resolves to void.
   */
  async getUserNotes(
    req: TypedRequest<EmptyRecord, EmptyRecord, QueryPaginationDto>,
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
   * @param req - The request object containing user information.
   * @param res - The response object used to send back the notes.
   * @returns A promise that resolves to void.
   */
  async getUserRecentNotes(
    req: TypedRequest<EmptyRecord, EmptyRecord, QueryPaginationDto>,
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
   * @param req - The request object, containing the authenticated user's ID.
   * @param res - The response object used to send the JSON response.
   * @returns A promise that resolves to void.
   */
  async getRecentlyUpatedNotes(
    req: TypedRequest<EmptyRecord, EmptyRecord, QueryPaginationDto>,
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
   * @param req - The request object containing user ID, video ID parameter, and pagination query.
   * @param res - The response object used to send back the notes and pagination details.
   *
   * @returns A JSON response containing the notes and pagination information.
   *
   */
  async getNotesByVideoId(
    req: TypedRequest<EmptyRecord, IdParamDto, QueryPaginationDto>,
    res: Response
  ) {
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
