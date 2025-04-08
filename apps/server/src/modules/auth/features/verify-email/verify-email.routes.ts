import { Router } from "express";

import { tokenParamSchema } from "@tubenote/shared";

import { validateRequest } from "@/middlewares";

import { verifyEmailController } from "./verify-email.module";

const verifyEmailRoutes = Router();

// - GET /verify-email/:token: Verify the user's email using the provided token (requires request params validation)
verifyEmailRoutes
  .route("/verify-email/:token")
  .get(validateRequest({ params: tokenParamSchema }), (req, res) =>
    verifyEmailController.verifyEmail(req, res)
  );

export { verifyEmailRoutes };
