import type { Prisma } from "@prisma/client";
import type { Response } from "express";

import type { User } from "@tubenote/types";

import type {
  ICreateUserDto,
  IUpdatePasswordDto,
  IUpdateUserDto,
} from "@tubenote/shared";

import type { TypedRequest } from "@/modules/shared/types";

import type {
  ICryptoService,
  ILoggerService,
  IPrismaService,
  IRateLimitService,
  IResponseFormatter,
} from "@/modules/shared/services";

import type { IAccountService } from "./features/account/account.types";
import type { ICreateAccountDto } from "./features/account/dtos";

/**
 * Interface representing a user repository.
 */
export interface IUserRepository {
  /**
   * Creates a new user.
   * @param createUserDto The data transfer object containing user creation details.
   * @returns A promise that resolves to the created user.
   */
  create(
    tx: Prisma.TransactionClient,
    createUserDto: ICreateUserDto
  ): Promise<User>;

  /**
   * Retrieves a user by their email.
   * @param email The email of the user to retrieve.
   * @returns A promise that resolves to the user, or null if no user is found.
   */
  getByEmail(
    email: string,
    tx?: Prisma.TransactionClient
  ): Promise<User | null>;

  /**
   * Retrieves a user by their ID.
   * @param id The ID of the user to retrieve.
   * @returns A promise that resolves to the user, or null if no user is found.
   */
  getById(id: string, tx?: Prisma.TransactionClient): Promise<User | null>;

  /**
   * Updates an existing user.
   * @param updateUserDto The data transfer object containing user update details.
   * @returns A promise that resolves to the updated user.
   */
  update(
    tx: Prisma.TransactionClient,
    userId: string,
    updateUserDto: IUpdateUserDto
  ): Promise<User>;

  /**
   * Updates the password of a user.
   * @param tx The transaction client to use for the update.
   * @param userId The ID of the user whose password is to be updated.
   * @param hashedPassword The new hashed password.
   * @returns A promise that resolves to the updated user.
   */
  updatePassword(
    tx: Prisma.TransactionClient,
    userId: string,
    hashedPassword: string
  ): Promise<User>;

  /**
   * Verifies the email of a user.
   * @param userId The ID of the user whose email is to be verified.
   * @returns A promise that resolves to the verified user.
   */
  verifyEmail(userId: string, tx?: Prisma.TransactionClient): Promise<User>;
}

/**
 * Interface representing the user service.
 */
export interface IUserService {
  createUserWithAccount(
    tx: Prisma.TransactionClient,
    createUserDto: ICreateUserDto,
    createAccountDto: ICreateAccountDto
  ): Promise<User>;

  getUserById(id: string, tx?: Prisma.TransactionClient): Promise<User | null>;

  getUserByEmail(
    email: string,
    tx?: Prisma.TransactionClient
  ): Promise<User | null>;

  /**
   * Updates an existing user.
   * @param updateUserDto - Data transfer object containing user update details.
   * @returns A promise that resolves to the updated user.
   */
  updateUser(userId: string, updateUserDto: IUpdateUserDto): Promise<User>;

  /**
   * Updates the password of an existing user.
   * @param updatedPasswordDto - Data transfer object containing updated password details.
   * @returns A promise that resolves to the user with the updated password.
   */
  updateUserPassword(
    userId: string,
    updatedPasswordDto: IUpdatePasswordDto
  ): Promise<User>;

  /**
   * Resets the password of an existing user.
   *
   * @param userId - The ID of the user whose password is to be reset.
   * @param newPassword - The new password to set for the user.
   *
   * @returns A promise that resolves to the user with the reset password.
   */
  resetUserPassword(userId: string, newPassword: string): Promise<User>;

  /**
   * Verifies the email of a user.
   * @param userId - The ID of the user whose email is to be verified.
   * @returns A promise that resolves to the user with the verified email.
   */
  verifyUserEmail(userId: string, tx?: Prisma.TransactionClient): Promise<User>;
}

/**
 * Interface representing the user controller.
 */
export interface IUserController {
  /**
   * Retrieves the current user.
   * @param req - The request object.
   * @param res - The response object.
   * @returns A promise that resolves when the operation is complete.
   */
  getCurrentUser(req: TypedRequest, res: Response): Promise<void>;

  /**
   * Updates the current user.
   * @param req - The request object containing the update data.
   * @param res - The response object.
   * @returns A promise that resolves when the operation is complete.
   */
  updateCurrentUser(
    req: TypedRequest<IUpdateUserDto>,
    res: Response
  ): Promise<void>;

  /**
   * Updates the user's password.
   * @param req - The request object containing the new password data.
   * @param res - The response object.
   * @returns A promise that resolves when the operation is complete.
   */
  updatePassword(
    req: TypedRequest<IUpdatePasswordDto>,
    res: Response
  ): Promise<void>;
}

export interface IUserRepositoryOptions {
  db: IPrismaService;
}

export interface IUserServiceOptions {
  userRepository: IUserRepository;
  accountService: IAccountService;
  prismaService: IPrismaService;
  cryptoService: ICryptoService;
}

export interface IUserControllerOptions {
  userService: IUserService;
  responseFormatter: IResponseFormatter;
  rateLimitService: IRateLimitService;
  loggerService: ILoggerService;
}
