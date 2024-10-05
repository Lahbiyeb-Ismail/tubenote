import { z } from 'zod';

import type { loginFormSchema } from '@/lib/schemas';

export type LoginFormData = z.infer<typeof loginFormSchema>;
