import type { z } from 'zod';
import type { noteSchema } from 'src/schemas/note.schema';

export type NoteBody = z.infer<typeof noteSchema.body>;
