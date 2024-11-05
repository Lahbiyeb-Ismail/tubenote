import path from 'node:path';

import * as dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config({
  path: path.resolve(__dirname, '../../.env'),
});

const envSchema = z.object({
  NODE_ENV: z.enum(['production', 'development', 'test']),
  PORT: z.string({ message: 'PORT must be a string' }).default('8080'),
  SERVER_URL: z.string({ message: 'SERVER_URL must be a string' }),
  CLIENT_URL: z.string({ message: 'ClIELT_URL must be a string' }),
  ACCESS_TOKEN_SECRET: z.string().min(8),
  ACCESS_TOKEN_EXPIRE: z.string().default('20m'),
  REFRESH_TOKEN_SECRET: z.string().min(8),
  REFRESH_TOKEN_EXPIRE: z.string().default('1d'),
  REFRESH_TOKEN_COOKIE_NAME: z.string().default('refresh_token'),
  YOUTUBE_API_URL: z.string().url().includes('www.googleapis.com'),
  YOUTUBE_API_KEY: z.string(),
  GOOGLE_CLIENT_ID: z.string(),
  GOOGLE_CLIENT_SECRET: z.string(),
  GOOGLE_REDIRECT_URI: z.string(),
});

type EnvSchema = z.infer<typeof envSchema>;

function validateEnv(env: NodeJS.ProcessEnv): EnvSchema {
  try {
    return envSchema.parse(env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.issues.map(
        (issue) => `${issue.path.join('.')}: ${issue.message}`
      );
      throw new Error(
        `Environment variable validation error: \n${errorMessages.join('\n')}`
      );
    }
    throw error;
  }
}

const validatedEnv = validateEnv(process.env);

const envConfig = {
  node_env: validatedEnv.NODE_ENV,
  server: {
    port: validatedEnv.PORT,
    url: validatedEnv.SERVER_URL,
  },
  client: {
    url: validatedEnv.CLIENT_URL,
  },
  jwt: {
    access_token: {
      secret: validatedEnv.ACCESS_TOKEN_SECRET,
      expire: validatedEnv.ACCESS_TOKEN_EXPIRE,
    },
    refresh_token: {
      secret: validatedEnv.REFRESH_TOKEN_SECRET,
      expire: validatedEnv.REFRESH_TOKEN_EXPIRE,
      cookie_name: validatedEnv.REFRESH_TOKEN_COOKIE_NAME,
    },
  },
  youtube: {
    api: {
      url: validatedEnv.YOUTUBE_API_URL,
      key: validatedEnv.YOUTUBE_API_KEY,
    },
  },
  google: {
    client_id: validatedEnv.GOOGLE_CLIENT_ID,
    client_secret: validatedEnv.GOOGLE_CLIENT_SECRET,
    redirect_uri: validatedEnv.GOOGLE_REDIRECT_URI,
  },
} as const;

export default envConfig;
