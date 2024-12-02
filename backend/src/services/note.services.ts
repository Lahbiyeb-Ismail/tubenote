import type { Note, Prisma } from "@prisma/client";

import prismaClient from "../lib/prisma";
import handleAsyncOperation from "../utils/handleAsyncOperation";

type UserIdParam = { userId: string };
type NoteIdParam = { noteId: string };
type VideoIdParam = { videoId: string };

type OrderByParam = {
	orderBy?:
		| Prisma.NoteOrderByWithRelationInput
		| Prisma.NoteOrderByWithRelationInput[];
};

type Pagination = {
	limit: number;
	skip: number;
};

type FetchLatestUserNotesProps = UserIdParam & OrderByParam & { take: number };

type EditNoteProps = UserIdParam &
	NoteIdParam & {
		data: Prisma.NoteUpdateInput;
	};

type FetchUserNotesProps = UserIdParam & OrderByParam & Pagination;

type FetchNotesByVideoIdProps = UserIdParam & VideoIdParam & Pagination;
/**
 * Fetches notes for a specific user with pagination and sorting options.
 *
 * @param {Object} params - The parameters for fetching user notes.
 * @param {string} params.userId - The ID of the user whose notes are to be fetched.
 * @param {number} params.limit - The maximum number of notes to fetch.
 * @param {number} params.skip - The number of notes to skip (for pagination).
 * @param {Object} [params.orderBy={ createdAt: 'desc' }] - The sorting order of the notes.
 * @param {string} params.orderBy.createdAt - The sorting order based on the creation date.
 * @returns {Promise<Note[]>} A promise that resolves to an array of notes.
 * @throws Will throw an error if the notes could not be fetched.
 */
export async function fetchUserNotes({
	userId,
	limit,
	skip,
	orderBy = { createdAt: "desc" },
}: FetchUserNotesProps): Promise<Note[]> {
	return handleAsyncOperation(
		() =>
			prismaClient.note.findMany({
				where: {
					userId,
				},
				take: limit,
				skip,
				orderBy,
			}),
		{ errorMessage: "Failed to fetch user notes." },
	);
}

export async function userNotesCount({ userId }: UserIdParam): Promise<number> {
	return handleAsyncOperation(
		() =>
			prismaClient.note.count({
				where: {
					userId,
				},
			}),
		{ errorMessage: "Failed to count user notes." },
	);
}

/**
 * Saves a new note to the database.
 *
 * @param noteData - The data for the note to be created.
 * @returns A promise that resolves to the created note.
 */
export async function saveNote(
	noteData: Prisma.NoteCreateInput,
): Promise<Note> {
	return handleAsyncOperation(
		() =>
			prismaClient.note.create({
				data: {
					...noteData,
				},
			}),
		{ errorMessage: "Failed to create note." },
	);
}

/**
 * Deletes a note by its ID for a specific user.
 *
 * @param {UserIdParam & NoteIdParam} params - The parameters containing the user ID and note ID.
 * @param {string} params.userId - The ID of the user.
 * @param {string} params.noteId - The ID of the note to be deleted.
 * @returns {Promise<Note>} A promise that resolves to the deleted note.
 */
export async function deleteNoteById({
	userId,
	noteId,
}: UserIdParam & NoteIdParam): Promise<Note> {
	return handleAsyncOperation(
		() =>
			prismaClient.note.delete({
				where: {
					id: noteId,
					userId,
				},
			}),
		{ errorMessage: "Failed to delete note." },
	);
}

/**
 * Fetches a note by its ID and the user ID.
 *
 * @param {Object} params - The parameters for fetching the note.
 * @param {string} params.noteId - The ID of the note to fetch.
 * @param {string} params.userId - The ID of the user who owns the note.
 * @returns {Promise<Note | null>} A promise that resolves to the note if found, otherwise null.
 */
export async function fetchNoteById({
	noteId,
	userId,
}: UserIdParam & NoteIdParam): Promise<Note | null> {
	return handleAsyncOperation(
		() =>
			prismaClient.note.findFirst({
				where: {
					id: noteId,
					userId,
				},
			}),
		{ errorMessage: "Failed to find note." },
	);
}

/**
 * Edits a note for a specific user.
 *
 * @param {Object} params - The parameters for editing the note.
 * @param {string} params.userId - The ID of the user who owns the note.
 * @param {string} params.noteId - The ID of the note to be edited.
 * @param {Object} params.data - The new data for the note.
 * @returns {Promise<Note>} The updated note.
 */
export async function editNote({
	userId,
	noteId,
	data,
}: EditNoteProps): Promise<Note> {
	return handleAsyncOperation(
		() =>
			prismaClient.note.update({
				where: {
					id: noteId,
					userId,
				},
				data,
			}),
		{ errorMessage: "Failed to update note." },
	);
}

/**
 * Fetches the latest notes for a specific user.
 *
 * @param {Object} params - The parameters for fetching the latest user notes.
 * @param {string} params.userId - The ID of the user whose notes are to be fetched.
 * @param {number} params.take - The number of notes to fetch.
 * @param {Object} [params.orderBy={ createdAt: 'desc' }] - The order by which to sort the notes.
 * @param {string} params.orderBy.createdAt - The field by which to order the notes, default is 'desc'.
 * @returns {Promise<Note[]>} A promise that resolves to an array of notes.
 */
export async function fetchLatestUserNotes({
	userId,
	take,
	orderBy = { createdAt: "desc" },
}: FetchLatestUserNotesProps): Promise<Note[]> {
	return handleAsyncOperation(
		() =>
			prismaClient.note.findMany({
				where: {
					userId,
				},
				orderBy,
				take,
			}),
		{ errorMessage: "Failed to find latest user notes." },
	);
}

/**
 * Fetches notes associated with a specific video ID for a given user.
 *
 * @param {Object} params - The parameters for fetching notes.
 * @param {string} params.userId - The ID of the user.
 * @param {string} params.videoId - The ID of the video.
 * @param {number} params.limit - The maximum number of notes to fetch.
 * @param {number} params.skip - The number of notes to skip.
 * @returns {Promise<Note[]>} A promise that resolves to an array of notes.
 *
 * @throws Will throw an error if the notes cannot be fetched.
 */
export async function fetchNotesByVideoId({
	userId,
	videoId,
	limit,
	skip,
}: FetchNotesByVideoIdProps): Promise<Note[]> {
	return handleAsyncOperation(
		() =>
			prismaClient.note.findMany({
				where: {
					userId,
					videoId,
				},
				take: limit,
				skip,
				orderBy: {
					createdAt: "desc",
				},
			}),
		{ errorMessage: "Failed to fetch notes by video ID." },
	);
}

/**
 * Retrieves the count of notes for a specific video and user.
 *
 * @param {UserIdParam & VideoIdParam} params - The parameters containing userId and videoId.
 * @param {string} params.userId - The ID of the user.
 * @param {string} params.videoId - The ID of the video.
 * @returns {Promise<number>} - A promise that resolves to the count of notes.
 * @throws {Error} - Throws an error if the operation fails.
 */
export async function getVideoNotesCount({
	userId,
	videoId,
}: UserIdParam & VideoIdParam): Promise<number> {
	return handleAsyncOperation(
		() =>
			prismaClient.note.count({
				where: {
					userId,
					videoId,
				},
			}),
		{ errorMessage: "Failed to count video notes." },
	);
}
