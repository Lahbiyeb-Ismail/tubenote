import type { Response } from "express";

import type { TypedRequest } from "@/types";

import type {
  ICreateUserDto,
  IGetUserDto,
  IResetPasswordDto,
  IUpdatePasswordBodyDto,
  IUpdatePasswordDto,
  IUpdateUserDto,
  User,
} from "@modules/user";

import type { IUpdateBodyDto } from "@modules/shared";

/**
 * Interface representing a user repository.
 */
export interface IUserRepository {
  /**
   * Executes a function within a transaction.
   * @template T The type of the result.
   * @param fn The function to execute within the transaction.
   * @returns A promise that resolves to the result of the function.
   */
  transaction<T>(fn: (tx: IUserRepository) => Promise<T>): Promise<T>;

  /**
   * Creates a new user.
   * @param createUserDto The data transfer object containing user creation details.
   * @returns A promise that resolves to the created user.
   */
  createUser(createUserDto: ICreateUserDto): Promise<User>;

  /**
   * Retrieves a user by their email.
   * @param email The email of the user to retrieve.
   * @returns A promise that resolves to the user, or null if no user is found.
   */
  getUserByEmail(email: string): Promise<User | null>;

  /**
   * Retrieves a user by their ID.
   * @param id The ID of the user to retrieve.
   * @returns A promise that resolves to the user, or null if no user is found.
   */
  getUserById(id: string): Promise<User | null>;

  /**
   * Retrieves a user based on the provided criteria.
   * @param getUserDto The data transfer object containing user retrieval criteria.
   * @returns A promise that resolves to the user, or null if no user is found.
   */
  getUser(getUserDto: IGetUserDto): Promise<User | null>;

  /**
   * Updates an existing user.
   * @param updateUserDto The data transfer object containing user update details.
   * @returns A promise that resolves to the updated user.
   */
  updateUser(updateUserDto: IUpdateUserDto): Promise<User>;

  /**
   * Updates the password of a user.
   * @param userId The ID of the user whose password is to be updated.
   * @param hashedPassword The new hashed password.
   * @returns A promise that resolves to the updated user.
   */
  updatePassword(userId: string, hashedPassword: string): Promise<User>;

  /**
   * Verifies the email of a user.
   * @param userId The ID of the user whose email is to be verified.
   * @returns A promise that resolves to the verified user.
   */
  verifyUserEmail(userId: string): Promise<User>;
}

/**
 * Interface representing the user service.
 */
export interface IUserService {
  /**
   * Creates a new user.
   * @param createUserDto - Data transfer object containing user creation details.
   * @returns A promise that resolves to the created user.
   */
  createUser(createUserDto: ICreateUserDto): Promise<User>;

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
  getUser(getUserDto: IGetUserDto): Promise<User>;

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
  updatePassword(updatedPasswordDto: IUpdatePasswordDto): Promise<User>;

  /**
   * Resets the password of an existing user.
   * @param resetPasswordDto - Data transfer object containing reset password details.
   * @returns A promise that resolves to the user with the reset password.
   */
  resetPassword(resetPasswordDto: IResetPasswordDto): Promise<User>;

  /**
   * Verifies the email of a user.
   * @param userId - The ID of the user whose email is to be verified.
   * @returns A promise that resolves to the user with the verified email.
   */
  verifyUserEmail(userId: string): Promise<User>;
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
