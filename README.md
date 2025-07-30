# TubeNote v2

TubeNote is a web application that enhances the video-watching experience by enabling users to take intuitive and efficient notes while watching videos.

## Table of Contents

- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Scripts](#scripts)
- [Environment Variables](#environment-variables)
- [Backend](#backend)
- [Frontend](#frontend)
- [Packages](#packages)
- [Implemented Features](#implemented-features)
- [Features in Progress](#features-in-progress)
- [Contributing](#contributing)
- [License](#license)

## Getting Started

First, clone the repository:

```sh
git clone https://github.com/Lahbiyeb-Ismail/tubenote_v2.git
cd tubenote_v2
```

Install the dependencies:

```sh
pnpm install
```

Run the development server:

```sh
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the frontend result.

## Project Structure

TubeNote v2 is organized as a monorepo using pnpm workspaces with the following structure:

```
tubenote_v2/
├── apps/
│   ├── client/     # Next.js frontend application
│   ├── server/     # Node.js backend application with Express
│   └── bff/        # BFF (Backend for Frontend) service
├── packages/
│   ├── api-errors/ # Custom error classes for consistent error handling
│   ├── config-typescript/ # Shared TypeScript configurations
│   ├── database/   # Database connection, schema, and queries
│   ├── dtos/       # Data Transfer Objects shared between client and server
│   ├── redis-cache/ # Caching layer with Redis
│   ├── schemas/    # Schema definitions for validation
│   ├── types/      # TypeScript type definitions used across the project
│   ├── utils/      # Shared utility functions
│   └── youtube-api/ # Wrapper for the YouTube API
├── pnpm-workspace.yaml
└── package.json
```

### Backend

The backend code is located in the `apps/server/` directory. It includes:

- `src/`: Source code for the backend.
- `prisma/`: Prisma schema and migrations.
- `middlewares/`: Express middlewares.
- `modules/`: Feature-based modules (controllers, services, routes).
- `config/`: Configuration files.

### Frontend

The frontend code is located in the `apps/client/` directory. It includes:

- `src/app/`: Next.js App Router structure.
- `src/components/`: UI components organized by feature/scope.
- `src/features/`: Feature-based code organization.
- `src/hooks/`: Custom React hooks.
- `src/context/`: React context providers.
- `src/lib/`: Library code and configurations.
- `public/`: Public assets.

### BFF

The BFF code is located in the `apps/bff/` directory. It acts as an intermediary between the client and the backend, handling tasks like caching and API aggregation.

## Scripts

The main scripts available in the root `package.json` are:

- `pnpm dev`: Runs all applications in development mode.
- `pnpm build`: Builds all applications.
- `pnpm dev:client`: Runs the client in development mode.
- `pnpm build:client`: Builds the client.
- `pnpm start:client`: Starts the client in production mode.
- `pnpm dev:server`: Runs the server in development mode.
- `pnpm build:server`: Builds the server.
- `pnpm start:server`: Starts the server in production mode.
- `pnpm dev:bff`: Runs the BFF in development mode.
- `pnpm build:bff`: Builds the BFF.
- `pnpm start:bff`: Starts the BFF in production mode.
- `pnpm build:packages`: Builds all packages.
- `pnpm db:migrate:deploy`: Deploys database migrations.
- `pnpm db:migrate:dev`: Runs database migrations in development.
- `pnpm db:generate`: Generates Prisma client.
- `pnpm db:push`: Pushes database schema changes.
- `pnpm db:seed`: Seeds the database with initial data.
- `pnpm test`: Runs all tests.
- `pnpm lint`: Lints the codebase.

## Environment Variables

### Backend Environment Variables

The backend server uses environment variables defined in the `.env` file located in the `apps/server/` directory. See `apps/server/.env.example` for a full list of required variables.

### BFF Environment Variables

The BFF service uses environment variables defined in the `.env` file located in the `apps/bff/` directory. See `apps/bff/.env.example` for a full list of required variables.

### Frontend Environment Variables

The frontend uses environment variables in the `.env.local` file in the `apps/client/` directory.

Example `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
```

## Backend

The backend is built with Node.js, Express, and Prisma. Key components include:

- **Express**: Web framework for the API
- **Prisma**: ORM for database operations
- **JWT**: Authentication and session management
- **Jest**: Testing framework

## Frontend

The frontend is built with Next.js. Key technologies include:

- **Next.js**: React framework with App Router
- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: UI component library
- **Tanstack Query**: Data fetching and caching
- **Zod**: Schema validation

## Packages

The monorepo includes shared packages in the `packages/` directory:

- **api-errors**: A collection of custom error classes for consistent error handling across the platform.
- **config-typescript**: Shared TypeScript configurations for the entire monorepo.
- **database**: Manages the database connection, schema, and queries.
- **dtos**: Data Transfer Objects for type-safe API communication
- **redis-cache**: A caching layer with Redis to improve performance.
- **schemas**: Zod schemas for validation
- **types**: Shared TypeScript types
- **utils**: Utility functions used across the application
- **youtube-api**: A wrapper around the YouTube API for fetching video data.

## Implemented Features

Below is a checklist of features that have been implemented:

- [x] User authentication (login, registration, logout)
- [x] Note-taking on YouTube videos
- [x] Dashboard to view recent notes
- [x] Responsive design
- [x] MDX editor for rich content
- [x] Google authentication
- [x] Email verification functionality
- [x] Forgot password functionality
- [x] Refresh token functionality
- [x] Pagination functionality
- [x] Export notes to PDF

## Features in Progress

Below is a checklist of features planned for this application:

- [ ] Improve email verification process (provide users with a method to verify their email address)
- [ ] Search functionality for notes
- [ ] Share notes with other users
- [ ] Caching functionality using Redis
- [ ] Dark mode support
- [ ] Code editor integration

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request. See [CONTRIBUTING.md](CONTRIBUTING.md) for more details.

## License

This project is licensed under the terms of the license file in the root directory of this project.
