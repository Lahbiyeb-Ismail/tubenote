# TubeNote Applications

This directory contains the main applications that make up the TubeNote platform.

## Structure

- [`client/`](./client/README.md) - Next.js frontend application
- [`server/`](./server/README.md) - Express backend server

## Client Application

The client is a Next.js application that provides the user interface for TubeNote. It enables users to watch videos and take notes simultaneously. See the [client README](./client/README.md) for details.

## Server Application

The server is an Express.js application that manages the backend logic, database interactions, and API endpoints. See the [server README](./server/README.md) for details.

## Running the Applications

From the root directory, you can run:

- `pnpm dev:client` - Start the client in development mode
- `pnpm dev:server` - Start the server in development mode
- `pnpm build:client` - Build the client for production
- `pnpm build:server` - Build the server for production
