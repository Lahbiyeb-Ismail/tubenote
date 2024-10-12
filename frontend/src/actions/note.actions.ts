import axiosInstance from '@/lib/axios.lib';
import type { CreateNoteResponse, Note } from '@/types/note.types';

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
