const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function deleteNote(noteId: string) {
  try {
    const apiUrl = `${API_URL}/notes/${noteId}`;
    const response = await fetch(apiUrl, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    return data;
  } catch (error: any) {
    throw new Error(error.message);
  }
}
