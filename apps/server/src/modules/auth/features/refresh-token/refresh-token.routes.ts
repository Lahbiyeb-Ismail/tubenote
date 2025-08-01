import { Router } from "express";

import { refreshTokenController } from "@/config/service-provider";

const refreshTokenRoutes: Router = Router();

refreshTokenRoutes.post("/refresh", (req, res) => refreshTokenController.refreshAuthTokens(req, res));

export { refreshTokenRoutes };
