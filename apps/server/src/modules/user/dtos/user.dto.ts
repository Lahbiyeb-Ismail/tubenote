export interface UserDto {
  id: string;
  username: string;
  email: string;
  password: string;
  isEmailVerified: boolean;
  googleId?: string;
  profilePicture?: string;
  videoIds?: string[];
  createdAt: Date;
  updatedAt: Date;
}
