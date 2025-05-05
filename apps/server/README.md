# TubeNote Server

The TubeNote server is an Express.js application that provides the backend API for the TubeNote platform. It handles authentication, data storage, and business logic.

## Technologies

- **Express.js** - Web application framework
- **TypeScript** - Typed JavaScript
- **Prisma** - ORM for database access
- **Inversify** - Dependency injection container
- **Passport** - Authentication middleware
- **JWT** - JSON Web Tokens for authentication
- **Zod** - Schema validation
- **Winston** - Logging

## Features

- RESTful API endpoints for notes, videos, and users
- JWT-based authentication with refresh tokens
- Google OAuth integration
- Email verification
- Password reset functionality
- Prisma ORM for database interactions
- Dependency injection for better testability
- Comprehensive error handling
- API request validation with Zod

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- pnpm (v8 or later)
- PostgreSQL or other supported database

### Development

1. Install dependencies:
   ```bash
   pnpm install
   ```

2. Create an `.env` file with the following variables:
   ```
   # Server
   PORT=8000
   NODE_ENV=development
   API_URL=http://localhost:8000/api
   CLIENT_URL=http://localhost:3000

   # Database
   DATABASE_URL="postgresql://username:password@localhost:5432/tubenote"

   # JWT
   ACCESS_TOKEN_SECRET=your_access_token_secret
   REFRESH_TOKEN_SECRET=your_refresh_token_secret
   ACCESS_TOKEN_EXPIRE=20m
   REFRESH_TOKEN_EXPIRE=7d
   REFRESH_TOKEN_COOKIE_NAME=refresh_token

   # Email
   SMTP_HOST=smtp.example.com
   SMTP_PORT=587
   SMTP_USER=your_email@example.com
   SMTP_PASS=your_email_password
   EMAIL_FROM=noreply@tubenote.com

   # Google OAuth
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   GOOGLE_CALLBACK_URL=http://localhost:8000/api/auth/google/callback
   ```

3. Generate Prisma client:
   ```bash
   pnpm prisma:generate
   ```

4. Push database schema:
   ```bash
   pnpm prisma:push
   ```

5. Start the development server:
   ```bash
   pnpm dev
   ```

## Project Structure

- `src/` - Source code
  - `app.ts` - Express application setup
  - `index.ts` - Server entry point
  - `config/` - Configuration files
  - `middlewares/` - Express middlewares
  - `modules/` - Application modules (controllers, services, repositories)
  - `templates/` - Email templates
- `prisma/` - Prisma schema and migrations
- `logs/` - Application logs

## API Endpoints

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/google` - Google OAuth login
- `GET /api/notes` - Get user notes
- `POST /api/notes` - Create a new note
- `GET /api/notes/:id` - Get a specific note
- `PUT /api/notes/:id` - Update a note
- `DELETE /api/notes/:id` - Delete a note

## Testing

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch
```
