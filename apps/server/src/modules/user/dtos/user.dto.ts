import type { User } from "../user.model";

/**
 * Interface representing the data transfer object for creating a user.
 */
export interface ICreateUserDto {
  /**
   * The email address of the user.
   */
  email: string;

  /**
   * The password for the user's account.
   */
  password: string;

  /**
   * The username chosen by the user.
   */
  username: string;

  /**
   * Indicates whether the user's email has been verified.
   * Optional field.
   */
  isEmailVerified?: boolean;

  /**
   * The URL of the user's profile picture.
   * Optional field.
   */
  profilePicture?: string;
}

/**
 * Data Transfer Object (DTO) for updating a user.
 *
 * This interface is used to define the structure of the data
 * required to update a user's information. It extends a partial
 * subset of the `User` entity, allowing only specific fields
 * to be updated.
 *
 * @extends Partial<User>
 *
 * @property email - The new email address of the user (optional).
 * @property username - The new username of the user (optional).
 * @property profilePicture - The new profile picture URL of the user (optional).
 */
export interface IUpdateUserDto
  extends Pick<Partial<User>, "email" | "username" | "profilePicture"> {}

/**
 * Interface representing the data transfer object for updating a user's password.
 */
export interface IUpdatePasswordDto {
  /**
   * The current password of the user.
   */
  currentPassword: string;

  /**
   * The new password that the user wants to set.
   */
  newPassword: string;
}

/**
 * Data Transfer Object for resetting a user's password.
 */
export interface IResetPasswordDto {
  id: string;
  newPassword: string;
}
