import { Router } from 'express';
import passport from '../lib/passportAuth';

import {
  handleRegister,
  handleLogin,
  handleLogout,
  handleGoogleLogin,
} from '../controllers/auth.controller';
import validateRequestBody from '../middlewares/validateRequestBody';
import { registrationSchema, loginSchema } from '../schemas/auth.schema';

const router = Router();

router
  .route('/register')
  .post(validateRequestBody(registrationSchema), handleRegister);

router.route('/login').post(validateRequestBody(loginSchema), handleLogin);

router.route('/logout').post(handleLogout);

router
  .route('/google')
  .get(passport.authenticate('google', { scope: ['profile', 'email'] }));

router
  .route('/google/callback')
  .get(passport.authenticate('google', { session: false }), handleGoogleLogin);

export default router;
