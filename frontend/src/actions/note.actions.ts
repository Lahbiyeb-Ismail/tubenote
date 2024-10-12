import axiosInstance from '@/lib/axios.lib';
import type { CreateNoteResponse, INote, Note } from '@/types/note.types';

/**
 * Creates a new note by sending a POST request to the '/notes' endpoint.
 *
 * @param {Note} note - The note object to be created.
 * @returns {Promise<CreateNoteResponse>} - A promise that resolves to the response data.
 */
export async function createNote(note: Note): Promise<CreateNoteResponse> {
  const response = await axiosInstance.post('/notes', note);

  return response.data;
}

/**
 * Fetches the notes for the current user.
 *
 * @returns {Promise<Note[]>} A promise that resolves to an array of notes.
 */
export async function getUserNotes(): Promise<INote[]> {
  const response = await axiosInstance('/notes');

  const notes = response.data.notes;

  return notes;
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
