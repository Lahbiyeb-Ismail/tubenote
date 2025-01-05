export interface UpdateUserDto {
  userId: string;

  email?: string;
  username?: string;
  profilePicture?: string;
  googleId?: string;
  isEmailVerified?: boolean;
}
