import type { Note } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

type CreateNewNote = {
  videoId: string;
  noteContent: string;
};

const createNewNote = async ({ videoId, noteContent }: CreateNewNote) => {
  try {
    const note: Note = {
      title: "Note",
      videoId,
      content: noteContent,
    };
    const apiUrl = `${API_URL}/videos/${videoId}/notes`;
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
