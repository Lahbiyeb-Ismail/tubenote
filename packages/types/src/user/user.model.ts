export interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  profilePicture: string | null;
  isEmailVerified: boolean;
  videoIds?: string[];
  createdAt: Date;
  updatedAt: Date;
}
