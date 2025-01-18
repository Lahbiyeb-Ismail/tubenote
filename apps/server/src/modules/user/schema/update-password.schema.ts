import { z } from "zod";

export const updatePasswordSchema = z.object({
  currentPassword: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long." }),
  newPassword: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long." }),
});
