export const TYPES = {
  // Shared Services
  PrismaService: Symbol.for("PrismaService"),
  LoggerService: Symbol.for("LoggerService"),
  CryptoService: Symbol.for("CryptoService"),
  ResponseFormatter: Symbol.for("ResponseFormatter"),
  RateLimitService: Symbol.for("RateLimitService"),
  MailSenderService: Symbol.for("MailSenderService"),
  CacheService: Symbol.for("CacheService"),

  // Auth Module
  JwtService: Symbol.for("JwtService"),
  AuthService: Symbol.for("AuthService"),
  AuthController: Symbol.for("AuthController"),

  // Local Auth Module
  LocalAuthService: Symbol.for("LocalAuthService"),
  LocalAuthController: Symbol.for("LocalAuthController"),

  // OAuth Module
  OAuthService: Symbol.for("OAuthService"),
  OAuthController: Symbol.for("OAuthController"),

  // RefreshToken Module
  RefreshTokenRepository: Symbol.for("RefreshTokenRepository"),
  RefreshTokenService: Symbol.for("RefreshTokenService"),
  RefreshTokenController: Symbol.for("RefreshTokenController"),

  // Verify Email Module
  VerifyEmailService: Symbol.for("VerifyEmailService"),
  VerifyEmailRepository: Symbol.for("VerifyEmailRepository"),
  VerifyEmailController: Symbol.for("VerifyEmailController"),

  // Reset Password Module
  ResetPasswordService: Symbol.for("ResetPasswordService"),
  ResetPasswordController: Symbol.for("ResetPasswordController"),

  // User Module
  UserController: Symbol.for("UserController"),
  UserService: Symbol.for("UserService"),
  UserRepository: Symbol.for("UserRepository"),

  // Account Module
  AccountService: Symbol.for("AccountService"),
  AccountRepository: Symbol.for("AccountRepository"),

  // Video Module
  VideoController: Symbol.for("VideoController"),
  VideoService: Symbol.for("VideoService"),
  VideoRepository: Symbol.for("VideoRepository"),

  // Note Module
  NoteController: Symbol.for("NoteController"),
  NoteService: Symbol.for("NoteService"),
  NoteRepository: Symbol.for("NoteRepository"),
};
