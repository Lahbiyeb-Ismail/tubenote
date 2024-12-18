import type { User } from "@prisma/client";
import userDatabase from "../databases/userDatabase";
import { BadRequestError, NotFoundError } from "../errors";

class UserService {
  async getUser(userId: string): Promise<User> {
    const user = await userDatabase.findUser({ id: userId });

    if (!user) {
      throw new NotFoundError("User not found. Please try again.");
    }

    return user;
  }

  async updateUser({
    username,
    email,
    userId,
  }: {
    userId: string;
    username: string;
    email: string;
  }): Promise<void> {
    await this.getUser(userId);

    const existingUser = await userDatabase.findUser({ email });

    if (existingUser && existingUser.id !== userId) {
      throw new BadRequestError(
        "Email is already taken. Please try another one."
      );
    }

    await userDatabase.updateUser({ userId, data: { email, username } });
  }
}

export default new UserService();
