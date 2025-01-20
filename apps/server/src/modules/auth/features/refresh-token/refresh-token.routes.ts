import { Router } from "express";
import { refreshTokenController } from "./refresh-token.module";

const router = Router();

// - POST /refresh: Refresh the user's access token.
router
  .route("/refresh")
  .post((req, res) => refreshTokenController.refreshToken(req, res));

export default router;
