import type { ICreateNoteDto, IParamIdDto, ISearchAndPaginationQueryDto, IUpdateNoteDto } from "@tubenote/dtos";
import type { Response } from "express";

import type { EmptyRecord, TypedRequest } from "@/types";

import { NoteService } from "./note.service";

const noteService = new NoteService();

/**
 * Controller class for handling note-related HTTP requests.
 * Manages CRUD operations for notes including creation, retrieval, updating, and deletion.
 * All methods require session data for user authentication and authorization.
 */
export class NoteController {
  /**
   * Retrieves the count of notes for a specific YouTube video.
   *
   * @param req - The typed request object containing session data and video ID parameter
   * @param res - The HTTP response object
   * @returns Promise<void> - Returns a JSON response with the note count and status code
   * @throws Returns error response with appropriate status code if operation fails
   */
  async getNotesCountByYtVideoId(req: TypedRequest<EmptyRecord, IParamIdDto>, res: Response) {
    const sessionData = req.sessionData;
    const ytVideoId = req.params.id;

    try {
      const data = await noteService.countByYtVideoId(sessionData, ytVideoId);

      res.status(data.statusCode).json(data);
    }
    catch (err: any) { res.status(err.status || 500).json(err); }
  }

  /**
   * Retrieves all notes associated with a specific video ID with optional search and pagination.
   *
   * @param req - The typed request object containing session data, video ID, and query options
   * @param res - The HTTP response object
   * @returns Promise<void> - Returns a JSON response with filtered and paginated notes
   * @throws Returns error response with appropriate status code if operation fails
   */
  async getNotesByVideoId(req: TypedRequest<EmptyRecord, IParamIdDto, ISearchAndPaginationQueryDto>, res: Response) {
    const sessionData = req.sessionData;
    const videoId = req.params.id;
    const queryOptions = req.query;

    try {
      const data = await noteService.findAllByVideoId(sessionData, videoId, queryOptions);

      res.status(data.statusCode).json(data);
    }
    catch (err: any) { res.status(err.status || 500).json(err); }
  }

  /**
   * Creates a new note for a specific video.
   *
   * @param req - The typed request object containing session data, video ID, and note creation data
   * @param res - The HTTP response object
   * @returns Promise<void> - Returns a JSON response with the created note data
   * @throws Returns error response with appropriate status code if creation fails
   */
  async createNote(req: TypedRequest<ICreateNoteDto, IParamIdDto>, res: Response) {
    const sessionData = req.sessionData;
    const videoId = req.params.id;

    try {
      const data = await noteService.create(sessionData, req.body, videoId);

      res.status(data.statusCode).json(data);
    }
    catch (err: any) { res.status(err.status || 500).json(err); }
  }

  /**
   * Updates an existing note by its ID.
   *
   * @param req - The typed request object containing session data, note ID, and update data
   * @param res - The HTTP response object
   * @returns Promise<void> - Returns a JSON response with the updated note data
   * @throws Returns error response with appropriate status code if update fails
   */
  async updateNote(req: TypedRequest<IUpdateNoteDto, IParamIdDto>, res: Response) {
    const sessionData = req.sessionData;
    const noteId = req.params.id;

    try {
      const data = await noteService.update(sessionData, noteId, req.body);

      res.status(data.statusCode).json(data);
    }
    catch (err: any) { res.status(err.status || 500).json(err); }
  }

  /**
   * Retrieves a specific note by its ID.
   *
   * @param req - The typed request object containing session data and note ID parameter
   * @param res - The HTTP response object
   * @returns Promise<void> - Returns a JSON response with the requested note data
   * @throws Returns error response with appropriate status code if note is not found or operation fails
   */
  async getNoteById(req: TypedRequest<EmptyRecord, IParamIdDto>, res: Response) {
    const sessionData = req.sessionData;
    const noteId = req.params.id;

    try {
      const data = await noteService.findByNoteId(sessionData, noteId);

      res.status(data.statusCode).json(data);
    }
    catch (err: any) { res.status(err.status || 500).json(err); }
  }

  /**
   * Deletes a specific note by its ID.
   *
   * @param req - The typed request object containing session data and note ID parameter
   * @param res - The HTTP response object
   * @returns Promise<void> - Returns a JSON response confirming deletion
   * @throws Returns error response with appropriate status code if deletion fails
   */
  async deleteNote(req: TypedRequest<EmptyRecord, IParamIdDto>, res: Response) {
    const sessionData = req.sessionData;
    const noteId = req.params.id;

    try {
      const data = await noteService.delete(sessionData, noteId);

      res.status(data.statusCode).json(data);
    }
    catch (err: any) { res.status(err.status || 500).json(err); }
  }

  /**
   * Retrieves all notes belonging to the authenticated user with optional search and pagination.
   *
   * @param req - The typed request object containing session data and query options
   * @param res - The HTTP response object
   * @returns Promise<void> - Returns a JSON response with user's notes, filtered and paginated
   * @throws Returns error response with appropriate status code if operation fails
   */
  async getUserNotes(req: TypedRequest<EmptyRecord, EmptyRecord, ISearchAndPaginationQueryDto>, res: Response) {
    const sessionData = req.sessionData;
    const queryOptions = req.query;

    try {
      const data = await noteService.findAll(sessionData, queryOptions);

      res.status(data.statusCode).json(data);
    }
    catch (err: any) { res.status(err.status || 500).json(err); }
  }
}
