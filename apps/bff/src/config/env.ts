import * as dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

/**
 * Zod schema for validating environment variables required by the BFF (Backend for Frontend) service.
 *
 * @description This schema ensures all necessary environment variables are present and properly formatted
 * before the application starts. It validates configuration for the server, client communication,
 * Redis connection, and backend API integration.
 *
 * @property {string} NODE_ENV - The application environment mode. Must be one of "production", "development", or "test"
 * @property {string} PORT - The port number on which the BFF server will listen. Defaults to "3001" if not specified
 * @property {string} CLIENT_URL - The URL of the client application that will communicate with this BFF. Must be a valid URL format
 * @property {string} REDIS_PASSWORD - The password for authenticating with the Redis server
 * @property {string} REDIS_USERNAME - The username for authenticating with the Redis server
 * @property {string} REDIS_HOST - The hostname or IP address of the Redis server
 * @property {string} REDIS_PORT - The port number of the Redis server. Must be a numeric string
 * @property {string} BACKEND_API_URL - The URL of the backend API service. Must be a valid URL format
 *
 * @example
 * ```typescript
 * const config = envSchema.parse(process.env);
 * ```
 *
 * @throws {ZodError} Throws validation error if any required environment variable is missing or invalid
 */
const envSchema = z.object({
  NODE_ENV: z.enum(["production", "development", "test"]),
  PORT: z.string({ message: "PORT must be a string" }).default("3001"),
  CLIENT_URL: z.string().url({ message: "CLIENT_URL must be a valid URL" }),
  REDIS_PASSWORD: z.string(),
  REDIS_USERNAME: z.string(),
  REDIS_HOST: z.string(),
  REDIS_PORT: z.string().regex(/^\d+$/, { message: "REDIS_PORT must be a number" }),
  BACKEND_API_URL: z.string().url({ message: "BACKEND_API_URL must be a valid URL" }),
});

/**
 * Type representing the inferred schema from the environment configuration validation.
 * This type is automatically derived from the Zod schema definition and ensures
 * type safety for environment variables used throughout the application.
 *
 * @example
 * ```typescript
 * const config: EnvSchema = {
 *   NODE_ENV: 'development',
 *   PORT: 3000,
 *   DATABASE_URL: 'postgresql://...'
 * };
 * ```
 */
type EnvSchema = z.infer<typeof envSchema>;

/**
 * Validates environment variables against a predefined schema.
 *
 * @param env - The Node.js process environment variables object
 * @returns The validated environment configuration object conforming to EnvSchema
 * @throws {Error} When environment variable validation fails, with detailed error messages
 *
 * @example
 * ```typescript
 * const validatedEnv = validateEnv(process.env);
 * ```
 */
function validateEnv(env: NodeJS.ProcessEnv): EnvSchema {
  try {
    return envSchema.parse(env);
  }
  catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.issues.map(
        issue => `${issue.path.join(".")}: ${issue.message}`,
      );
      throw new Error(
        `Environment variable validation error: \n${errorMessages.join("\n")}`,
      );
    }
    throw error;
  }
}

const validatedEnv = validateEnv(process.env);

/**
 * Environment configuration object containing all validated environment variables
 * used throughout the BFF (Backend for Frontend) application.
 *
 * @remarks
 * This configuration is marked as `const` to ensure type safety and prevent
 * accidental modifications at runtime. All values are sourced from validated
 * environment variables.
 *
 * @example
 * ```typescript
 * import { envConfig } from './config/env';
 *
 * // Access server port
 * const port = envConfig.server.port;
 *
 * // Access Redis configuration
 * const redisHost = envConfig.redis.host;
 * ```
 */
export const envConfig = {
  node_env: validatedEnv.NODE_ENV,
  server: {
    port: validatedEnv.PORT,
  },
  client: {
    url: validatedEnv.CLIENT_URL,
  },
  redis: {
    username: validatedEnv.REDIS_USERNAME,
    password: validatedEnv.REDIS_PASSWORD,
    host: validatedEnv.REDIS_HOST,
    port: validatedEnv.REDIS_PORT,
  },
  backend_api: {
    url: validatedEnv.BACKEND_API_URL,
  },
} as const;
