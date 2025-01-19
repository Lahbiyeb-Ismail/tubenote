import type { Response } from "express";
import httpStatus from "http-status";

import type { EmptyRecord, TypedRequest } from "@/types";

import type { FindManyDto } from "@common/dtos/find-many.dto";
import type { IdParamDto } from "@common/dtos/id-param.dto";
import type { QueryPaginationDto } from "@common/dtos/query-pagination.dto";

import type { CreateNoteDto } from "./dtos/create-note.dto";
import type { DeleteNoteDto } from "./dtos/delete-note.dto";
import type { FindNoteDto } from "./dtos/find-note.dto";
import type { UpdateNoteDto } from "./dtos/update-note.dto";

import type { INoteController, INoteService } from "./note.types";

/**
 * Controller for handling note-related operations.
 */
export class NoteController implements INoteController {
  constructor(private readonly _noteService: INoteService) {}

  /**
   * Adds a new note for the authenticated user.
   *
   * @param req - The request object containing the note data and user ID.
   * @param res - The response object used to send the status and result.
   * @returns A promise that resolves to void.
   */
  async createNote(
    req: TypedRequest<CreateNoteDto>,
    res: Response
  ): Promise<void> {
    const userId = req.userId;

    const note = await this._noteService.createNote(userId, req.body);

    res
      .status(httpStatus.CREATED)
      .json({ message: "Note created successfully.", note });
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

    const updateNoteDto = req.body;
    const findNoteDto: FindNoteDto = { id, userId };

    const updatedNote = await this._noteService.updateNote(
      findNoteDto,
      updateNoteDto
    );

    res
      .status(httpStatus.OK)
      .json({ message: "Note updated successfully.", note: updatedNote });
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

    const deleteNoteDto: DeleteNoteDto = { id, userId };

    await this._noteService.deleteNote(deleteNoteDto);

    res.status(httpStatus.OK).json({ message: "Note deleted successfully." });
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

    const findNoteDto: FindNoteDto = { id, userId };

    const note = await this._noteService.findNote(findNoteDto);

    res.status(httpStatus.OK).json({ note });
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

    const page = Number(req.query.page);
    const limit = Number(req.query.limit);

    const skip = (page - 1) * limit;

    const findManyDto: FindManyDto = {
      userId,
      skip,
      limit,
      sort: { by: "createdAt", order: "desc" },
    };

    const { notes, notesCount, totalPages } =
      await this._noteService.fetchUserNotes(findManyDto);

    res.status(httpStatus.OK).json({
      notes,
      pagination: {
        totalPages,
        currentPage: page,
        totalNotes: notesCount,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  }

  /**
   * Retrieves the most recent notes for a specific user.
   *
   * @param req - The request object containing user information.
   * @param res - The response object used to send back the notes.
   * @returns A promise that resolves to void.
   */
  async getUserRecentNotes(req: TypedRequest, res: Response): Promise<void> {
    const userId = req.userId;

    const findManyDto: FindManyDto = {
      userId,
      limit: 2,
      sort: { by: "createdAt", order: "desc" },
    };

    const notes = await this._noteService.fetchRecentNotes(findManyDto);

    res.status(httpStatus.OK).json({ notes });
  }

  /**
   * Retrieves the most recently updated notes for the authenticated user.
   *
   * @param req - The request object, containing the authenticated user's ID.
   * @param res - The response object used to send the JSON response.
   * @returns A promise that resolves to void.
   */
  async getRecentlyUpatedNotes(
    req: TypedRequest,
    res: Response
  ): Promise<void> {
    const userId = req.userId;

    const findManyDto: FindManyDto = {
      userId,
      limit: 2,
      sort: { by: "updatedAt", order: "desc" },
    };

    const notes = await this._noteService.fetchRecentNotes(findManyDto);

    res.status(httpStatus.OK).json({ notes });
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

    const page = Number(req.query.page);
    const limit = Number(req.query.limit);

    const skip = (page - 1) * limit;

    const findManyDto: FindManyDto = {
      userId,
      skip,
      limit,
      sort: { by: "createdAt", order: "desc" },
    };

    const { notes, notesCount, totalPages } =
      await this._noteService.fetchNotesByVideoId(id, findManyDto);

    res.status(httpStatus.OK).json({
      notes,
      pagination: {
        totalPages,
        currentPage: page,
        totalNotes: notesCount,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  }
}
