const API_URL = process.env.NEXT_PUBLIC_API_URL;

async function userExists(id: string) {
  try {
    const apiUrl = `${API_URL}/users`;

    const res = await fetch(`${apiUrl}/${id}`);

    const { data } = await res.json();

    return data;
  } catch (error: any) {
    throw new Error(
      error.message || "Failed to check if the user exists. Please try again."
    );
  }
}

export default userExists;
