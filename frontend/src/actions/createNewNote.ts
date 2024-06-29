import type { Note } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

type NoteBody = Omit<Note, "id">;

const createNewNote = async (note: NoteBody) => {
  try {
    const apiUrl = `${API_URL}/notes`;
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(note),
    });

    const data = await response.json();

    return data;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export default createNewNote;
