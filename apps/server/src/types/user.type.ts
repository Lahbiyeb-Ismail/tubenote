import type {
  updatePasswordBodySchema,
  updateUserBodySchema,
} from "../schemas/user.schema";

export type UpdateUserBody = typeof updateUserBodySchema;

export type UpdatePasswordBody = typeof updatePasswordBodySchema;

export interface UserEntry {
  id: string;
  username: string;
  email: string;
  password: string;
  profilePicture?: string;
  googleId?: string;
  isEmailVerified?: boolean;
  createdAt: Date;
  updatedAt: Date;
  videoIds: string[];
}

export interface CreateUserParams {
  data: Omit<UserEntry, "id" | "createdAt" | "updatedAt" | "videoIds">;
}

export interface UpdateUserParams {
  userId: string;
  data: Partial<Omit<UserEntry, "id" | "createdAt" | "updatedAt" | "videoIds">>;
}

export interface UpdatePasswordParams {
  userId: string;
  currentPassword: string;
  newPassword: string;
}
