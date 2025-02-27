import { envConfig } from "@modules/shared";

import type { GoogleConfig } from "@/modules/auth";

export const googleAuthConfig: GoogleConfig = {
  clientID: envConfig.google.client_id,
  clientSecret: envConfig.google.client_secret,
  callbackURL: envConfig.google.google_callback_url,
};
