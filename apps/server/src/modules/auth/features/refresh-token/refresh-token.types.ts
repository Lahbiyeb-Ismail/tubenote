import type { Response } from "express";

import type { TypedRequest } from "@/types";

import type { RefreshToken } from "./refresh-token.model";

import type { AuthResponseDto, RefreshDto } from "@modules/auth/dtos";

import type { SaveTokenDto } from "./dtos/save-token.dto";

export interface IRefreshTokenRepository {
  saveToken(saveTokenDto: SaveTokenDto): Promise<RefreshToken>;
  findValidToken(token: string): Promise<RefreshToken | null>;
  delete(token: string): Promise<void>;
  deleteAll(userId: string): Promise<void>;
}

export interface IRefreshTokenService {
  refreshToken(refreshDto: RefreshDto): Promise<AuthResponseDto>;
  deleteAllTokens(userId: string): Promise<void>;
  saveToken(saveTokenDto: SaveTokenDto): Promise<RefreshToken>;
}

export interface IRefreshTokenController {
  refreshToken(req: TypedRequest, res: Response): Promise<void>;
}
