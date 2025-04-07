import { z } from "zod";

export const usernameSchema = z
  .string()
  .min(3, { message: "Username must be at least 3 characters long." })
  .max(20, { message: "Username must be at most 20 characters long." });

export const emailSchema = z
  .string()
  .max(255, { message: "Email must be at most 255 characters long." })
  .email({ message: "Invalid email format. Please try another one." });

export const passwordSchema = z
  .string()
  .min(8, { message: "Password must be at least 8 characters." })
  .max(128, { message: "Password must be at most 128 characters." })
  .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^a-zA-Z0-9]).*$/, {
    message:
      "Password must include a lowercase, uppercase, number, and special character.",
  });
