import { z } from "zod";

import { emailSchema, passwordSchema } from "@/common/schemas/user";

export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});
