import type { Note, Prisma } from '@prisma/client';
import prismaClient from '../lib/prisma';

type UserIdParam = { userId: string };
type NoteIdParam = { noteId: string };
type OrderByParam = {
  orderBy?:
    | Prisma.NoteOrderByWithRelationInput
    | Prisma.NoteOrderByWithRelationInput[];
};
type FetchLatestUserNotesProps = UserIdParam & OrderByParam & { take: number };

type EditNoteProps = UserIdParam &
  NoteIdParam & {
    data: Prisma.NoteUpdateInput;
  };

/**
 * Fetches all notes associated with a specific user.
 *
 * @param userId - The unique identifier of the user whose notes are to be fetched.
 * @returns A promise that resolves to an array of `Note` objects belonging to the specified user.
 */
export async function fetchUserNotes({ userId }: UserIdParam): Promise<Note[]> {
  const notes = await prismaClient.note.findMany({
    where: {
      userId,
    },
  });

  return notes;
}

/**
 * Saves a new note to the database.
 *
 * @param noteData - The data for the note to be created.
 * @returns A promise that resolves to the created note.
 */
export async function saveNote(
  noteData: Prisma.NoteCreateInput
): Promise<Note> {
  const note = await prismaClient.note.create({
    data: {
      ...noteData,
    },
  });

  return note;
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
  const note = await prismaClient.note.delete({
    where: {
      id: noteId,
      userId,
    },
  });

  return note;
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
  const note = await prismaClient.note.findUnique({
    where: {
      id: noteId,
      userId,
    },
  });

  return note;
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
  const updatedNote = await prismaClient.note.update({
    where: {
      id: noteId,
      userId,
    },
    data,
  });

  return updatedNote;
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
  orderBy = { createdAt: 'desc' },
}: FetchLatestUserNotesProps): Promise<Note[]> {
  const notes = await prismaClient.note.findMany({
    where: {
      userId,
    },
    orderBy,
    take,
  });

  return notes;
}
