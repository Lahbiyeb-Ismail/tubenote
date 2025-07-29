# TubeNote Applications

Welcome to the `apps` directory! This is the heart of the TubeNote platform, containing the primary user-facing and server-side applications. Each application is designed to be a standalone component within our monorepo architecture.

## Applications Overview

-   [`client/`](./client/README.md): A **Next.js** application that serves as the main user interface. It provides a rich, interactive experience for watching videos and taking synchronized notes.

-   [`server/`](./server/README.md): An **Express.js** backend that powers the platform. It handles core business logic, manages database interactions, and exposes a comprehensive REST API for the client and BFF.

-   [`bff/`](./bff/README.md): A **Backend For Frontend** (BFF) built with **Express.js**. It acts as an intermediary layer, providing a tailored API for the client, handling session management, and simplifying communication with the main backend server.

## Getting Started

To run the applications, you can use the following commands from the **root of the monorepo**.

### Development

-   **Run all applications concurrently:**
    ```bash
    pnpm dev
    ```

-   **Run only the client:**
    ```bash
    pnpm dev:client
    ```

-   **Run only the server and BFF:**
    ```bash
    pnpm dev:server
    ```

### Production

-   **Build all applications:**
    ```bash
    pnpm build
    ```

-   **Start all applications:**
    ```bash
    pnpm start
    ```

-   **Build or start a specific application:**
    Use the `--filter` flag with `build` or `start` scripts (e.g., `pnpm build --filter client`).

## Architecture & Communication

The `client` application communicates with the `bff`, which in turn communicates with the `server`. This architecture decouples the frontend from the core backend, allowing for a more flexible and scalable system.

For more detailed information on each application, please refer to their individual `README.md` files.