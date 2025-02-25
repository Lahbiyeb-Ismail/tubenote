import type { ICreateDto, IUpdateDto } from "@/modules/shared";
import type { User } from "@modules/user";

/**
 * Data Transfer Object (DTO) for creating a user.
 *
 * This interface extends the `ICreateDto` interface, omitting the `userId` property.
 *
 * @interface ICreateUserDto
 * @extends {Omit<ICreateDto<User>, "userId">}
 */
export interface ICreateUserDto extends Omit<ICreateDto<User>, "userId"> {}

/**
 * Data Transfer Object (DTO) for retrieving user information.
 *
 * @interface IGetUserDto
 *
 * @property {string} [id] - The unique identifier of the user.
 * @property {string} [email] - The email address of the user.
 */
export interface IGetUserDto {
  id?: string;
  email?: string;
}

/**
 * Data Transfer Object (DTO) for updating a user.
 *
 * This interface extends the `IUpdateDto` interface for the `User` entity,
 * omitting the `userId` property.
 *
 * @interface IUpdateUserDto
 * @extends {Omit<IUpdateDto<User>, "userId">}
 */
export interface IUpdateUserDto extends Omit<IUpdateDto<User>, "userId"> {}

/**
 * Interface representing the data transfer object for updating a user's password.
 */
export interface IUpdatePasswordBodyDto {
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
 * Data Transfer Object (DTO) for updating a user's password.
 *
 * This interface extends the `IUpdatePasswordBodyDto` and includes an additional
 * `id` property to uniquely identify the user whose password is being updated.
 *
 * @interface IUpdatePasswordDto
 * @extends IUpdatePasswordBodyDto
 *
 * @property {string} id - The unique identifier of the user.
 */
export interface IUpdatePasswordDto extends IUpdatePasswordBodyDto {
  id: string;
}

/**
 * Data Transfer Object for resetting a user's password.
 */
export interface IResetPasswordDto {
  id: string;
  newPassword: string;
}
