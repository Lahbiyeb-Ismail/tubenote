# TubeNote Server

The backend server for the TubeNote application. It is responsible for handling all API requests, user authentication, data management, and interaction with external services like the YouTube API.

## ✨ Features

-   **Authentication:** Robust authentication system supporting both local (email/password) and Google OAuth providers.
-   **JWT-based Sessions:** Secure session management using JSON Web Tokens (JWT) with access and refresh token rotation.
-   **Password Management:** Secure password handling, including password reset and update functionalities.
-   **Email Verification:** Email verification flow to ensure user authenticity.
-   **CRUD Operations:** Full CRUD capabilities for core application resources like Notes and Videos.
-   **Rate Limiting:** Middleware to protect against brute-force attacks and abuse on sensitive endpoints.
-   **YouTube Integration:** Fetches video data and transcripts from the YouTube API.
-   **Modular Architecture:** Organized into distinct modules for features like `auth`, `user`, `video`, and `note` for better maintainability and scalability.
-   **Dependency Injection:** Utilizes InversifyJS for managing dependencies and improving code testability.
-   **Structured Logging:** Comprehensive logging with Winston for effective debugging and monitoring.

## 🚀 Tech Stack

-   **Framework:** [Express.js](https://expressjs.com/)
-   **Language:** [TypeScript](https://www.typescriptlang.org/)
-   **Database ORM:** [Prisma](https://www.prisma.io/)
-   **Authentication:** [Passport.js](http://www.passportjs.org/) (for Google OAuth), [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken)
-   **Dependency Injection:** [InversifyJS](https://inversify.io/)
-   **Caching:** [Redis](https://redis.io/) (via `@tubenote/redis-cache`)
-   **Validation:** [Zod](https://zod.dev/)
-   **Security:** [Helmet](https://helmetjs.github.io/), [bcryptjs](https://github.com/dcodeIO/bcrypt.js)
-   **Logging:** [Winston](https://github.com/winstonjs/winston)
-   **Emailing:** [Nodemailer](https://nodemailer.com/)
-   **Templating:** [Handlebars](https://handlebarsjs.com/) for email templates.

## 📂 Folder & File Structure

The server's source code is organized into a modular structure to promote separation of concerns and scalability.

```
src/
├── app.ts                 # Express application setup, middleware, and routes
├── index.ts               # Server entry point (starts the server)
├──
├── config/                # Configuration files
│   ├── inversify/         # InversifyJS (DI container) setup
│   └── service-provider/  # Service initialization and registration
│
├── middlewares/           # Custom Express middleware
│   ├── auth/              # Authentication and authorization middleware
│   ├── rate-limit/        # Rate limiting middleware
│   ├── error.middleware.ts # Global error handler
│   └── validate-request.middleware.ts # Zod-based request validation
│
├── modules/               # Core feature modules
│   ├── auth/              # Authentication (local, OAuth, JWT, password reset)
│   ├── user/              # User profile and account management
│   ├── video/             # Video data management
│   ├── note/              # Note management
│   └── shared/            # Shared utilities, services, and types
│
└── templates/             # Handlebars email templates
```

## ⚙️ Setup and Installation

1.  **Prerequisites:** Ensure you have [Node.js](https://nodejs.org/) and [pnpm](https://pnpm.io/) installed.
2.  **Install Dependencies:** From the root of the monorepo, run:
    ```bash
    pnpm install
    ```
3.  **Navigate to Server:**
    ```bash
    cd apps/server
    ```
4.  **Environment Variables:** Create a `.env` file by copying the example file.
    ```bash
    cp .env.example .env
    ```
5.  **Fill Environment Variables:** Open the `.env` file and fill in the required values as described in the section below.

## 🔑 Environment Variable Configuration

The `.env` file contains all the necessary environment variables for the server to run.

| Variable                          | Description                                                                                             | Example                                                    |
| --------------------------------- | ------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------- |
| `NODE_ENV`                        | The application environment.                                                                            | `development`                                              |
| `PORT`                            | The port on which the server will run.                                                                  | `8080`                                                     |
| `SERVER_URL`                      | The base URL of the server.                                                                             | `http://localhost:8080`                                    |
| `CLIENT_URL`                      | The URL of the client application (for CORS and redirects).                                             | `http://localhost:3000`                                    |
| `SESSION_SECRET`                  | A secret key for signing session cookies.                                                               | `a-very-strong-and-long-secret`                            |
| `DATABASE_URL`                    | The connection string for your database (e.g., PostgreSQL).                                             | `postgresql://user:password@localhost:5432/tubenote`       |
| `ACCESS_TOKEN_COOKIE_NAME`        | The name of the cookie for the access token.                                                            | `access_token`                                             |
| `ACCESS_TOKEN_SECRET`             | The secret key for signing access tokens.                                                               | `your-access-token-secret`                                 |
| `ACCESS_TOKEN_EXPIRES_IN`         | The expiration time for access tokens.                                                                  | `15m`                                                      |
| `REFRESH_TOKEN_COOKIE_NAME`       | The name of the cookie for the refresh token.                                                           | `refresh_token`                                            |
| `REFRESH_TOKEN_SECRET`            | The secret key for signing refresh tokens.                                                              | `your-refresh-token-secret`                                |
| `REFRESH_TOKEN_EXPIRES_IN`        | The expiration time for refresh tokens.                                                                 | `7d`                                                       |
| `RESET_PASSWORD_TOKEN_SECRET`     | The secret for password reset tokens.                                                                   | `your-reset-password-secret`                               |
| `RESET_PASSWORD_TOKEN_EXPIRES_IN` | The expiration time for password reset tokens.                                                          | `1h`                                                       |
| `VERIFY_EMAIL_TOKEN_SECRET`       | The secret for email verification tokens.                                                               | `your-verify-email-secret`                                 |
| `VERIFY_EMAIL_TOKEN_EXPIRES_IN`   | The expiration time for email verification tokens.                                                      | `1d`                                                       |
| `HASH_ALGORITHM`                  | The hashing algorithm to use.                                                                           | `sha256`                                                   |
| `YOUTUBE_API_URL`                 | The base URL for the YouTube Data API.                                                                  | `https://www.googleapis.com/youtube/v3`                    |
| `YOUTUBE_API_KEY`                 | Your API key for the YouTube Data API.                                                                  | `your-youtube-api-key`                                     |
| `GOOGLE_CLIENT_ID`                | The client ID for Google OAuth.                                                                         | `your-google-client-id.apps.googleusercontent.com`         |
| `GOOGLE_CLIENT_SECRET`            | The client secret for Google OAuth.                                                                     | `your-google-client-secret`                                |
| `GOOGLE_CALLBACK_URL`             | The callback URL for Google OAuth.                                                                      | `/api/v1/oauth/google/callback`                            |
| `GOOGLE_REDIRECT_URI`             | The full redirect URI for Google OAuth.                                                                 | `http://localhost:8080/api/v1/oauth/google/callback`       |
| `SMTP_HOST`                       | The hostname of your SMTP server.                                                                       | `smtp.gmail.com`                                           |
| `SMTP_PORT`                       | The port of your SMTP server.                                                                           | `465`                                                      |
| `SMTP_USER`                       | The username for your SMTP server.                                                                      | `your-email@example.com`                                   |
| `SMTP_PASSWORD`                   | The password for your SMTP server.                                                                      | `your-smtp-password`                                       |
| `EMAIL_FROM`                      | The "from" address for outgoing emails.                                                                 | `no-reply@tubenote.com`                                    |
| `PYTHON_EXECUTABLE`               | The path to the Python executable for running scripts.                                                  | `python3`                                                  |
| `SCRIPT_TIMEOUT`                  | The timeout for Python script execution in milliseconds.                                                | `30000`                                                    |
| `REDIS_USERNAME`                  | The username for your Redis instance.                                                                   | `default`                                                  |
| `REDIS_PASSWORD`                  | The password for your Redis instance.                                                                   | `your-redis-password`                                      |
| `REDIS_HOST`                      | The hostname of your Redis instance.                                                                    | `localhost`                                                |
| `REDIS_PORT`                      | The port of your Redis instance.                                                                        | `6379`                                                     |

## ▶️ Running the Application

### Development

To run the server in development mode with hot-reloading:

```bash
pnpm dev
```

The server will be available at `http://localhost:8080` (or the port specified in your `.env` file).

### Production

To build and run the server for production:

```bash
# 1. Build the application
pnpm build

# 2. Start the server
pnpm start
```

## 📜 Scripts

The following scripts are available in the `package.json`:

-   `pnpm dev`: Starts the server in development mode using `tsx` for hot-reloading.
-   `pnpm build`: Compiles the TypeScript code to JavaScript in the `dist` directory.
-   `pnpm start`: Starts the production server from the compiled code in `dist`.
-   `pnpm test`: Runs the test suite using Jest.

## 🧪 Testing

Tests are written using [Jest](https://jestjs.io/). To run the test suite, execute:

```bash
pnpm test
```

## 📖 API Documentation

The API is versioned and all routes are prefixed with `/api/v1`.

### Main API Routes:

-   `/api/v1/auth`: Handles local authentication, logout, password reset, and email verification.
-   `/api/v1/oauth`: Manages OAuth flows (e.g., Google).
-   `/api/v1/videos`: Provides endpoints for video-related data.
-   `/api/v1/notes`: Endpoints for creating, reading, updating, and deleting notes.
-   `/api/v1/users`: Manages user profile information.

For detailed endpoint specifications, please refer to the route definitions within each module in the `src/modules` directory.

## 🤝 Contribution

Contributions are welcome! Please follow the guidelines in the main `CONTRIBUTING.md` file of the repository.

## 📄 License

This project is licensed under the **MIT License**. See the [LICENSE](./LICENSE) file for details.
