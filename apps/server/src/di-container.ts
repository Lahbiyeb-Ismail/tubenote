import prismaClient from "./lib/prisma";

import { AuthController } from "./modules/auth/auth.controller";
import { AuthService } from "./modules/auth/auth.service";
import { UserRepository } from "./modules/user/user.repository";

import { googleAuthConfig } from "./config/google-auth.config";
import { GoogleAuthStrategy } from "./modules/auth/strategies/google.strategy";
import { JwtService } from "./modules/jwt/jwt.service";
import { NoteController } from "./modules/note/note.controller";
import { NoteRepository } from "./modules/note/note.repository";
import { NoteService } from "./modules/note/note.service";
import { PasswordService } from "./modules/password/password.service";
import { RefreshTokenRepository } from "./modules/refreshToken/refresh-token.repository";
import { RefreshTokenService } from "./modules/refreshToken/refresh-token.service";
import { ResetPasswordController } from "./modules/resetPasswordToken/reset-password.controller";
import { ResetPasswordRepository } from "./modules/resetPasswordToken/reset-password.repository";
import { ResetPasswordService } from "./modules/resetPasswordToken/reset-password.service";
import { UserController } from "./modules/user/user.controller";
import { UserService } from "./modules/user/user.service";
import { VerifyEmailController } from "./modules/verifyEmailToken/verify-email.controller";
import { VerifyEmailRepository } from "./modules/verifyEmailToken/verify-email.repository";
import { VerifyEmailService } from "./modules/verifyEmailToken/verify-email.service";
import { VideoController } from "./modules/video/video.controller";
import { VideoRepository } from "./modules/video/video.repository";
import { VideoService } from "./modules/video/video.service";
import { EmailService } from "./services/emailService";

const userRepository = new UserRepository(prismaClient);
const noteRepository = new NoteRepository(prismaClient);
const videoRepository = new VideoRepository(prismaClient);
const refreshTokenRepository = new RefreshTokenRepository(prismaClient);
const verifyEmailRepository = new VerifyEmailRepository(prismaClient);
const resetPasswordRepository = new ResetPasswordRepository(prismaClient);

const jwtService = new JwtService();
const passwordService = new PasswordService(userRepository);
const noteService = new NoteService(noteRepository);
const videoService = new VideoService(videoRepository);
const refreshTokenService = new RefreshTokenService(refreshTokenRepository);
const userService = new UserService(userRepository, passwordService);
const emailService = new EmailService(userRepository, verifyEmailRepository);
const resetPasswordService = new ResetPasswordService(
  resetPasswordRepository,
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
  userRepository,
  verifyEmailRepository,
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
