import { Router } from "express";

import validateRequest from "../../middlewares/validate-request.middleware";

import { resetPasswordController } from "./reset-password.module";

import { emailBodySchema } from "../../common/schemas/email-body.schema";
import { tokenParamSchema } from "../../common/schemas/token-param.schema";
import { passwordBodySchema } from "./schemas/password-body.schema";

const router = Router();

// - POST /forgot-password: Initiate the password reset process (requires request body validation).
router
  .route("/forgot-password")
  .post(validateRequest({ body: emailBodySchema }), (req, res) =>
    resetPasswordController.forgotPassword(req, res)
  );

// - GET /reset-password/:token/verify: Verify the password reset token (requires request params validation).
router
  .route("/reset-password/:token/verify")
  .get(validateRequest({ params: tokenParamSchema }), (req, res) =>
    resetPasswordController.verifyResetToken(req, res)
  );

// - POST /reset-password/:token: Reset the password using a valid token (requires request params and body validation).
router.route("/reset-password/:token").post(
  validateRequest({
    params: tokenParamSchema,
    body: passwordBodySchema,
  }),
  (req, res) => resetPasswordController.resetPassword(req, res)
);

export default router;
