const API_URL = process.env.NEXT_PUBLIC_API_URL;

type NoteBody = {
  id: string;
  noteContent: string;
  noteTitle: string;
};

const updateNote = async (note: NoteBody) => {
  try {
    const apiUrl = `${API_URL}/notes/${note.id}`;
    const response = await fetch(apiUrl, {
      method: "PATCH",
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

export default updateNote;
