import { Router } from "express";

import { isAuthenticated } from "@/middlewares";
import { refreshTokenController } from "./refresh-token.module";

const refreshTokenRoutes = Router();

refreshTokenRoutes.use(isAuthenticated);

// - POST /refresh: Refresh the user's access token.
refreshTokenRoutes
  .route("/refresh")
  .post((req, res) => refreshTokenController.refreshToken(req, res));

export { refreshTokenRoutes };
