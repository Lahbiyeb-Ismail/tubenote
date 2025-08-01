import type { Note } from "@tubenote/db";
import type { ICreateNoteDto, ISearchAndPaginationQueryDto, IUpdateNoteDto } from "@tubenote/dtos";
import type { IApiSuccessResponse } from "@tubenote/types";

import type { ISessionData } from "@/types";

import { axiosInstance } from "@/lib/axios";

/**
 * Service class for managing note operations through API calls.
 * Handles all CRUD operations for notes including creation, retrieval, updating, and deletion.
 * All methods require session data for authentication and authorization.
 */
export class NoteService {
  /**
   * Counts the number of notes associated with a specific YouTube video ID.
   *
   * @param sessionData - The user session data containing access token and session ID
   * @param ytVideoId - The YouTube video ID to count notes for
   * @returns Promise resolving to an API response containing the count of notes
   */
  async countByYtVideoId(sessionData: ISessionData, ytVideoId: string): Promise<IApiSuccessResponse<number>> {
    const noteRes = await axiosInstance.get<IApiSuccessResponse<number>>(`/notes/count/${ytVideoId}`, {
      headers: {
        "Authorization": `Bearer ${sessionData.accessToken}`,
        "X-Session-ID": sessionData.sessionId,
      },
    });

    return noteRes.data;
  }

  /**
   * Retrieves all notes associated with a specific video ID with optional search and pagination.
   *
   * @param sessionData - The user session data containing access token and session ID
   * @param videoId - The video ID to retrieve notes for
   * @param queryOptions - Search and pagination options for filtering results
   * @returns Promise resolving to an API response containing an array of notes
   */
  async findAllByVideoId(sessionData: ISessionData, videoId: string, queryOptions: ISearchAndPaginationQueryDto): Promise<IApiSuccessResponse<Note[]>> {
    const noteRes = await axiosInstance.get<IApiSuccessResponse<Note[]>>(`/notes/video/${videoId}`, {
      params: queryOptions,
      headers: {
        "Authorization": `Bearer ${sessionData.accessToken}`,
        "X-Session-ID": sessionData.sessionId,
      },
    });

    return noteRes.data;
  }

  /**
   * Creates a new note for a specific video.
   *
   * @param sessionData - The user session data containing access token and session ID
   * @param noteData - The data for creating the new note
   * @param videoId - The video ID to associate the note with
   * @returns Promise resolving to an API response containing the created note
   */
  async create(sessionData: ISessionData, noteData: ICreateNoteDto, videoId: string): Promise<IApiSuccessResponse<Note>> {
    const noteRes = await axiosInstance.post<IApiSuccessResponse<Note>>(`/notes/${videoId}`, noteData, {
      headers: {
        "Authorization": `Bearer ${sessionData.accessToken}`,
        "X-Session-ID": sessionData.sessionId,
      },
    });

    return noteRes.data;
  }

  /**
   * Updates an existing note with new data.
   *
   * @param sessionData - The user session data containing access token and session ID
   * @param noteId - The ID of the note to update
   * @param noteData - The updated note data
   * @returns Promise resolving to an API response containing the updated note
   */
  async update(sessionData: ISessionData, noteId: string, noteData: IUpdateNoteDto): Promise<IApiSuccessResponse<Note>> {
    const noteRes = await axiosInstance.patch<IApiSuccessResponse<Note>>(`/notes/${noteId}`, noteData, {
      headers: {
        "Authorization": `Bearer ${sessionData.accessToken}`,
        "X-Session-ID": sessionData.sessionId,
      },
    });

    return noteRes.data;
  }

  /**
   * Retrieves a specific note by its ID.
   *
   * @param sessionData - The user session data containing access token and session ID
   * @param noteId - The ID of the note to retrieve
   * @returns Promise resolving to an API response containing the requested note
   */
  async findByNoteId(sessionData: ISessionData, noteId: string): Promise<IApiSuccessResponse<Note>> {
    const noteRes = await axiosInstance.get<IApiSuccessResponse<Note>>(`/notes/${noteId}`, {
      headers: {
        "Authorization": `Bearer ${sessionData.accessToken}`,
        "X-Session-ID": sessionData.sessionId,
      },
    });

    return noteRes.data;
  }

  /**
   * Deletes a note by its ID.
   *
   * @param sessionData - The user session data containing access token and session ID
   * @param noteId - The ID of the note to delete
   * @returns Promise resolving to an API response with null data indicating successful deletion
   */
  async delete(sessionData: ISessionData, noteId: string): Promise<IApiSuccessResponse<null>> {
    const noteRes = await axiosInstance.delete<IApiSuccessResponse<null>>(`/notes/${noteId}`, {
      headers: {
        "Authorization": `Bearer ${sessionData.accessToken}`,
        "X-Session-ID": sessionData.sessionId,
      },
    });

    return noteRes.data;
  }

  /**
   * Retrieves all notes for the authenticated user with optional search and pagination.
   *
   * @param sessionData - The user session data containing access token and session ID
   * @param queryOptions - Search and pagination options for filtering results
   * @returns Promise resolving to an API response containing an array of all user notes
   */
  async findAll(sessionData: ISessionData, queryOptions: ISearchAndPaginationQueryDto): Promise<IApiSuccessResponse<Note[]>> {
    const noteRes = await axiosInstance.get<IApiSuccessResponse<Note[]>>("/notes", {
      params: queryOptions,
      headers: {
        "Authorization": `Bearer ${sessionData.accessToken}`,
        "X-Session-ID": sessionData.sessionId,
      },
    });

    return noteRes.data;
  }
}
