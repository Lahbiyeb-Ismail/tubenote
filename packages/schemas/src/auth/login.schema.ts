import { z } from "zod";

import { emailSchema, passwordSchema } from "../user";

export const loginSchema = z
  .object({
    email: emailSchema,
    password: passwordSchema,
  })
  .strict();
