import { ERROR_MESSAGES } from "../../constants/error-messages.contants";
import { NotFoundError } from "../../errors";
import type { CreateTokenDto } from "./dtos/create-token.dto";

import type { RefreshToken } from "./refresh-token.model";
import type {
  IRefreshTokenRepository,
  IRefreshTokenService,
} from "./refresh-token.types";

export class RefreshTokenService implements IRefreshTokenService {
  constructor(
    private readonly _refreshTokenRepository: IRefreshTokenRepository
  ) {}

  async createToken(createTokenDto: CreateTokenDto): Promise<RefreshToken> {
    return await this._refreshTokenRepository.create(createTokenDto);
  }

  async findToken(token: string): Promise<RefreshToken | null> {
    return await this._refreshTokenRepository.find(token);
  }

  async deleteToken(token: string): Promise<void> {
    const refreshToken = await this._refreshTokenRepository.find(token);

    if (!refreshToken) {
      throw new NotFoundError(ERROR_MESSAGES.RESOURCE_NOT_FOUND);
    }

    await this._refreshTokenRepository.delete(token);
  }

  async deleteAllTokens(userId: string): Promise<void> {
    await this._refreshTokenRepository.deleteAll(userId);
  }
}
