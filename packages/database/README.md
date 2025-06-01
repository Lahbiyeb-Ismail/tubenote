# @tubenote/db

The centralized database package for the TubeNote monorepo. This package provides Prisma client utilities, database schema definitions, and shared database functionality across all TubeNote applications and services.

![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)

## Features

- 🌍 **Centralized database schema** - Single source of truth for all database models
- 🔄 **Optimized Prisma client** - Singleton pattern to prevent connection issues
- 🛠️ **TypeScript integration** - Full type safety for database operations
- 📦 **Modular design** - Clean separation of database code from application logic

## Installation

This package is meant to be used within the TubeNote monorepo. It's automatically available to all workspace packages.

```bash
# From any workspace package
pnpm add @tubenote/db@workspace:*
```

## Usage

### Basic Usage

```typescript
import { prisma } from "@tubenote/db";

// Use the Prisma client
async function getUsers() {
  const users = await prisma.user.findMany();
  return users;
}
```

### Type Imports

```typescript
import { Prisma, User, Video, Note } from "@tubenote/db";

// Use types from the database
function processUser(user: User) {
  // type-safe operations on user
}
```

## Database Schema

This package defines the following key models:

- **User** - User accounts and authentication data
- **Account** - OAuth and credential account connections
- **RefreshToken** - Session management tokens
- **EmailVerificationToken** - Email verification tokens
- **Note** - User notes linked to videos
- **Video** - YouTube video metadata

For the complete schema, see [schema.prisma](./prisma/schema.prisma).

## Commands

The database package provides several useful scripts:

| Command | Description |
| --- | --- |
| `pnpm dev` | Watch mode for development |
| `pnpm db:migrate:dev` | Create and apply migrations in development |
| `pnpm db:migrate:deploy` | Apply migrations in production |
| `pnpm db:push` | Push schema changes directly to the database (dev only) |
| `pnpm db:generate` | Generate Prisma client |
| `pnpm db:studio` | Open Prisma Studio UI |
| `pnpm db:seed` | Run database seeding scripts |

## Environment Variables

The database requires the following environment variables:

```
DATABASE_URL="mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>?retryWrites=true&w=majority"
```

## Best Practices

### Using the Prisma Client

Always import the client from this package instead of creating your own:

```typescript
// ✅ Correct
import { prisma } from "@tubenote/db";

// ❌ Incorrect
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
```

### Transactions

Use transactions for operations that require multiple database operations:

```typescript
import { prisma } from "@tubenote/db";

await prisma.$transaction(async (tx) => {
  const user = await tx.user.create({ /* ... */ });
  await tx.note.create({
    data: {
      /* ... */
      userId: user.id,
    },
  });
});
```

### Schema Modifications

When modifying the schema:

1. Edit `prisma/schema.prisma`
2. Run `pnpm db:migrate:dev --name descriptive_change_name`
3. Commit both the schema changes and the generated migration files

## License

ISC
