import { z } from "zod";

export const sendVerifyEmailBodySchema = z.object({
	email: z.string().email({ message: "Invalid email address." }),
});

export const verifyEmailParamSchema = z.object({
	token: z.string().min(1),
});
