import { z } from "zod";

export const emailSchema = z
  .string()
  .max(255, { message: "Email must be at most 255 characters long." })
  .email({ message: "Invalid email format. Please try another one." });
