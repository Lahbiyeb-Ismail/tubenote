import type {
	updateUserBodySchema,
	updatePasswordBodySchema,
} from "../schemas/user.schema";

export type UpdateUserBody = typeof updateUserBodySchema;

export type UpdatePasswordBody = typeof updatePasswordBodySchema;
