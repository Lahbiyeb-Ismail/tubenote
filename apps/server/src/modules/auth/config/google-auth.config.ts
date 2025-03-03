import { envConfig } from "@/modules/shared/config";

import type { GoogleConfig } from "../features";

export const googleAuthConfig: GoogleConfig = {
  clientID: envConfig.google.client_id,
  clientSecret: envConfig.google.client_secret,
  callbackURL: envConfig.google.google_callback_url,
};
