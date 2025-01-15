import { Router } from "express";

import validateRequest from "../../middlewares/validateRequest";

import { verifyEmailController } from "../../di-container";

import { tokenParamSchema } from "../../common/schemas/token-param.schema";

const router = Router();

// - POST /send-verification-email: Send a verification email to the user (requires request body validation)
// router
//   .route("/send-verification-email")
//   .post(validateRequest({ body: emailBodySchema }), (req, res) =>
//     verifyEmailController.sendEmail(req, res)
//   );

// - GET /verify-email/:token: Verify the user's email using the provided token (requires request params validation)
router
  .route("/verify-email/:token")
  .get(validateRequest({ params: tokenParamSchema }), (req, res) =>
    verifyEmailController.verifyEmail(req, res)
  );

export default router;
