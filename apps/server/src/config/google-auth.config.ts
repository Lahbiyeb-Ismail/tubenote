import envConfig from "./envConfig";

import type { GoogleConfig } from "../modules/auth/strategies/google.strategy";

export const googleAuthConfig: GoogleConfig = {
  clientID: envConfig.google.client_id,
  clientSecret: envConfig.google.client_secret,
  callbackURL: "/api/v1/auth/google/callback",
};
