# TubeNote Types

This package contains TypeScript type definitions shared across the TubeNote platform. These types provide a common type foundation for both client and server applications.

## Purpose

The types package provides:

- Common TypeScript interfaces and type definitions
- Type safety across the monorepo
- Consistent data modeling
- Shared enums and constants

## Structure

The package is organized by domain:

- `note/` - Types related to notes and note-taking
- `shared/` - Common types used across multiple domains
- `user/` - User-related types
- `video/` - Video-related types

## Usage

Import types in your client or server code:

```typescript
import { Note, User, VideoInfo } from '@tubenote/types';

// Using types in your code
const processNote = (note: Note, user: User, video: VideoInfo) => {
  // Implementation...
};
```

## Building

Build this package from the root directory:

```bash
pnpm build:types
```

Or from this directory:

```bash
pnpm build
```
