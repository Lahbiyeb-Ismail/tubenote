import createNewUser from "./createNewUser";
import userExists from "./userExists";

async function getUserSession() {
  try {
    const res = await fetch("/api/auth/user_session");
    const { user, authenticated } = await res.json();

    const username = `${user.given_name} ${user.family_name}`;

    const isUserExists = await userExists(user.id);

    let newUser = null;

    if (!isUserExists) {
      newUser = await createNewUser({
        kindeId: user.id,
        email: user.email,
        username,
      });
    }

    const userId = isUserExists ? isUserExists.id : newUser.data.id;

    return { user, authenticated, userId };
  } catch (error: any) {
    throw new Error(
      error.message || "Failed to fetch user's data. Please try again."
    );
  }
}

export default getUserSession;
