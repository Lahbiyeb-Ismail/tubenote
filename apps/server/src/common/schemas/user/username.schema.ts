import { z } from "zod";

export const usernameSchema = z
  .string()
  .min(3, { message: "Username must be at least 3 characters long." })
  .max(20, { message: "Username must be at most 20 characters long." });
