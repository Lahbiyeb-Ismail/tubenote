import prismaClient from "./lib/prisma";

import { AuthController } from "./modules/auth/auth.controller";
import { AuthService } from "./modules/auth/auth.service";
import { UserDatabase } from "./modules/user/user.db";

import { googleAuthConfig } from "./config/google-auth.config";
import { GoogleAuthStrategy } from "./modules/auth/strategies/google.strategy";
import { JwtService } from "./modules/jwt/jwt.service";
import { NoteController } from "./modules/note/note.controller";
import { NoteDatabase } from "./modules/note/note.db";
import { NoteService } from "./modules/note/note.service";
import { PasswordService } from "./modules/password/password.service";
import { RefreshTokenDatabase } from "./modules/refreshToken/refresh-token.db";
import { RefreshTokenService } from "./modules/refreshToken/refresh-token.service";
import { ResetPasswordController } from "./modules/resetPasswordToken/reset-password.controller";
import { ResetPasswordTokenDatabase } from "./modules/resetPasswordToken/reset-password.db";
import { ResetPasswordService } from "./modules/resetPasswordToken/reset-password.service";
import { UserController } from "./modules/user/user.controller";
import { UserService } from "./modules/user/user.service";
import { VerificationTokenDatabase } from "./modules/verifyEmailToken/verification-token.db";
import { VerifyEmailController } from "./modules/verifyEmailToken/verify-email.controller";
import { VerifyEmailService } from "./modules/verifyEmailToken/verify-email.service";
import { VideoController } from "./modules/video/video.controller";
import { VideoDatabase } from "./modules/video/video.db";
import { VideoService } from "./modules/video/video.service";
import { EmailService } from "./services/emailService";

const userDB = new UserDatabase(prismaClient);
const noteDB = new NoteDatabase(prismaClient);
const videoDB = new VideoDatabase(prismaClient);
const refreshTokenDB = new RefreshTokenDatabase(prismaClient);
const verificationTokenDB = new VerificationTokenDatabase(prismaClient);
const resetPasswordTokenDB = new ResetPasswordTokenDatabase(prismaClient);

const jwtService = new JwtService();
const passwordService = new PasswordService(userDB);
const noteService = new NoteService(noteDB);
const videoService = new VideoService(videoDB);
const refreshTokenService = new RefreshTokenService(refreshTokenDB);
const userService = new UserService(userDB, passwordService);
const emailService = new EmailService(userDB, verificationTokenDB);
const resetPasswordService = new ResetPasswordService(
  resetPasswordTokenDB,
  userService,
  passwordService,
  emailService
);
const authService = new AuthService(
  jwtService,
  userService,
  passwordService,
  refreshTokenService,
  emailService
);
const verifyEmailService = new VerifyEmailService(
  userDB,
  verificationTokenDB,
  authService
);

const authController = new AuthController(authService);
const userController = new UserController(userService);
const noteController = new NoteController(noteService);
const videoController = new VideoController(videoService);
const resetPasswordController = new ResetPasswordController(
  resetPasswordService
);
const verifyEmailController = new VerifyEmailController(verifyEmailService);

const googleAuthStrategy = new GoogleAuthStrategy(
  googleAuthConfig,
  userService
);

export {
  googleAuthStrategy,
  authController,
  userController,
  noteController,
  videoController,
  resetPasswordController,
  verifyEmailController,
};
