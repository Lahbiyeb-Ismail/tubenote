export interface UpdatePasswordDto {
  userId: string;
  currentPassword: string;
  newPassword: string;
}

export interface UpdatePasswordDbDto {
  userId: string;
  hashedPassword: string;
}
