import type { User } from "@prisma/client";
import userDatabase from "../databases/userDatabase";
import { NotFoundError } from "../errors";

class UserService {
  async getUser(userId: string): Promise<User> {
    const user = await userDatabase.findUser({ id: userId });

    if (!user) {
      throw new NotFoundError("User not found. Please try again.");
    }

    return user;
  }
}

export default new UserService();
