import type { Response } from "express";
import type { TypedRequest } from "../../../types";
import type { LoginResponseDto } from "../dtos/login-response.dto";
import type { RefreshDto } from "../dtos/refresh.dto";
import type { CreateTokenDto } from "./dtos/create-token.dto";
import type { RefreshToken } from "./refresh-token.model";

export interface IRefreshTokenRepository {
  create(createTokenDto: CreateTokenDto): Promise<RefreshToken>;
  find(token: string): Promise<RefreshToken | null>;
  delete(token: string): Promise<void>;
  deleteAll(userId: string): Promise<void>;
}

export interface IRefreshTokenService {
  createToken(createTokenDto: CreateTokenDto): Promise<RefreshToken>;
  findToken(token: string): Promise<RefreshToken | null>;
  deleteToken(token: string): Promise<void>;
  deleteAllTokens(userId: string): Promise<void>;
  refreshToken(refreshDto: RefreshDto): Promise<LoginResponseDto>;
}

export interface IRefreshTokenController {
  refreshToken(req: TypedRequest, res: Response): Promise<void>;
}
