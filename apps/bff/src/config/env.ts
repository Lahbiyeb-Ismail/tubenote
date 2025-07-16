import * as dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(["production", "development", "test"]),
  PORT: z.string({ message: "PORT must be a string" }).default("3001"),
  REDIS_PASSWORD: z.string(),
  REDIS_USERNAME: z.string(),
  REDIS_HOST: z.string(),
  REDIS_PORT: z.string().regex(/^\d+$/, { message: "REDIS_PORT must be a number" }),
});

type EnvSchema = z.infer<typeof envSchema>;

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

export const envConfig = {
  node_env: validatedEnv.NODE_ENV,
  server: {
    port: validatedEnv.PORT,
  },
  redis: {
    username: validatedEnv.REDIS_USERNAME,
    password: validatedEnv.REDIS_PASSWORD,
    host: validatedEnv.REDIS_HOST,
    port: validatedEnv.REDIS_PORT,
  },
} as const;
