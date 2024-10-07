import type { z } from 'zod';

import type { loginFormSchema, registerFormSchema } from '@/lib/schemas';

export type LoginFormData = z.infer<typeof loginFormSchema>;
export type RegisterFormData = z.infer<typeof registerFormSchema>;

export type RegisterResponse = {
  message: string;
  username: string;
};
