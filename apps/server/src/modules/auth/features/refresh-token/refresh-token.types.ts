import type { Response } from "express";

import type { ICreateDto } from "@/modules/shared/dtos";
import type { TypedRequest } from "@/modules/shared/types";

import type { IAuthResponseDto, IRefreshDto } from "@/modules/auth/dtos";
import type { RefreshToken } from "./refresh-token.model";

export interface IRefreshTokenRepository {
  createToken(createTokenDto: ICreateDto<RefreshToken>): Promise<RefreshToken>;
  findValidToken(token: string): Promise<RefreshToken | null>;
  delete(token: string): Promise<void>;
  deleteAll(userId: string): Promise<void>;
}

export interface IRefreshTokenService {
  refreshToken(refreshDto: IRefreshDto): Promise<IAuthResponseDto>;
  deleteAllTokens(userId: string): Promise<void>;
  createToken(createTokenDto: ICreateDto<RefreshToken>): Promise<RefreshToken>;
}

export interface IRefreshTokenController {
  refreshToken(req: TypedRequest, res: Response): Promise<void>;
}
