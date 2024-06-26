async function getUserSession() {
  try {
    const res = await fetch("/api/auth/user_session");
    const { user, authenticated } = await res.json();

    return { user, authenticated };
  } catch (error: any) {
    throw new Error(
      error.message || "Failed to fetch user's data. Please try again."
    );
  }
}

export default getUserSession;
