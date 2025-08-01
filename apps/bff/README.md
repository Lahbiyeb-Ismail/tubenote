# TubeNote BFF (Backend For Frontend)

This README provides a comprehensive guide for developers working on the TubeNote BFF application. The BFF acts as an intermediary layer between the TubeNote frontend client and the backend services.

## 1. Architecture Overview

The BFF's primary role is to provide a tailored API for the frontend application. It handles session management, authentication, and aggregates data from various backend services, simplifying the client-side logic.

### Tech Stack

-   **Framework**: Express.js
-   **Language**: TypeScript
-   **HTTP Client**: Axios (for communicating with the backend)
-   **Validation**: Zod (for environment variables and request validation)
-   **Session Management**: Redis (via `@tubenote/redis-cache`)
-   **Runtime**: Node.js

### High-Level Flow

```
+----------------+      +-------------------+      +-----------------+
| Frontend App   | <--> |   TubeNote BFF    | <--> | Backend Service |
| (e.g., React)  |      | (Express.js)      |      | (API)           |
+----------------+      +-------------------+      +-----------------+
                          |
                          |
                          v
                      +-------------------+
                      |   Redis Cache     |
                      | (Session Storage) |
                      +-------------------+
```

1.  The **Frontend App** makes API requests to the **BFF**.
2.  The **BFF** handles authentication and session management using cookies and a **Redis Cache**.
3.  For protected routes, the BFF validates the session.
4.  The BFF then makes requests to the downstream **Backend Service** to fetch or modify data, adding necessary authentication tokens.
5.  Finally, it formats the response and sends it back to the client.

---

## 2. Getting Started

Follow these instructions to set up and run the project on your local machine.

### Prerequisites

-   [Node.js](https://nodejs.org/) (LTS version recommended)
-   [pnpm](https://pnpm.io/installation)

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/tubenote.git
    cd tubenote
    ```

2.  **Install dependencies:**
    From the root of the monorepo, run:
    ```bash
    pnpm install
    ```

3.  **Set up Environment Variables:**
    Navigate to the BFF directory (`apps/bff`) and create a `.env` file by copying the example:
    ```bash
    cp .env.example .env
    ```
    Update the `.env` file with your local configuration. See the [Environment Variables](#6-environment-variables) section for details.

4.  **Run the Development Server:**
    From the root of the monorepo, run:
    ```bash
    pnpm --filter @tubenote/bff dev
    ```
    The server will start on the port specified in your `.env` file (default is `3001`) and will automatically restart on file changes.

---

## 3. Folder Structure

The project is organized into modules to maintain a clean and scalable architecture.

```
apps/bff/
└── src/
    ├── app.ts                # Core Express application setup (middleware, etc.)
    ├── index.ts              # Server entry point (starts the HTTP server)
    ├── config/               # Environment variable loading and validation
    ├── lib/                  # Shared libraries (e.g., configured Axios instance)
    ├── middlewares/          # Express middlewares (auth, error handling, validation)
    ├── modules/              # Business logic, organized by feature
    │   ├── auth/             # Authentication logic (login, logout, register)
    │   ├── note/             # Note-related logic
    │   ├── user/             # User profile logic
    │   └── video/            # Video-related logic
    ├── routes/               # Main router that combines all module routes
    ├── services/             # Shared services (e.g., session cache service)
    └── types/                # Global TypeScript type definitions
```

---

## 4. Available Scripts

You can run these scripts from the root of the monorepo using `pnpm --filter @tubenote/bff <script_name>`.

-   `dev`: Starts the development server with hot-reloading using `tsx`.
-   `build`: Compiles the TypeScript code to JavaScript in the `dist/` directory for production.
-   `start`: Executes the compiled code to run the application in production mode.

---

## 5. Environment Variables

The following environment variables are required. Create a `.env` file in the `apps/bff` directory to configure them.

| Variable          | Description                                           | Example                               |
| ----------------- | ----------------------------------------------------- | ------------------------------------- |
| `NODE_ENV`        | The application environment.                          | `development`                         |
| `PORT`            | The port for the BFF server to listen on.             | `3001`                                |
| `CLIENT_URL`      | The URL of the frontend application for CORS.         | `http://localhost:3000`               |
| `REDIS_PASSWORD`  | The password for the Redis instance.                  | `your-redis-password`                 |
| `REDIS_USERNAME`  | The username for the Redis instance.                  | `default`                             |
| `REDIS_HOST`      | The hostname of the Redis server.                     | `localhost`                           |
| `REDIS_PORT`      | The port of the Redis server.                         | `6379`                                |
| `BACKEND_API_URL` | The base URL for the downstream backend API service.  | `http://localhost:5000`               |

---

## 6. API Documentation

API endpoints are defined in the `src/modules` directory. Each feature module (e.g., `auth`, `note`) has a `*.routes.ts` file that defines its endpoints, the required validation schemas, and the controller methods that handle them.

For now, please explore the code in these files to understand the available routes. We recommend using a tool like [Postman](https://www.postman.com/) or [Insomnia](https://insomnia.rest/) for testing the endpoints locally.

---

## 7. Testing

This section is a placeholder. Testing infrastructure using a framework like Jest will be added soon.

---

## 8. Deployment

The application is containerized using Docker for consistent deployments. The deployment process is automated via a CI/CD pipeline (e.g., GitHub Actions) that performs the following steps:

1.  Installs dependencies.
2.  Lints and tests the code.
3.  Builds the production-ready JavaScript code using `pnpm build`.
4.  Builds a Docker image.
5.  Pushes the image to a container registry and deploys it to the hosting environment.

---

## 9. Contributing

Please refer to the root `CONTRIBUTING.md` file for detailed guidelines on our branching strategy, commit message conventions, and pull request process.

---

## 10. Troubleshooting & FAQ

-   **CORS Errors**: If you see CORS errors in the browser console, ensure the `CLIENT_URL` in your `.env` file exactly matches the URL of the running frontend application (including the port).
-   **Authentication Failed / 401 Unauthorized**:
    -   Verify that your Redis server is running and the connection details (`REDIS_*` variables) in `.env` are correct.
    -   Ensure the `BACKEND_API_URL` is correct and the backend service is running.
-   **Environment Validation Error on Startup**: The server will fail to start if any required environment variables are missing or invalid. Check the console output for a detailed message from Zod indicating which variable is causing the issue.

---

## 11. License

This project is licensed under the **MIT License**.

---

## 12. Contact / Maintainers

If you have questions or encounter issues, please open an issue on the GitHub repository or reach out to the project maintainers.
