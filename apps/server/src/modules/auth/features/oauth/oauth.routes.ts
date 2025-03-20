import { Router } from "express";

import { validateRequest } from "@/middlewares";
import { oauthCodeSchema } from "@/modules/shared/schemas";

import { oauthController } from "./oauth.module";
import { googleOAuthRoutes } from "./providers";

const oauthRoutes = Router();

// Google authentication routes
oauthRoutes.use("/", googleOAuthRoutes);

oauthRoutes
  .route("/exchange-oauth-code")
  .post(validateRequest({ body: oauthCodeSchema }), (req, res) =>
    oauthController.exchangeOauthCodeForTokens(req, res)
  );

export { oauthRoutes };
