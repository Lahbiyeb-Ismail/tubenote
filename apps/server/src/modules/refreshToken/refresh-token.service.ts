import { ERROR_MESSAGES } from "../../constants/errorMessages";
import { NotFoundError } from "../../errors";
import type { RefreshTokenEntry } from "./refresh-token.type";

import { IRefreshTokenDatabase } from "./refresh-token.db";

export interface IRefreshTokenService {
  createToken(userId: string, token: string): Promise<RefreshTokenEntry>;
  findToken(token: string): Promise<RefreshTokenEntry | null>;
  deleteToken(token: string): Promise<void>;
  deleteAllTokens(userId: string): Promise<void>;
}

export class RefreshTokenService implements IRefreshTokenService {
  private refreshTokenDB: IRefreshTokenDatabase;

  constructor(refreshTokenDB: IRefreshTokenDatabase) {
    this.refreshTokenDB = refreshTokenDB;
  }

  async createToken(userId: string, token: string): Promise<RefreshTokenEntry> {
    return await this.refreshTokenDB.create(token, userId);
  }

  async findToken(token: string): Promise<RefreshTokenEntry | null> {
    return await this.refreshTokenDB.find(token);
  }

  async deleteToken(token: string): Promise<void> {
    const refreshToken = await this.refreshTokenDB.find(token);

    if (!refreshToken) {
      throw new NotFoundError(ERROR_MESSAGES.RESOURCE_NOT_FOUND);
    }

    await this.refreshTokenDB.delete(token);
  }

  async deleteAllTokens(userId: string): Promise<void> {
    await this.refreshTokenDB.deleteAll(userId);
  }
}
