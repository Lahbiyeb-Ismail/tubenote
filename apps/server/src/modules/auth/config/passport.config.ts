import passport from "passport";
import envConfig from "../../../config/envConfig";
import { userService } from "../di-container";
import {
  GoogleAuthStrategy,
  GoogleConfig,
} from "../strategies/google.strategy";

const googleAuthConfig: GoogleConfig = {
  clientID: envConfig.google.client_id,
  clientSecret: envConfig.google.client_secret,
  callbackURL: "/api/v1/auth/google/callback",
};

export function configurePassport() {
  const googleAuthStrategy = new GoogleAuthStrategy(
    googleAuthConfig,
    userService
  );
  passport.use(googleAuthStrategy.getStrategy());
}
