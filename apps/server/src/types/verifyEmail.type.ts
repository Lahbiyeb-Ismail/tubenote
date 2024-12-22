import type {
  sendVerifyEmailBodySchema,
  verifyEmailParamSchema,
} from "../schemas/verifyEmail.schema";

export type SendVerifyEmailBody = typeof sendVerifyEmailBodySchema;

export type VerifyEmailParam = typeof verifyEmailParamSchema;

export interface VerificationTokenEntry {
  id: string;
  token: string;
  userId: string;
  expiresAt: Date;
  createdAt: Date;
}
