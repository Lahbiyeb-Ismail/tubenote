import { Router } from "express";
import passport from "passport";

import { envConfig } from "@modules/shared";

import { googleAuthController, googleAuthStrategy } from "./google.module";

passport.use(googleAuthStrategy.getStrategy());

const router = Router();

// - GET /google: Initiate Google OAuth authentication.
router
  .route("/google")
  .get(passport.authenticate("google", { scope: ["profile", "email"] }));

// - GET /google/callback: Handle the Google OAuth callback.
router.route("/google/callback").get(
  passport.authenticate("google", {
    failureRedirect: `${envConfig.client.url}/login`,
  }),
  (req, res) => googleAuthController.googleLogin(req, res)
);

export default router;
