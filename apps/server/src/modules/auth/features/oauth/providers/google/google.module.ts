import { googleOAuthConfig } from "./google.config";

import { GoogleOAuthStrategy } from "./google.strategy";

export const googleOAuthStrategy =
  GoogleOAuthStrategy.getInstance(googleOAuthConfig).getStrategy();
