import { Router } from "express";
import passport from "passport";

import { envConfig } from "@/modules/shared/config";

import { oauthController } from "../../oauth.module";
import { googleOAuthStrategy } from "./google.module";

passport.use(googleOAuthStrategy.getStrategy());

const googleOAuthRoutes = Router();

// - GET /google: Initiate Google OAuth authentication.
googleOAuthRoutes
  .route("/google")
  .get(passport.authenticate("google", { scope: ["profile", "email"] }));

// - GET /google/callback: Handle the Google OAuth callback.
googleOAuthRoutes.route("/google/callback").get(
  passport.authenticate("google", {
    failureRedirect: `${envConfig.client.url}/login`,
  }),
  (req, res) => oauthController.oauthLogin(req, res)
);

export { googleOAuthRoutes };
