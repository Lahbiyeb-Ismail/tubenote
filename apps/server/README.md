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

## Architecture

The server follows a modular architecture based on domain-driven design principles to ensure separation of concerns and maintainability:

- **Modules**: The application is divided into domain-specific modules (auth, user, notes, videos)
- **Layers**: Each module follows a layered architecture:
  - **Controllers**: Handle HTTP requests and responses
  - **Services**: Implement business logic and orchestrate operations
  - **Repositories**: Encapsulate data access logic
  - **DTOs**: Define data transfer objects for input/output
  - **Types**: Define interfaces for dependency injection

### Dependency Injection

TubeNote server uses Inversify to implement dependency injection, which:
- Decouples components for easier testing
- Centralizes service instantiation
- Facilitates singleton pattern where appropriate
- Allows for flexible configuration and mocking

## Authentication System

### Authentication Flow

The server implements a secure authentication system with multiple strategies:

1. **Local Authentication** (Email/Password)
   - User registration with email verification
   - Password hashing using bcrypt
   - Secure login with rate limiting to prevent brute force attacks
   - JWT-based session management with refresh tokens

2. **OAuth Authentication** (Google)
   - Integration with Google OAuth for single sign-on
   - Account linking with existing email accounts
   - Automatic profile creation based on OAuth provider data

### User Sessions

Sessions are managed using a combined approach of:

- **Access Tokens**: Short-lived JWTs (default: 20 minutes) sent as cookies for API authentication
- **Refresh Tokens**: Long-lived tokens (default: 7 days) stored securely as HTTP-only cookies and in the database
- **Token Rotation**: Each use of a refresh token invalidates it and issues a new one for enhanced security
- **Device Tracking**: Sessions track device information for suspicious activity detection
- **Token Revocation**: Ability to invalidate all sessions for a specific user

### Security Measures

- HTTP-only cookies with secure and SameSite flags
- CSRF protection
- Rate limiting on authentication endpoints
- IP tracking for suspicious activity
- Device fingerprinting for multi-device support
- Automatic session invalidation on suspicious activity

## Email Verification

The email verification system ensures that only users with valid email addresses can fully access the platform:

1. **Verification Process**:
   - Upon registration, an unverified user account is created
   - A unique verification token is generated and stored in the database with an expiration time
   - A verification email with a secure token link is sent to the user's email
   - The user clicks the link, which validates the token and marks the account as verified

2. **Implementation Details**:
   - Tokens are cryptographically secure and tied to specific user accounts
   - Tokens expire after a configurable period (default: 24 hours)
   - Verification status is required for sensitive operations
   - Users can request new verification emails if the original expires

## Password Reset Flow

The password reset system provides a secure way for users to regain access to their accounts:

1. **Request Phase**:
   - User requests a password reset by providing their email
   - System verifies the email exists and is verified
   - A secure reset token is generated and stored in a cache with expiration
   - Reset email with token link is sent to the user's email

2. **Reset Phase**:
   - User clicks the link and provides a new password
   - System validates the token from the URL
   - Password is updated after validation
   - All existing sessions are invalidated for security
   - User receives confirmation of password change

3. **Security Considerations**:
   - Tokens are single-use and expire after a configurable period
   - Rate limiting prevents abuse of the reset mechanism
   - Email notifications are sent when passwords are changed
   - Cache-based storage prevents database pollution with expired tokens

## Data Models

The primary data models in the system include:

- **User**: Core user information and authentication details
- **Account**: OAuth provider connections and credentials
- **RefreshToken**: Session management and token tracking
- **EmailVerificationToken**: Email verification status tracking
- **Note**: User-created notes linked to specific videos
- **Video**: Metadata for videos that users have annotated

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
    - `auth/` - Authentication and authorization
    - `user/` - User management
    - `note/` - Note management
    - `video/` - Video management
    - `shared/` - Shared utilities and services
  - `templates/` - Email templates
- `prisma/` - Prisma schema and migrations
- `logs/` - Application logs

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/google` - Google OAuth login
- `GET /api/auth/google/callback` - Google OAuth callback
- `GET /api/auth/verify-email/:token` - Verify email address
- `POST /api/auth/send-verification-email` - Resend verification email
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password/:token` - Reset password with token

### User Management

- `GET /api/users/me` - Get current user profile
- `PATCH /api/users/me` - Update user profile
- `PATCH /api/users/update-password` - Update password

### Notes and Videos

- `GET /api/notes` - Get user notes
- `POST /api/notes` - Create a new note
- `GET /api/notes/:id` - Get a specific note
- `PUT /api/notes/:id` - Update a note
- `DELETE /api/notes/:id` - Delete a note
- `GET /api/videos/:videoId/notes` - Get notes for a specific video

## Testing

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch
```

## Error Handling

The server implements a comprehensive error handling system:

- Custom error classes for different types of errors
- Consistent error response format
- Detailed logging for debugging
- Graceful handling of unexpected errors

## Rate Limiting

The server implements rate limiting on sensitive endpoints:

- Authentication endpoints (login, register, password reset)
- Profile update endpoints
- Based on IP address and/or user ID when authenticated

## Logging

The application uses Winston for logging with the following setup:

- Different log levels based on environment
- File-based logs with rotation
- Console logs during development
- Error tracking and alerting in production
