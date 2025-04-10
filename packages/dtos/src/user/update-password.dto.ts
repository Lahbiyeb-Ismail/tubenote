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
