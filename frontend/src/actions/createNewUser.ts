const API_URL = process.env.NEXT_PUBLIC_API_URL;

type User = {
  kindeId: string;
  email: string;
  username: string;
};

const createNewUser = async (user: User) => {
  try {
    const apiUrl = `${API_URL}/users`;

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });

    const data = await response.json();

    return data;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export default createNewUser;
