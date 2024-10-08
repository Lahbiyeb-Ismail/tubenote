import type { z } from 'zod';

import type { videoFormSchema } from '@/lib/schemas';

export type VideoUrl = z.infer<typeof videoFormSchema>;
