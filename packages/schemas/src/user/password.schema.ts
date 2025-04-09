import { z } from "zod";

export const passwordSchema = z
  .string()
  .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^a-zA-Z0-9]).*$/, {
    message:
      "Password must include a lowercase, uppercase, number, and special character.",
  })
  .min(8, { message: "Password must be at least 8 characters." })
  .max(128, { message: "Password must be at most 128 characters." })
  .refine((value) => !/['"<>;(){}]/.test(value), {
    message: "Password cannot contain special characters like '\"<>;(){}.",
  });
