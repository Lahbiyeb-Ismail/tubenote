import type {
  sendVerifyEmailBodySchema,
  verifyEmailParamSchema,
} from "./verifyEmailValidationSchemas";

export type SendVerifyEmailBody = typeof sendVerifyEmailBodySchema;

export type VerifyEmailParam = typeof verifyEmailParamSchema;

export interface VerificationTokenEntry {
  id: string;
  token: string;
  userId: string;
  expiresAt: Date;
  createdAt: Date;
}
