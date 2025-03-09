import type { Prisma } from "@prisma/client";
import type { Response } from "express";

import type { IUpdateBodyDto } from "@/modules/shared/dtos";
import type { TypedRequest } from "@/modules/shared/types";

import type { User } from "./user.model";

import type {
  ICreateUserDto,
  IGetUserDto,
  IResetPasswordDto,
  IUpdatePasswordBodyDto,
  IUpdatePasswordDto,
  IUpdateUserDto,
} from "./dtos";
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
    createUserDto: ICreateUserDto,
    createAccountDto: ICreateAccountDto
  ): Promise<User>;

  /**
   * Retrieves an existing user or creates a new one if not found.
   * @param createUserDto - Data transfer object containing user creation details.
   * @returns A promise that resolves to the retrieved or created user.
   */
  getOrCreateUser(createUserDto: ICreateUserDto): Promise<User>;

  /**
   * Retrieves a user based on the provided details.
   * @param getUserDto - Data transfer object containing user retrieval details.
   * @returns A promise that resolves to the retrieved user.
   */
  getUserByIdOrEmail(
    getUserDto: IGetUserDto,
    tx?: Prisma.TransactionClient
  ): Promise<User>;

  /**
   * Updates an existing user.
   * @param updateUserDto - Data transfer object containing user update details.
   * @returns A promise that resolves to the updated user.
   */
  updateUser(updateUserDto: IUpdateUserDto): Promise<User>;

  /**
   * Updates the password of an existing user.
   * @param updatedPasswordDto - Data transfer object containing updated password details.
   * @returns A promise that resolves to the user with the updated password.
   */
  updateUserPassword(updatedPasswordDto: IUpdatePasswordDto): Promise<User>;

  /**
   * Resets the password of an existing user.
   * @param resetPasswordDto - Data transfer object containing reset password details.
   * @returns A promise that resolves to the user with the reset password.
   */
  resetUserPassword(resetPasswordDto: IResetPasswordDto): Promise<User>;

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
    req: TypedRequest<IUpdateBodyDto<User>>,
    res: Response
  ): Promise<void>;

  /**
   * Updates the user's password.
   * @param req - The request object containing the new password data.
   * @param res - The response object.
   * @returns A promise that resolves when the operation is complete.
   */
  updatePassword(
    req: TypedRequest<IUpdatePasswordBodyDto>,
    res: Response
  ): Promise<void>;
}
