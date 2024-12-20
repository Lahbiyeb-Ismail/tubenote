import type { Response } from "express";
import httpStatus from "http-status";

import type { EmptyRecord, PaginationQuery, TypedRequest } from "../types";
import type { NoteBody, NoteIdParam } from "../types/note.type";
import type { VideoIdParam } from "../types/video.type";

import noteService from "../services/noteService";

/**
 * Controller for handling note-related operations.
 */
class NoteController {
  /**
   * Adds a new note for the authenticated user.
   *
   * @param req - The request object containing the note data and user ID.
   * @param res - The response object used to send the status and result.
   * @returns A promise that resolves to void.
   */
  async addNewNote(req: TypedRequest<NoteBody>, res: Response): Promise<void> {
    const userId = req.userId;

    const noteData = {
      ...req.body,
      userId,
    };

    const note = await noteService.addNewNote({ data: noteData });

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
    req: TypedRequest<NoteBody, NoteIdParam>,
    res: Response
  ): Promise<void> {
    const userId = req.userId;
    const { noteId } = req.params;
    const noteData = req.body;

    const updatedNote = await noteService.updateNote({
      where: { id: noteId, userId },
      data: noteData,
    });

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
    req: TypedRequest<EmptyRecord, NoteIdParam>,
    res: Response
  ): Promise<void> {
    const userId = req.userId;
    const { noteId } = req.params;

    await noteService.deleteNote({ where: { id: noteId, userId } });

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
    req: TypedRequest<EmptyRecord, NoteIdParam>,
    res: Response
  ): Promise<void> {
    const userId = req.userId;
    const { noteId } = req.params;

    const note = await noteService.findNote({ where: { id: noteId, userId } });

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
    req: TypedRequest<EmptyRecord, EmptyRecord, PaginationQuery>,
    res: Response
  ): Promise<void> {
    const userId = req.userId;

    const page = Number(req.query.page);
    const limit = Number(req.query.limit);

    const skip = (page - 1) * limit;

    const { notes, notesCount, totalPages } = await noteService.fetchUserNotes({
      where: { userId },
      skip,
      limit,
    });

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

    const notes = await noteService.fetchRecentNotes({
      where: { userId },
      limit: 2,
    });

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

    const notes = await noteService.fetchRecentNotes({
      where: { userId },
      limit: 2,
      orderBy: { updatedAt: "desc" },
    });

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
    req: TypedRequest<EmptyRecord, VideoIdParam, PaginationQuery>,
    res: Response
  ) {
    const userId = req.userId;
    const { videoId } = req.params;

    const page = Number(req.query.page);
    const limit = Number(req.query.limit);

    const skip = (page - 1) * limit;

    const { notes, notesCount, totalPages } =
      await noteService.fetchNotesByVideoId({
        where: { userId, youtubeId: videoId },
        limit,
        skip,
      });

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

export default new NoteController();
