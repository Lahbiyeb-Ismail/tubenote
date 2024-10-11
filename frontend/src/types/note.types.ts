import type { z } from 'zod';

import type { saveNoteFormSchema, videoFormSchema } from '@/lib/schemas';

export type VideoUrl = z.infer<typeof videoFormSchema>;

export type NoteTitle = z.infer<typeof saveNoteFormSchema>;
