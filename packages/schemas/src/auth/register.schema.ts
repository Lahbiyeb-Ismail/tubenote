import { z } from "zod";
import {
  emailSchema,
  passwordSchema,
  profilePictureSchema,
  usernameSchema,
} from "../user";

export const registerSchema = z
  .object({
    username: usernameSchema,
    email: emailSchema,
    password: passwordSchema,
    profilePicture: profilePictureSchema,
  })
  .strict();
