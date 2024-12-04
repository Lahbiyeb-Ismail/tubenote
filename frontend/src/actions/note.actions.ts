import axiosInstance from "@/lib/axios.lib";
import type { Pagination } from "@/types";
import type {
	CreateNoteResponse,
	Note,
	NewNote,
	UpdateNoteProps,
} from "@/types/note.types";

type UserNotes = {
	page: number;
	limit: number;
};

/**
 * Creates a new note by sending a POST request to the '/notes' endpoint.
 *
 * @param {Note} note - The note object to be created.
 * @returns {Promise<CreateNoteResponse>} - A promise that resolves to the response data.
 */
export async function createNote(note: NewNote): Promise<CreateNoteResponse> {
	const response = await axiosInstance.post("/notes", note);

	return response.data;
}

/**
 * Fetches user notes with pagination.
 *
 * @param {Object} params - The parameters for fetching user notes.
 * @param {number} params.page - The page number to fetch.
 * @param {number} params.limit - The number of notes per page.
 * @returns {Promise<{ notes: Note[]; pagination: Pagination }>} A promise that resolves to an object containing the notes and pagination information.
 */
export async function getUserNotes({
	page,
	limit,
}: UserNotes): Promise<{ notes: Note[]; pagination: Pagination }> {
	const response = await axiosInstance(`/notes?page=${page}&limit=${limit}`);

	const { notes, pagination } = response.data;

	return { notes, pagination };
}

/**
 * Deletes a note with the specified ID.
 *
 * @param {string} noteId - The ID of the note to delete.
 * @returns {Promise<{ message: string }>} A promise that resolves
 * to an object containing a message.
 */
export async function deleteNote(noteId: string): Promise<{ message: string }> {
	const response = await axiosInstance.delete(`/notes/${noteId}`);

	return response.data;
}

/**
 * Fetches a note by its ID.
 *
 * @param {string} noteId - The unique identifier of the note to retrieve.
 * @returns {Promise<Note>} A promise that resolves to the note object.
 */
export async function getNoteById(noteId: string): Promise<Note> {
	const response = await axiosInstance.get(`/notes/${noteId}`);

	return response.data.note;
}

/**
 * Updates an existing note with the provided title and content.
 *
 * @param {UpdateNoteProps} params - The parameters for updating the note.
 * @param {string} params.noteId - The ID of the note to update.
 * @param {string} params.title - The new title for the note.
 * @param {string} params.content - The new content for the note.
 * @returns {Promise<Note>} A promise that resolves to the updated note.
 */
export async function updateNote({
	noteId,
	title,
	content,
	timestamp,
}: UpdateNoteProps): Promise<Note> {
	const response = await axiosInstance.patch(`/notes/${noteId}`, {
		title,
		content,
		timestamp,
	});

	return response.data.note;
}

/**
 * Fetches the recent notes of the user.
 *
 * @returns {Promise<Note[]>} A promise that resolves to an array of recent notes.
 */
export async function getRecentNotes(): Promise<Note[]> {
	const response = await axiosInstance.get("/notes/recent");

	return response.data.notes;
}

/**
 * Fetches the recently updated notes from the server.
 *
 * @returns {Promise<Note[]>} A promise that resolves to an array of recently updated notes.
 */
export async function getRecentlyUpdatedNotes(): Promise<Note[]> {
	const response = await axiosInstance.get("/notes/recently-updated");

	return response.data.notes;
}

export async function exportNoteAsPDF(noteId: string) {
	const response = await axiosInstance.post(
		`/notes/export-pdf/${noteId}`,
		{},
		{
			responseType: "blob",
		},
	);

	return response.data;
}
