#!/bin/bash

# Build all packages
pnpm -w run build:types && pnpm -w run build:schemas && pnpm -w run build:utils && pnpm -w run build:dtos && pnpm -w run build:client

# Build the client app
pnpm run build

echo "Build completed successfully!"
