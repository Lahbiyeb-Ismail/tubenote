import { ERROR_MESSAGES } from "../../constants/errorMessages";
import { NotFoundError } from "../../errors";
import type { RefreshTokenEntry } from "./refreshToken.type";

import RefreshTokenDB from "./refreshTokenDB";

class RefreshTokenService {
  async createToken(userId: string, token: string): Promise<RefreshTokenEntry> {
    return await RefreshTokenDB.create(token, userId);
  }

  async findToken(token: string): Promise<RefreshTokenEntry | null> {
    const refreshToken = await RefreshTokenDB.find(token);

    return refreshToken;
  }

  async deleteToken(token: string): Promise<void> {
    const refreshToken = await RefreshTokenDB.find(token);

    if (!refreshToken) {
      throw new NotFoundError(ERROR_MESSAGES.RESOURCE_NOT_FOUND);
    }

    await RefreshTokenDB.delete(token);
  }

  async deleteAllTokens(userId: string): Promise<void> {
    await RefreshTokenDB.deleteAll(userId);
  }
}

export default new RefreshTokenService();
