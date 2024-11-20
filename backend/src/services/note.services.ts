import type { Note, Prisma } from '@prisma/client';
import prismaClient from '../lib/prisma';

/**
 * Fetches all notes associated with a specific user.
 *
 * @param userId - The unique identifier of the user whose notes are to be fetched.
 * @returns A promise that resolves to an array of `Note` objects belonging to the specified user.
 */
export async function fetchUserNotes(userId: string): Promise<Note[]> {
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
 * Deletes a note by its ID.
 *
 * @param {string} noteId - The ID of the note to be deleted.
 * @returns {Promise<Note>} A promise that resolves to the deleted note.
 */
export async function deleteNoteById(noteId: string): Promise<Note> {
  const note = await prismaClient.note.delete({
    where: {
      id: noteId,
    },
  });

  return note;
}

type FetchNoteByIdProps = {
  noteId: string;
  userId: string;
};

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
}: FetchNoteByIdProps): Promise<Note | null> {
  const note = await prismaClient.note.findUnique({
    where: {
      id: noteId,
      userId,
    },
  });

  return note;
}

type EditNoteProps = {
  noteId: string;
  data: Prisma.NoteUpdateInput;
};

/**
 * Edits an existing note with the provided data.
 *
 * @param {EditNoteProps} param0 - The properties required to edit a note.
 * @param {string} param0.noteId - The ID of the note to be edited.
 * @param {Partial<Note>} param0.data - The new data to update the note with.
 * @returns {Promise<Note>} - A promise that resolves to the updated note.
 */
export async function editNote({ noteId, data }: EditNoteProps): Promise<Note> {
  const updatedNote = await prismaClient.note.update({
    where: {
      id: noteId,
    },
    data,
  });

  return updatedNote;
}
