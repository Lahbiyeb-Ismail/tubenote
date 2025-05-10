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
pnpm run start:dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the frontend result.

## Project Structure

TubeNote v2 is organized as a monorepo using pnpm workspaces with the following structure:

```
tubenote_v2/
├── apps/
│   ├── client/     # Next.js frontend application
│   └── server/     # Node.js backend application with Express
├── packages/
│   ├── dtos/       # Data Transfer Objects shared between client and server
│   ├── schemas/    # Schema definitions for validation
│   ├── types/      # TypeScript type definitions used across the project
│   └── utils/      # Shared utility functions
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

## Scripts

The main scripts available in the root `package.json` are:

- `pnpm run start:dev`: Runs both frontend and backend in development mode.
- `pnpm run start:build`: Builds and starts both frontend and backend.
- `pnpm run lint`: Lints the codebase.
- `pnpm run format`: Formats the codebase using Biome.

### Backend Scripts

In the `apps/server/package.json`:

- `pnpm run dev`: Starts the backend in development mode.
- `pnpm run build`: Builds the backend.
- `pnpm run start`: Builds and starts the backend in production mode.
- `pnpm run test`: Runs the backend tests.

### Frontend Scripts

In the `apps/client/package.json`:

- `pnpm run dev`: Starts the frontend in development mode.
- `pnpm run build`: Builds the frontend.
- `pnpm run start`: Starts the frontend in production mode.
- `pnpm run lint`: Lints the frontend code.

## Environment Variables

### Backend Environment Variables

The backend server uses environment variables defined in the `.env` file located in the `apps/server/` directory.

Example `.env` file:

```env
NODE_ENV=development
PORT=8080
SERVER_URL=http://localhost:8080
ACCESS_TOKEN_SECRET=your_access_token_secret
ACCESS_TOKEN_EXPIRE=20m
REFRESH_TOKEN_SECRET=your_refresh_token_secret
REFRESH_TOKEN_EXPIRE=1d
REFRESH_TOKEN_COOKIE_NAME=refresh_token
YOUTUBE_API_URL=https://www.googleapis.com/youtube/v3/
YOUTUBE_API_KEY=your_youtube_api_key
```

### Frontend Environment Variables

The frontend uses environment variables in the `.env.local` file in the `apps/client/` directory.

Example `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api
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

- **dtos**: Data Transfer Objects for type-safe API communication
- **schemas**: Zod schemas for validation
- **types**: Shared TypeScript types
- **utils**: Utility functions used across the application

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

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the terms of the license file in the root directory of this project.
