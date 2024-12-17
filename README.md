# TubeNote v2

TubeNote is a web application that enhances the video-watching experience by enabling users to take intuitive and efficient notes while watching videos.

## Table of Contents

- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Scripts](#scripts)
- [Environment Variables](#environment-variables)
- [Backend](#backend)
- [Frontend](#frontend)
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
yarn install
```

Run the development server:

```sh
yarn start:dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the frontend result.

## Project Structure

### Backend

The backend code is located in the `backend/` directory. It includes:

- `src/`: Source code for the backend.
- `prisma/`: Prisma schema and migrations.
- `package.json`: Backend-specific dependencies and scripts.

### Frontend

The frontend code is located in the `frontend/` directory. It includes:

- `src/`: Source code for the frontend.
- `public/`: Public assets.
- `package.json`: Frontend-specific dependencies and scripts.

## Scripts

The main scripts available in the root `package.json` are:

- `yarn start:dev`: Runs both frontend and backend in development mode.
- `yarn start:build`: Builds and starts both frontend and backend.
- `yarn lint`: Lints the codebase.
- `yarn format`: Formats the codebase using Prettier.

### Backend Scripts

In the `backend/package.json`:

- `yarn dev`: Starts the backend in development mode.
- `yarn build`: Builds the backend.
- `yarn start`: Builds and starts the backend in production mode.

### Frontend Scripts

In the `frontend/package.json`:

- `yarn dev`: Starts the frontend in development mode.
- `yarn build`: Builds the frontend.
- `yarn start`: Starts the frontend in production mode.

## Environment Variables

The backend uses environment variables defined in the `.env` file located in the `backend/` directory. The schema for these variables is defined in `envConfig`.

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

## Backend

The backend is built with Node.js, Express, and Prisma. Key files include:

- `envConfig`: Handles environment variable validation and configuration.
- `index.ts`: Entry point for the backend server.
- `generateTokens.ts`: Functions for generating JWT tokens.
- `video.helper.ts`: Functions for interacting with the YouTube API and saving video data.

## Frontend

The frontend is built with Next.js. Key files include:

- `src/pages/`: Contains the main pages of the application.
- `src/components/`: Contains reusable components.
- `next.config.mjs`: Next.js configuration file.
- `tailwind.config.ts`: Tailwind CSS configuration file.

## Implemented Features

Below is a checklist of features that has been implemented:

- [x] User authentication (login, registration, logout)
- [x] Note-taking on YouTube videos
- [x] Dashboard to view recent notes
- [x] Responsive design
- [x] Add a new Editor (mdx editor)
- [x] User authentication whit google
- [x] Email verification functionality
- [x] Forgot password funtionality
- [x] Refresh token funtionality
- [x] Pagination functionality
- [x] Export notes to PDF

## Features in progress:

Below is a checklist of features planned for this application:

- [ ] Improve email verification process (provide users with a method to verify their email address)
- [ ] Search functionality for notes
- [ ] Share notes with other users
- [ ] Cashing functionality using Redis
- [ ] Dark mode support
- [ ] Add code Editor
