import * as dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  YOUTUBE_API_URL: z.string().url().includes("www.googleapis.com"),
  YOUTUBE_API_KEY: z.string(),
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
  api: {
    url: validatedEnv.YOUTUBE_API_URL,
    key: validatedEnv.YOUTUBE_API_KEY,
  },
} as const;
