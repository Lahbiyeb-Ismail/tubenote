import { z } from "zod";

import {
  emailSchema,
  passwordSchema,
  usernameSchema,
} from "@/common/schemas/user";

export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export const registerSchema = z.object({
  username: usernameSchema,
  email: emailSchema,
  password: passwordSchema,
});
