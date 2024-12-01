import { Router } from 'express';
import passport from '../lib/passportAuth';

import {
  handleRegister,
  handleLogin,
  handleLogout,
  handleGoogleLogin,
  handleRefreshToken,
} from '../controllers/auth.controller';
import validateRequestBody from '../middlewares/validateRequestBody';
import { registrationSchema, loginSchema } from '../schemas/auth.schema';

const router = Router();

// - POST /register: Register a new user (requires request body validation).
router
  .route('/register')
  .post(validateRequestBody(registrationSchema), handleRegister);

// - POST /login: Authenticate a user (requires request body validation).
router.route('/login').post(validateRequestBody(loginSchema), handleLogin);

// - POST /logout: Log out the current user.
router.route('/logout').post(handleLogout);

// - POST /refresh: Refresh the user's access token.
router.route('/refresh').post(handleRefreshToken);

// - GET /google: Initiate Google OAuth authentication.
router
  .route('/google')
  .get(passport.authenticate('google', { scope: ['profile', 'email'] }));

// - GET /google/callback: Handle the Google OAuth callback.
router
  .route('/google/callback')
  .get(passport.authenticate('google', { session: false }), handleGoogleLogin);

export default router;
