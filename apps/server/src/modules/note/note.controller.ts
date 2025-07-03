import type { Note } from "@tubenote/db";
import type {
  ICreateNoteDto,
  IPaginationQueryDto,
  IParamIdDto,
  ISearchAndPaginationQueryDto,
  IUpdateNoteDto,
} from "@tubenote/dtos";
import type { Response } from "express";

import httpStatus from "http-status";
import { inject, injectable } from "inversify";

import type { IResponseFormatter } from "@/modules/shared/services";
import type { EmptyRecord, TypedRequest } from "@/modules/shared/types";

import { TYPES } from "@/config/inversify/types";

import type { INoteController, INoteService } from "./note.types";

/**
 * Controller for handling note-related operations.
 *
 * This controller provides endpoints for creating, updating, deleting,
 * and retrieving notes for an authenticated user.
 * It also supports pagination for list endpoints.
 */
@injectable()
export class NoteController implements INoteController {
  /**
   * Creates an instance of NoteController.
   *
   * @param _noteService - An instance of the note service that handles business logic.
   * @param _responseFormatter - An instance of the response formatter service.
   */
  constructor(
    @inject(TYPES.NoteService) private _noteService: INoteService,
    @inject(TYPES.ResponseFormatter)
    private _responseFormatter: IResponseFormatter,
  ) {}

  /**
   * Adds a new note for the authenticated user.
   *
   * @param req - The request object containing note data (excluding userId) in the body and the userId on the request.
   * @param res - The response object used to send the HTTP status and result.
   * @returns A promise that resolves to void.
   */
  async createNote(
    req: TypedRequest<ICreateNoteDto, IParamIdDto>,
    res: Response,
  ): Promise<void> {
    const userId = req.userId;
    const videoId = req.params.id;

    const note = await this._noteService.createNote(userId, videoId, req.body);

    const formattedResponse
      = this._responseFormatter.formatSuccessResponse<Note>({
        responseOptions: {
          statusCode: httpStatus.CREATED,
          data: note,
          message: "Note created successfully.",
        },
      });

    res.status(formattedResponse.statusCode).json(formattedResponse);
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
    res: Response,
  ): Promise<void> {
    const userId = req.userId;
    const noteId = req.params.id;

    const updatedNote = await this._noteService.updateNote(
      userId,
      noteId,
      req.body,
    );

    const formattedResponse
      = this._responseFormatter.formatSuccessResponse<Note>({
        responseOptions: {
          data: updatedNote,
          message: "Note updated successfully.",
        },
      });

    res.status(formattedResponse.statusCode).json(formattedResponse);
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
    res: Response,
  ): Promise<void> {
    const userId = req.userId;
    const noteId = req.params.id;

    await this._noteService.deleteNote(userId, noteId);

    const formattedResponse
      = this._responseFormatter.formatSuccessResponse<null>({
        responseOptions: {
          message: "Note deleted successfully.",
          data: null,
        },
      });

    res.status(formattedResponse.statusCode).json(formattedResponse);
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
    res: Response,
  ): Promise<void> {
    const userId = req.userId;
    const noteId = req.params.id;

    const note = await this._noteService.findNote(userId, noteId);

    const formattedResponse
      = this._responseFormatter.formatSuccessResponse<Note>({
        responseOptions: {
          data: note,
          message: "Note retrieved successfully.",
        },
      });

    res.status(formattedResponse.statusCode).json(formattedResponse);
  }

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
  async getNotesCountByVideoId(
    req: TypedRequest<EmptyRecord, IParamIdDto>,
    res: Response,
  ): Promise<void> {
    const userId = req.userId;
    const ytVideoId = req.params.id;

    const notesCount = await this._noteService.fetchNotesCountByVideoId(userId, ytVideoId);

    const formattedResponse
      = this._responseFormatter.formatSuccessResponse<number>({
        responseOptions: {
          data: notesCount,
          message: "Notes count retrieved successfully.",
        },
      });

    res.status(formattedResponse.statusCode).json(formattedResponse);
  }

  /**
   * Retrieves the notes of a user with pagination.
   *
   * @param req - The request object containing the userId and pagination query parameters.
   * @param res - The response object used to send the HTTP status, notes data, and pagination metadata.
   * @returns A promise that resolves to void.
   */
  async getUserNotes(
    req: TypedRequest<EmptyRecord, EmptyRecord, ISearchAndPaginationQueryDto>,
    res: Response,
  ): Promise<void> {
    const userId = req.userId;

    const paginatedData = await this._noteService.fetchUserNotes(
      userId,
      req.query,
    );

    const formattedResponse = this._responseFormatter.formatPaginatedResponse<Note>({
      page: req.query.page,
      paginatedData,
      responseOptions: {
        message: "User notes retrieved successfully.",
      },
    });

    res.status(formattedResponse.statusCode).json(formattedResponse);
  }

  /**
   * Retrieves notes associated with a specific video ID, with pagination support.
   *
   * @param req - The request object containing the video ID as a parameter, the userId, and pagination query parameters.
   * @param res - The response object used to send the HTTP status, notes data, and pagination metadata.
   * @returns A promise that resolves to void.
   */
  async getNotesByVideoId(
    req: TypedRequest<EmptyRecord, IParamIdDto, IPaginationQueryDto>,
    res: Response,
  ): Promise<void> {
    const userId = req.userId;
    const videoId = req.params.id;

    const findManyDto = this._responseFormatter.getPaginationQueries({
      reqQuery: req.query,
      itemsPerPage: 8,
    });

    const paginatedData = await this._noteService.fetchNotesByVideoId(
      userId,
      videoId,
      findManyDto,
    );

    const formattedResponse = this._responseFormatter.formatPaginatedResponse({
      page: req.query.page ?? 1,
      paginatedData,
      responseOptions: {
        message: "Notes retrieved successfully.",
      },
    });

    res.status(formattedResponse.statusCode).json(formattedResponse);
  }
}
