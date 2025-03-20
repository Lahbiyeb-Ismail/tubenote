import { googleOAuthConfig } from "./google.config";

import { GoogleOAuthStrategy } from "./google.strategy";

export const googleOAuthStrategy = new GoogleOAuthStrategy(googleOAuthConfig);
