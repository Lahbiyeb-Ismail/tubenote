import { z } from 'zod';

export const forgotPasswordBodySchema = {
  body: z.object({
    email: z.string().email({ message: 'Invalid email address.' }),
  }),
};

export const passwordResetParamsSchema = {
  params: z.object({
    token: z.string().min(1),
  }),
};

export const passwordResetBodySchema = {
  body: z.object({
    password: z.string().min(8),
  }),
};
