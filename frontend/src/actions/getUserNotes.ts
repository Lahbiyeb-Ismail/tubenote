async function getUserNotes(userId: string) {
  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const res = await fetch(`${API_URL}/notes/${userId}`);

    if (!res.ok) {
      throw new Error("Failed to fetch notes data.");
    } else {
      const data = await res.json();

      return data;
    }
  } catch (error: any) {
    throw new Error(
      error.message || "Failed to fetch video data. Please try again."
    );
  }
}

export default getUserNotes;
