import { z } from "zod";

export const usernameSchema = z
  .string()
  .regex(/^[a-zA-Z0-9_]+$/, {
    message:
      "Invalid username format. Only letters, numbers, and underscores are allowed.",
  })
  .min(3, { message: "Username must be at least 3 characters long." })
  .max(20, { message: "Username must be at most 20 characters long." })
  .refine((value) => !/['"<>;(){}]/.test(value), {
    message: "Username cannot contain special characters like '\"<>;(){}.",
  });
