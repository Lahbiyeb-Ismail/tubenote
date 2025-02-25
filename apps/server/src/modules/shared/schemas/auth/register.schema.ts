import { z } from "zod";

import {
  emailSchema,
  passwordSchema,
  usernameSchema,
} from "@/common/schemas/user";

export const registerSchema = z.object({
  username: usernameSchema,
  email: emailSchema,
  password: passwordSchema,
});
