# TubeNote Schemas

This package contains Zod validation schemas used throughout the TubeNote platform to validate data at runtime.

## Purpose

Schemas define the structure and validation rules for data in the application, ensuring that:

- Data meets specific validation criteria before processing
- Error messages are consistent and informative
- Runtime type safety is enforced
- API requests and responses conform to expected formats

## Structure

The package is organized by domain:

- `auth/` - Schemas for authentication-related data
- `note/` - Schemas for note-related data
- `request/` - Common request schemas
- `user/` - Schemas for user-related data
- `video/` - Schemas for video-related data

## Usage

Import schemas in your client or server code:

```typescript
import { createNoteSchema, updateNoteSchema } from '@tubenote/schemas';

// Validating data
const validateNote = (data: unknown) => {
  const result = createNoteSchema.safeParse(data);
  
  if (!result.success) {
    console.error(result.error.errors);
    return { success: false, errors: result.error.errors };
  }
  
  return { success: true, data: result.data };
};
```

## Building

Build this package from the root directory:

```bash
pnpm build:schemas
```

Or from this directory:

```bash
pnpm build
```
