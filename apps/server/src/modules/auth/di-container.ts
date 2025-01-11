import prismaClient from "../../lib/prisma";

import { UserDatabase } from "../user/user.db";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";

import { EmailService } from "../../services/emailService";
import { JwtService } from "../jwt/jwt.service";
import { PasswordService } from "../password/password.service";
import { RefreshTokenDatabase } from "../refreshToken/refresh-token.db";
import { RefreshTokenService } from "../refreshToken/refresh-token.service";
import { UserService } from "../user/user.service";
import { VerificationTokenDatabase } from "../verifyEmailToken/verification-token.db";

const userDB = new UserDatabase(prismaClient);
const refreshTokenDB = new RefreshTokenDatabase(prismaClient);
const verificationTokenDB = new VerificationTokenDatabase(prismaClient);

const jwtService = new JwtService();
const passwordService = new PasswordService(userDB);
const userService = new UserService(userDB, passwordService);
const refreshTokenService = new RefreshTokenService(refreshTokenDB);
const emailService = new EmailService(userDB, verificationTokenDB);

const authService = new AuthService(
  jwtService,
  userService,
  passwordService,
  refreshTokenService,
  emailService
);
const authController = new AuthController(authService);

export { authController, userService };
