import axiosInstance from '@/lib/axios.lib';
import type { Note } from '@/types/note.types';

export async function createNote(note: Note) {
  const response = await axiosInstance.post('/notes', note);

  return response.data;
}
