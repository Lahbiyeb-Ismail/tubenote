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
