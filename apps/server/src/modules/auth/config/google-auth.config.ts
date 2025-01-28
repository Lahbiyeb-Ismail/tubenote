import envConfig from "@config/env.config";

import type { GoogleConfig } from "@/modules/auth/features/oauth/google/google.strategy";

export const googleAuthConfig: GoogleConfig = {
  clientID: envConfig.google.client_id,
  clientSecret: envConfig.google.client_secret,
  callbackURL: envConfig.google.google_callback_url,
};
