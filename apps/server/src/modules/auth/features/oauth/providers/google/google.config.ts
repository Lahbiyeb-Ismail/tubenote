import { envConfig } from "@/modules/shared/config";

import type { GoogleConfig } from "./google.types";

export const googleOAuthConfig: GoogleConfig = {
  clientID: envConfig.google.client_id,
  clientSecret: envConfig.google.client_secret,
  callbackURL: envConfig.google.google_callback_url,
};
