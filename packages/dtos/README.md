# TubeNote DTOs

This package contains Data Transfer Objects (DTOs) used for type-safe API communication between the client and server applications in the TubeNote platform.

## Purpose

DTOs define the structure of data that is transferred between the client and server, ensuring consistent typing across the entire application. They are used to:

- Define request and response types for API endpoints
- Ensure type safety when transferring data between client and server
- Document the shape of data throughout the application
- Enforce consistent data structures across the platform

## Structure

The package is organized by domain:

- `auth/` - DTOs for authentication-related operations
- `note/` - DTOs for note-related operations
- `request/` - Common request DTOs
- `shared/` - Shared DTO types used across domains
- `user/` - DTOs for user-related operations
- `video/` - DTOs for video-related operations

## Usage

Import DTOs in your client or server code:

```typescript
import { CreateNoteDto, NoteResponseDto } from '@tubenote/dtos';

// Using a DTO for a request
const createNote = async (noteData: CreateNoteDto): Promise<NoteResponseDto> => {
  const response = await api.post('/notes', noteData);
  return response.data;
};
```

## Building

Build this package from the root directory:

```bash
pnpm build:dtos
```

Or from this directory:

```bash
pnpm build
```
