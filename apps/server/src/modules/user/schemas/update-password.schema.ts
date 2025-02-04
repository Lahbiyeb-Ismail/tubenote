import { z } from "zod";

import { passwordSchema } from "@/common/schemas/user";

export const updatePasswordSchema = z
  .object({
    currentPassword: passwordSchema,
    newPassword: passwordSchema,
  })
  .strict()
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: "New password must be different from the current password.",
    path: ["newPassword"],
  });
