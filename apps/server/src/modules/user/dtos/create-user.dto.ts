export interface CreateUserDto {
  username: string;
  email: string;
  password: string;
  profilePicture?: string;
  googleId?: string;
  isEmailVerified?: boolean;
}
