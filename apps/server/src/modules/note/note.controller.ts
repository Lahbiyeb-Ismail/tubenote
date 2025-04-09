import type { Response } from "express";
import httpStatus from "http-status";

import type { ICreateNoteDto, IUpdateNoteDto } from "@tubenote/shared";
import type { Note } from "@tubenote/types";

import type { IResponseFormatter } from "@/modules/shared/services";
import type { EmptyRecord, TypedRequest } from "@/modules/shared/types";

import type { IParamIdDto, IQueryPaginationDto } from "@/modules/shared/dtos";

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
   * @param _responseFormatter - An instance of the response formatter service.
   */
  private constructor(
    private readonly _noteService: INoteService,
    private readonly _responseFormatter: IResponseFormatter
  ) {}

  /**
   * Gets the singleton instance of NoteController.
   *
   * @param noteService - An instance of the note service that handles business logic.
   * @param responseFormatter - An instance of the response formatter service.
   * @returns The singleton instance of NoteController.
   */
  public static getInstance(options: INoteControllerOptions): NoteController {
    if (!this._instance) {
      this._instance = new NoteController(
        options.noteService,
        options.responseFormatter
      );
    }
    return this._instance;
  }

  /**
   * Adds a new note for the authenticated user.
   *
   * @param req - The request object containing note data (excluding userId) in the body and the userId on the request.
   * @param res - The response object used to send the HTTP status and result.
   * @returns A promise that resolves to void.
   */
  async createNote(
    req: TypedRequest<ICreateNoteDto, IParamIdDto>,
    res: Response
  ): Promise<void> {
    const userId = req.userId;
    const videoId = req.params.id;

    const note = await this._noteService.createNote(userId, videoId, req.body);

    const formattedResponse = this._responseFormatter.formatResponse<Note>({
      responseOptions: {
        data: note,
        status: httpStatus.CREATED,
        message: "Note created successfully.",
      },
    });

    res.status(httpStatus.CREATED).json(formattedResponse);
  }

  /**
   * Updates an existing note for the authenticated user.
   *
   * @param req - The request object containing the note ID in the parameters and updated note data in the body.
   * @param res - The response object used to send the HTTP status and updated note data.
   * @returns A promise that resolves to void.
   */
  async updateNote(
    req: TypedRequest<IUpdateNoteDto, IParamIdDto>,
    res: Response
  ): Promise<void> {
    const userId = req.userId;
    const noteId = req.params.id;

    const updatedNote = await this._noteService.updateNote(
      userId,
      noteId,
      req.body
    );

    const formattedResponse = this._responseFormatter.formatResponse<Note>({
      responseOptions: {
        data: updatedNote,
        status: httpStatus.OK,
        message: "Note updated successfully.",
      },
    });

    res.status(httpStatus.OK).json(formattedResponse);
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
    const noteId = req.params.id;

    await this._noteService.deleteNote(userId, noteId);

    const formattedResponse = this._responseFormatter.formatResponse({
      responseOptions: {
        status: httpStatus.OK,
        message: "Note deleted successfully.",
      },
    });

    res.status(httpStatus.OK).json(formattedResponse);
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
    const noteId = req.params.id;

    const note = await this._noteService.findNote(userId, noteId);

    const formattedResponse = this._responseFormatter.formatResponse<Note>({
      responseOptions: {
        data: note,
        status: httpStatus.OK,
        message: "Note retrieved successfully.",
      },
    });

    res.status(httpStatus.OK).json(formattedResponse);
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
    const paginationQueries = this._responseFormatter.getPaginationQueries({
      reqQuery: req.query,
      itemsPerPage: 8,
    });

    const paginatedData = await this._noteService.fetchUserNotes({
      userId,
      ...paginationQueries,
    });

    const formattedResponse = this._responseFormatter.formatPaginatedResponse({
      page: req.query.page ?? 1,
      paginatedData,
      responseOptions: {
        status: httpStatus.OK,
        message: "User notes retrieved successfully.",
      },
    });

    res.status(httpStatus.OK).json(formattedResponse);
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
    const paginationQueries = this._responseFormatter.getPaginationQueries({
      reqQuery: req.query,
      itemsPerPage: 2,
    });

    const notes = await this._noteService.fetchRecentNotes({
      userId,
      ...paginationQueries,
    });

    const formattedResponse = this._responseFormatter.formatResponse<Note[]>({
      responseOptions: {
        data: notes,
        status: httpStatus.OK,
        message: "Recent notes retrieved successfully.",
      },
    });

    res.status(httpStatus.OK).json(formattedResponse);
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
    const paginationQueries = this._responseFormatter.getPaginationQueries({
      reqQuery: req.query,
      itemsPerPage: 2,
    });

    const notes = await this._noteService.fetchRecentNotes({
      userId,
      ...paginationQueries,
    });

    const formattedResponse = this._responseFormatter.formatResponse<Note[]>({
      responseOptions: {
        data: notes,
        status: httpStatus.OK,
        message: "Recent updated notes retrieved successfully.",
      },
    });

    res.status(httpStatus.OK).json(formattedResponse);
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

    const paginationQueries = this._responseFormatter.getPaginationQueries({
      reqQuery: req.query,
      itemsPerPage: 8,
    });

    const paginatedData = await this._noteService.fetchNotesByVideoId({
      videoId: id,
      userId,
      ...paginationQueries,
    });

    const formattedResponse = this._responseFormatter.formatPaginatedResponse({
      page: req.query.page ?? 1,
      paginatedData,
      responseOptions: {
        status: httpStatus.OK,
        message: "Notes retrieved successfully.",
      },
    });

    res.status(httpStatus.OK).json(formattedResponse);
  }
}
