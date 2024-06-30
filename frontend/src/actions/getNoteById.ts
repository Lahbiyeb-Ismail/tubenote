import type { Note } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

async function getNoteById(noteId: string) {
  try {
    const res = await fetch(`${API_URL}/notes/note/${noteId}`);

    if (!res.ok) {
      throw new Error("Failed to fetch notes data.");
    } else {
      const { note } = await res.json();

      return note as Note;
    }
  } catch (error: any) {
    throw new Error(
      error.message || "Failed to fetch video data. Please try again."
    );
  }
}

export default getNoteById;
