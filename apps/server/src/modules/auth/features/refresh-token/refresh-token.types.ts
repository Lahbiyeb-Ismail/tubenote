import type { Prisma } from "@prisma/client";
import type { Response } from "express";

import type { TypedRequest } from "@/modules/shared/types";

import type {
  ICryptoService,
  ILoggerService,
  IPrismaService,
  IResponseFormatter,
} from "@/modules/shared/services";

import type { IJwtService } from "../../utils";

import type { IUserService } from "@/modules/user";
import type { IClientContext, ICreateRefreshTokenDto } from "./dtos";
import type { RefreshToken } from "./refresh-token.model";

/**
 * Interface for managing refresh tokens in the repository.
 */
export interface IRefreshTokenRepository {
  /**
   * Creates a new refresh token for a user.
   *
   * @param userId - The ID of the user for whom the refresh token is being created.
   * @param data - The data required to create the refresh token.
   * @param tx - Optional transaction client for database operations.
   *
   * @returns A promise that resolves to the created refresh token.
   */
  create(
    userId: string,
    data: ICreateRefreshTokenDto,
    tx?: Prisma.TransactionClient
  ): Promise<RefreshToken>;

  /**
   * Finds a valid refresh token by its token string.
   *
   * @param token - The token string to search for.
   * @param tx - Optional transaction client for database operations.
   *
   * @returns A promise that resolves to the refresh token if found and valid, or null if not found or invalid.
   */
  findValid(
    token: string,
    tx?: Prisma.TransactionClient
  ): Promise<RefreshToken | null>;

  /**
   * Deletes a refresh token by its token string.
   *
   * @param userId - The ID of the user associated with the token.
   * @param token - The token string to delete.
   * @param tx - Optional transaction client for database operations.
   *
   * @returns A promise that resolves when the token is successfully deleted.
   */
  delete(
    userId: string,
    token: string,
    tx?: Prisma.TransactionClient
  ): Promise<void>;

  /**
   * Deletes all refresh tokens associated with a specific user.
   *
   * @param userId - The ID of the user whose refresh tokens are to be deleted.
   * @param tx - Optional transaction client for database operations.
   *
   * @returns A promise that resolves when all tokens for the user are successfully deleted.
   */
  deleteAll(userId: string, tx?: Prisma.TransactionClient): Promise<void>;
}

/**
 * Interface representing the Refresh Token Service.
 */
export interface IRefreshTokenService {
  /**
   * Refreshes the authentication token for a user.
   *
   * @param userId - The ID of the user requesting the token refresh.
   * @param token - The current refresh token to be validated and replaced.
   *
   * @returns A promise that resolves to an authentication response DTO.
   */
  refreshToken(userId: string, token: string): Promise<string>;

  deleteToken(useId: string, token: string): Promise<void>;

  /**
   * Deletes all refresh tokens associated with a specific user.
   *
   * @param userId - The ID of the user whose tokens are to be deleted.
   *
   * @returns A promise that resolves when the operation is complete.
   */
  deleteAllTokens(userId: string): Promise<void>;

  /**
   * Creates a new refresh token for a user.
   *
   * @param userId - The ID of the user for whom the token is being created.
   * @param data - The data required to create the refresh token.
   *
   * @returns A promise that resolves to the newly created refresh token.
   */
  createToken(userId: string, clientContext: IClientContext): Promise<string>;
}

/**
 * Interface representing the controller for handling refresh token operations.
 */
export interface IRefreshTokenController {
  /**
   * Handles the refresh token request.
   *
   * @param req - The typed request object containing necessary data for the operation.
   * @param res - The response object used to send the result back to the client.
   *
   * @returns A promise that resolves when the operation is complete.
   */
  refreshToken(req: TypedRequest, res: Response): Promise<void>;
}

/**
 * Options for the Refresh Token Repository.
 *
 * @property db - An instance of the Prisma service used for database operations.
 */
export interface IRefreshTokenRepositoryOptions {
  db: IPrismaService;
}

/**
 * Options required to initialize the Refresh Token Service.
 */
export interface IRefreshTokenServiceOptions {
  /**
   * Repository for managing refresh tokens.
   */
  refreshTokenRepository: IRefreshTokenRepository;

  /**
   * Service for interacting with the Prisma ORM.
   */
  prismaService: IPrismaService;

  /**
   * Service for handling user-related operations.
   */
  userService: IUserService;

  /**
   * Service for handling JSON Web Tokens (JWT).
   */
  jwtService: IJwtService;

  /**
   * Service for logging application events and errors.
   */
  loggerService: ILoggerService;

  /**
   * Service for handling cryptographic operations.
   */
  cryptoService: ICryptoService;
}

/**
 * Options for configuring the Refresh Token Controller.
 */
export interface IRefreshTokenControllerOptions {
  /**
   * Service responsible for handling refresh token operations.
   */
  refreshTokenService: IRefreshTokenService;

  /**
   * Utility for formatting responses.
   */
  responseFormatter: IResponseFormatter;
}
