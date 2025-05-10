import type { AxiosError } from "axios";

import type {
  ICreateNoteDto,
  IPaginationQueryDto,
  IUpdateNoteDto,
} from "@tubenote/dtos";
import type {
  IApiErrorResponse,
  IApiSuccessResponse,
  Note,
} from "@tubenote/types";
import { asyncTryCatch } from "@tubenote/utils";

import { axiosInstance } from "@/lib";

/**
 * Creates a new note associated with a specific video.
 *
 * @param {Object} params - The parameters for creating a note.
 * @param {string} params.videoId - The ID of the video to associate the note with.
 * @param {ICreateNoteDto} params.createNoteData - The data for the note to be created.
 *
 * @returns {Promise<IApiSuccessResponse<Note>>} A promise that resolves to the API success response containing the created note.
 * @throws {Error} Throws an error if the note creation fails. If the error is from the API, it includes the error message from the API response.
 */
export async function createNote({
  videoId,
  createNoteData,
}: { videoId: string; createNoteData: ICreateNoteDto }): Promise<
  IApiSuccessResponse<Note>
> {
  const { data: response, error } = await asyncTryCatch(
    axiosInstance.post<IApiSuccessResponse<Note>>(
      `/notes/${videoId}`,
      createNoteData
    )
  );

  if (error) {
    const axiosError = error as AxiosError<IApiErrorResponse>;

    if (axiosError.response) {
      throw new Error(axiosError.response.data.payload.message);
    }

    throw new Error("Failed to create note");
  }

  return response.data;
}

/**
 * Fetches the user's notes with pagination and sorting options.
 *
 * @param paginationQuery - An object containing pagination and sorting parameters:
 *   - `page`: The page number to fetch.
 *   - `limit`: The number of items per page.
 *   - `order`: The order of sorting (e.g., 'asc' or 'desc').
 *   - `sortBy`: The field to sort the notes by.
 *
 * @returns A promise that resolves to an API success response containing an array of notes.
 *
 * @throws An error if the request fails. If the error is from the server, it includes the server's error message.
 */
export async function getUserNotes(
  paginationQuery: IPaginationQueryDto
): Promise<IApiSuccessResponse<Note[]>> {
  const { page, limit, order, sortBy } = paginationQuery;

  const { data: response, error } = await asyncTryCatch(
    axiosInstance.get<IApiSuccessResponse<Note[]>>(
      `/notes?page=${page}&limit=${limit}&order=${order}&sortBy=${sortBy}`
    )
  );

  if (error) {
    const axiosError = error as AxiosError<IApiErrorResponse>;

    if (axiosError.response) {
      throw new Error(axiosError.response.data.payload.message);
    }

    throw new Error("Failed to fetch notes.");
  }

  return response.data;
}

/**
 * Deletes a note by its ID.
 *
 * @param {string} noteId - The unique identifier of the note to delete.
 * @returns {Promise<IApiSuccessResponse<null>>} A promise that resolves to the API success response.
 * @throws {Error} If the request fails, an error is thrown with a message indicating the failure reason.
 */
export async function deleteNote(
  noteId: string
): Promise<IApiSuccessResponse<null>> {
  const { data: response, error } = await asyncTryCatch(
    axiosInstance.delete<IApiSuccessResponse<null>>(`/notes/${noteId}`)
  );

  if (error) {
    const axiosError = error as AxiosError<IApiErrorResponse>;

    if (axiosError.response) {
      throw new Error(axiosError.response.data.payload.message);
    }

    throw new Error("Failed to delete note.");
  }

  return response.data;
}

/**
 * Fetches a note by its ID.
 *
 * @param noteId - The unique identifier of the note to retrieve.
 * @returns A promise that resolves to an API success response containing the note.
 * @throws An error if the request fails, including a specific error message if available.
 */
export async function getNoteById(
  noteId: string
): Promise<IApiSuccessResponse<Note>> {
  const { data: response, error } = await asyncTryCatch(
    axiosInstance.get<IApiSuccessResponse<Note>>(`/notes/${noteId}`)
  );

  if (error) {
    const axiosError = error as AxiosError<IApiErrorResponse>;

    if (axiosError.response) {
      throw new Error(axiosError.response.data.payload.message);
    }

    throw new Error("Failed to fetch note.");
  }

  return response.data;
}
/**
 * Updates a note by its ID.
 *
 * @param noteId - The unique identifier of the note to update.
 * @param updateData - The data to update the note with, adhering to the `IUpdateNoteDto` interface.
 * @returns A promise that resolves to an API success response containing the updated note.
 * @throws An error if the request fails, including a specific error message if available.
 */
export async function updateNote({
  noteId,
  updateData,
}: { noteId: string; updateData: IUpdateNoteDto }): Promise<
  IApiSuccessResponse<Note>
> {
  const { data: response, error } = await asyncTryCatch(
    axiosInstance.patch<IApiSuccessResponse<Note>>(
      `/notes/${noteId}`,
      updateData
    )
  );

  if (error) {
    const axiosError = error as AxiosError<IApiErrorResponse>;

    if (axiosError.response) {
      throw new Error(axiosError.response.data.payload.message);
    }

    throw new Error("Failed to update note.");
  }

  return response.data;
}

/**
 * Fetches the most recent notes from the server.
 *
 * @returns {Promise<IApiSuccessResponse<Note[]>>} A promise that resolves to the API success response containing an array of notes.
 * @throws {Error} Throws an error if the request fails. If the error is an Axios error with a response,
 * it throws the error message from the server. Otherwise, it throws a generic error message.
 */
export async function getRecentNotes(): Promise<IApiSuccessResponse<Note[]>> {
  const { data: response, error } = await asyncTryCatch(
    axiosInstance.get<IApiSuccessResponse<Note[]>>("/notes/recent")
  );

  if (error) {
    const axiosError = error as AxiosError<IApiErrorResponse>;

    if (axiosError.response) {
      throw new Error(axiosError.response.data.payload.message);
    }

    throw new Error("Failed to fetch recent notes.");
  }

  return response.data;
}

/**
 * Fetches the list of recently updated notes from the server.
 *
 * @returns {Promise<IApiSuccessResponse<Note[]>>} A promise that resolves to the API success response containing an array of notes.
 * @throws {Error} Throws an error if the request fails. If the error is from the server, it includes the error message from the response payload.
 *
 */
export async function getRecentlyUpdatedNotes(): Promise<
  IApiSuccessResponse<Note[]>
> {
  const { data: response, error } = await asyncTryCatch(
    axiosInstance.get<IApiSuccessResponse<Note[]>>("/notes/recently-updated")
  );

  if (error) {
    const axiosError = error as AxiosError<IApiErrorResponse>;

    if (axiosError.response) {
      throw new Error(axiosError.response.data.payload.message);
    }

    throw new Error("Failed to fetch recently updated notes.");
  }

  return response.data;
}

/**
 * Fetches notes associated with a specific video ID.
 *
 * @param videoId - The unique identifier of the video for which notes are to be retrieved.
 * @returns A promise that resolves to an API success response containing an array of notes.
 * @throws An error if the request fails, including a specific error message if available.
 */
export async function getNotesByVideoId(
  videoId: string,
  paginationQuery: IPaginationQueryDto
): Promise<IApiSuccessResponse<Note[]>> {
  const { data: response, error } = await asyncTryCatch(
    axiosInstance.get<IApiSuccessResponse<Note[]>>(`/notes/video/${videoId}`, {
      params: paginationQuery,
    })
  );

  if (error) {
    const axiosError = error as AxiosError<IApiErrorResponse>;

    if (axiosError.response) {
      throw new Error(axiosError.response.data.payload.message);
    }

    throw new Error("Failed to fetch notes for video.");
  }

  return response.data;
}

// export async function exportNoteAsPDF(noteId: string): Promise<Blob> {
//   const { data: response, error } = await asyncTryCatch(
//     axiosInstance.post<Blob>(
//       `/notes/export-pdf/${noteId}`,
//       {},
//       {
//         responseType: "blob",
//       }
//     )
//   );

//   if (error) {
//     const axiosError = error as AxiosError<IApiErrorResponse>;

//     if (axiosError.response) {
//       throw new Error(axiosError.response.data.payload.message);
//     }

//     throw new Error("Failed to export note as PDF.");
//   }

//   return response;
// }
