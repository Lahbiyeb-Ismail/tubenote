import axiosInstance from '@/lib/axios.lib';
import type {
  CreateNoteResponse,
  INote,
  Note,
  UpdateNoteProps,
} from '@/types/note.types';

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

/**
 * Fetches a note by its ID.
 *
 * @param {string} noteId - The unique identifier of the note to retrieve.
 * @returns {Promise<INote>} A promise that resolves to the note object.
 */
export async function getNoteById(noteId: string): Promise<INote> {
  const response = await axiosInstance.post(`/notes/${noteId}`);

  return response.data.note;
}

/**
 * Updates an existing note with the provided title and content.
 *
 * @param {UpdateNoteProps} params - The parameters for updating the note.
 * @param {string} params.noteId - The ID of the note to update.
 * @param {string} params.title - The new title for the note.
 * @param {string} params.content - The new content for the note.
 * @returns {Promise<INote>} A promise that resolves to the updated note.
 */
export async function updateNote({
  noteId,
  title,
  content,
}: UpdateNoteProps): Promise<INote> {
  const response = await axiosInstance.patch(`/notes/${noteId}`, {
    title,
    content,
  });

  return response.data.note;
}
