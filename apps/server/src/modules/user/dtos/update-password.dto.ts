export interface UpdatePasswordDto {
  currentPassword: string;
  newPassword: string;
}

export interface UpdatePasswordDbDto {
  id: string;
  password: string;
}
