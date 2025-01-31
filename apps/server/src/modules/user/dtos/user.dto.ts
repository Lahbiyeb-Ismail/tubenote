export interface CreateUserDto {
  username: string;
  email: string;
  password: string;
  profilePicture?: string;
  googleId?: string;
  isEmailVerified?: boolean;
}

export interface GetUserDto {
  id?: string;
  email?: string;
}

export interface UpdateUserDto {
  username?: string;
  email?: string;
  profilePicture?: string;
  isEmailVerified?: boolean;
}

export interface UpdatePasswordDto {
  currentPassword: string;
  newPassword: string;
}
