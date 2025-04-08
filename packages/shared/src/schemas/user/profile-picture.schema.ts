import { z } from "zod";

export const profilePictureSchema = z
  .string()
  .url()
  .nullable()
  .optional()
  .default(null);
