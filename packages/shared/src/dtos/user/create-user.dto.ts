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
