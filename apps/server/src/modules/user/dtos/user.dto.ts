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

export interface UpdateUserDto extends Partial<CreateUserDto> {}

export interface UpdatePasswordDto {
  currentPassword: string;
  newPassword: string;
}
