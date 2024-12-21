import type { RefreshToken } from "@prisma/client";

import refreshTokenDB from "../databases/refreshTokenDB";

import { ERROR_MESSAGES } from "../constants/errorMessages";
import { NotFoundError } from "../errors";

class RefreshTokenService {
  async createToken(userId: string, token: string): Promise<void> {
    await refreshTokenDB.create(token, userId);
  }

  async findToken(token: string): Promise<RefreshToken | null> {
    const refreshToken = await refreshTokenDB.find({ token });

    return refreshToken;
  }

  async deleteToken(token: string): Promise<void> {
    const refreshToken = await refreshTokenDB.find({ token });

    if (!refreshToken) {
      throw new NotFoundError(ERROR_MESSAGES.RESOURCE_NOT_FOUND);
    }

    await refreshTokenDB.delete({ token });
  }

  async deleteAllTokens(userId: string): Promise<void> {
    await refreshTokenDB.deleteAll({ userId });
  }
}

export default new RefreshTokenService();
