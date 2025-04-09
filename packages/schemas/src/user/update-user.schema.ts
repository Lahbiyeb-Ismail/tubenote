import { z } from "zod";

import { emailSchema } from "./email.schema";
import { profilePictureSchema } from "./profile-picture.schema";
import { usernameSchema } from "./username.schema";

export const updateUserSchema = z
  .object({
    username: usernameSchema.optional(),
    email: emailSchema.optional(),
    profilePicture: profilePictureSchema.optional(),
  })
  .strict();
