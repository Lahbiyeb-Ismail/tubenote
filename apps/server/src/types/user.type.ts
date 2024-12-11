import type {
  updatePasswordBodySchema,
  updateUserBodySchema,
} from "../schemas/user.schema";

export type UpdateUserBody = typeof updateUserBodySchema;

export type UpdatePasswordBody = typeof updatePasswordBodySchema;
