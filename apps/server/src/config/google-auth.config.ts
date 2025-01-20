import envConfig from "./env.config";

import type { GoogleConfig } from "@/modules/auth/core/strategies/google.strategy";

export const googleAuthConfig: GoogleConfig = {
  clientID: envConfig.google.client_id,
  clientSecret: envConfig.google.client_secret,
  callbackURL: "/api/v1/auth/google/callback",
};
