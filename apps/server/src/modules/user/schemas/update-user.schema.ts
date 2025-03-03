import { z } from "zod";

import { emailSchema, usernameSchema } from "@/modules/shared/schemas";

export const updateUserSchema = z
  .object({
    username: usernameSchema.optional(),
    email: emailSchema.optional(),
    profilePicture: z.string().optional(),
    isEmailVerified: z.boolean().optional(),
  })
  .strict();
