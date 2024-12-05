import type { Request, Response } from "express";
import httpStatus from "http-status";

import type { EmptyRecord, PaginationQuery, TypedRequest } from "../types";
import type { NoteBody, NoteIdParam, UpdateNoteBody } from "../types/note.type";

import {
	deleteNoteById,
	editNote,
	fetchLatestUserNotes,
	fetchNoteById,
	fetchUserNotes,
	saveNote,
	userNotesCount,
} from "../services/note.services";

/**
 * Creates a new note for the authenticated user.
 *
 * @param req - The request object containing the payload and body data.
 * @param res - The response object used to send back the appropriate HTTP response.
 *
 * The function performs the following steps:
 * 1. Extracts the userID from the request payload.
 * 2. Checks if the userID is present; if not, responds with an UNAUTHORIZED status.
 * 3. Fetches the user from the database using the userID.
 * 4. Checks if the user exists; if not, responds with a NOT_FOUND status.
 * 5. Extracts the title, content, videoTitle, thumbnail, and videoId from the request body.
 * 6. Checks if all required fields are present; if not, responds with a BAD_REQUEST status.
 * 7. Attempts to create a new note in the database with the provided data.
 * 8. If successful, responds with a CREATED status and the created note.
 * 9. If an error occurs during note creation, responds with an INTERNAL_SERVER_ERROR status.
 *
 * @throws {Error} If there is an issue with the database operation.
 */
export async function createNote(
	req: TypedRequest<NoteBody>,
	res: Response,
): Promise<void> {
	const userId = req.userId;

	const noteData = {
		...req.body,
		userId,
	};

	const note = await saveNote(noteData);

	res
		.status(httpStatus.CREATED)
		.json({ message: "Note created successfully.", note });
}

/**
 * Retrieves the notes for a specific user with pagination.
 *
 * @param req - The request object containing userId and query parameters for pagination.
 * @param res - The response object used to send the notes and pagination information.
 * @returns A promise that resolves to void.
 *
 * The function extracts the userId from the request object and retrieves the page and limit
 * query parameters for pagination. It calculates the number of notes to skip based on the
 * current page and limit. Then, it fetches the total count of notes and the notes for the
 * user concurrently. Finally, it calculates the total number of pages and sends the notes
 * along with pagination information in the response.
 */
export async function getUserNotes(
	req: TypedRequest<EmptyRecord, EmptyRecord, PaginationQuery>,
	res: Response,
): Promise<void> {
	const userId = req.userId;

	const page = Number(req.query.page);
	const limit = Number(req.query.limit);

	const skip = (page - 1) * limit;

	const [notesCount, notes] = await Promise.all([
		userNotesCount({ userId }),
		fetchUserNotes({ userId, limit, skip }),
	]);

	const totalPages = Math.ceil(notesCount / limit);

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
 * Deletes a note based on the provided note ID.
 *
 * @param req - The request object containing the payload and parameters.
 * @param res - The response object used to send the response.
 *
 * The function performs the following steps:
 * 1. Extracts the userID from the request payload.
 * 2. If the userID is not present, responds with an UNAUTHORIZED status.
 * 3. Extracts the noteId from the request parameters.
 * 4. If the noteId is not present, responds with a BAD_REQUEST status.
 * 5. Attempts to find the user in the database using the userID.
 * 6. If the user is not found, responds with a NOT_FOUND status.
 * 7. Deletes the note from the database using the noteId.
 * 8. If successful, responds with an OK status and a success message.
 * 9. If an error occurs during the process, responds with an
 * INTERNAL_SERVER_ERROR status and an error message.
 */
export async function deleteNote(
	req: TypedRequest<EmptyRecord, NoteIdParam>,
	res: Response,
): Promise<void> {
	const userId = req.userId;
	const { noteId } = req.params;

	await deleteNoteById({ userId, noteId });

	res.status(httpStatus.OK).json({ message: "Note deleted successfully." });
}

/**
 * Retrieves a note by its ID for the authenticated user.
 *
 * @param req - The request object containing the payload with userID and
 * params with noteId.
 * @param res - The response object used to send back the appropriate HTTP
 * status and JSON data.
 *
 * @remarks
 * - If the userID is not present in the request payload, responds with
 * `401 Unauthorized`.
 * - If the noteId is not provided in the request parameters, responds with
 * `400 Bad Request`.
 * - If the user is not found in the database, responds with `404 Not Found`.
 * - If the note is not found for the given user, responds with `404 Not Found`.
 * - If an error occurs during the process, responds with `500 Internal Server Error`.
 *
 * @returns A JSON response containing the note data if found, or an error
 * message otherwise.
 */
export async function getNoteById(
	req: TypedRequest<EmptyRecord, NoteIdParam>,
	res: Response,
): Promise<void> {
	const userId = req.userId;
	const { noteId } = req.params;

	const note = await fetchNoteById({ noteId, userId });

	if (!note) {
		res.status(httpStatus.NOT_FOUND).json({ message: "Note not found." });
		return;
	}

	res.status(httpStatus.OK).json({ note });
}

/**
 * Updates an existing note for the authenticated user.
 *
 * @param req - The request object containing the payload, parameters, and body.
 * @param res - The response object used to send back the appropriate HTTP response.
 *
 * The function performs the following steps:
 * 1. Extracts the userID from the request payload.
 * 2. Checks if the userID is present; if not, responds with an UNAUTHORIZED status.
 * 3. Extracts the noteId from the request parameters.
 * 4. Checks if the noteId is present; if not, responds with a BAD_REQUEST status.
 * 5. Extracts the title and content from the request body.
 * 6. Attempts to find the user in the database using the userID.
 * 7. If the user is not found, responds with a NOT_FOUND status.
 * 8. Attempts to find the note in the database using the noteId and userId.
 * 9. If the note is not found, responds with a NOT_FOUND status.
 * 10. Updates the note with the new title and content.
 * 11. Responds with an OK status and the updated note if successful.
 * 12. Catches any errors and responds with an INTERNAL_SERVER_ERROR status.
 *
 * @returns {Promise<void>} - A promise that resolves when the function completes.
 */
export async function updateNote(
	req: TypedRequest<UpdateNoteBody, NoteIdParam>,
	res: Response,
): Promise<void> {
	const userId = req.userId;
	const { noteId } = req.params;

	const { title, content, timestamp } = req.body;

	const note = await fetchNoteById({ noteId, userId });

	if (!note) {
		res.status(httpStatus.NOT_FOUND).json({ message: "Note not found." });
		return;
	}

	const updatedNote = await editNote({
		userId,
		noteId,
		data: { title, content, timestamp },
	});

	res
		.status(httpStatus.OK)
		.json({ message: "Note Updated successfully.", note: updatedNote });
}

/**
 * Retrieves the most recent notes for a user.
 *
 * @param req - The request object containing the user's payload.
 * @param res - The response object to send the result.
 *
 * @remarks
 * This function checks if the user is authenticated by verifying the presence of a userID
 * in the request payload.
 * If the user is not authenticated, it responds with a 401 Unauthorized status.
 * If the user is authenticated, it fetches the user from the database.
 * If the user is not found, it responds with a 404 Not Found status.
 * If the user is found, it retrieves the most recent notes (up to 2) for the user, ordered
 * by creation date in descending order.
 * If an error occurs during the process, it responds with a 500 Internal Server Error status.
 *
 * @returns A JSON response containing the user's most recent notes or an error message.
 */
export async function getUserRecentNotes(
	req: Request,
	res: Response,
): Promise<void> {
	const userId = req.userId;

	const notes = await fetchLatestUserNotes({ userId, take: 2 });

	res.status(httpStatus.OK).json({ notes });
}

/**
 * Retrieves the most recently updated notes for a user.
 *
 * @param req - The request object containing the payload with user information.
 * @param res - The response object used to send the response back to the client.
 *
 * @remarks
 * This function checks if the user is authenticated by verifying the presence of
 * a userID in the request payload.
 * If the user is not authenticated, it responds with a 401 Unauthorized status.
 * If the user is authenticated, it fetches the user from the database.
 * If the user is not found, it responds with a 404 Not Found status.
 * If the user is found, it retrieves the most recently updated notes for the user,
 * limited to the 2 most recent notes.
 * If an error occurs during the process, it responds with a 500 Internal Server Error status.
 *
 * @returns A JSON response containing the most recently updated notes for the user or an error message.
 */
export async function getUserRecentlyUpdatedNotes(
	req: Request,
	res: Response,
): Promise<void> {
	const userId = req.userId;

	const notes = await fetchLatestUserNotes({
		userId,
		take: 2,
		orderBy: { updatedAt: "desc" },
	});

	res.status(httpStatus.OK).json({ notes });
}
