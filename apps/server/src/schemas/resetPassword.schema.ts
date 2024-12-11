import { z } from "zod";

export const forgotPasswordBodySchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
});

export const resetPasswordParamsSchema = z.object({
  token: z.string().min(1),
});

export const resetPasswordBodySchema = z.object({
  password: z.string().min(8),
});
