import "express-async-errors";
// Import reflect-metadata at the top to enable decorators
import "reflect-metadata";

import cookieParser from "cookie-parser";
import cors from "cors";
import express, {
  type Express,
  type NextFunction,
  type Request,
  type Response,
} from "express";
import session from "express-session";
import helmet from "helmet";
import passport from "passport";
import requestIp from "request-ip";

// Import from our service provider which uses the DI container
import "@/config/service-provider";

import { authRoutes, oauthRoutes } from "@/modules/auth";
import { noteRoutes } from "@/modules/note";
import { userRoutes } from "@/modules/user";
import { videoRoutes } from "@/modules/video";

import {
  createCsrfMiddleware,
  errorHandler,
  notFoundRoute,
} from "@/middlewares";

import { envConfig } from "@/modules/shared/config";
import { DEFAULT_CSRF_CONFIG } from "@/modules/shared/config/csrf.config";
import { loggerService } from "@/modules/shared/services";
import { clientContextMiddleware } from "./middlewares/client-context.middleware";

const app: Express = express();

// Security middlewares
app.use(helmet());

// Basic request parsing
app.use(express.json());
app.use(cookieParser());
app.use(requestIp.mw());
app.use(express.urlencoded({ extended: true }));

// Configure CORS middleware
app.use(
  cors({
    origin: ["http://localhost:3000"], // Specify the allowed origin(s) for requests
    credentials: true, // Allow sending cookies along with the requests
  })
);

// Add session middleware
app.use(
  session({
    secret: envConfig.server.session_secret,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: envConfig.node_env === "production" },
  })
);

// Authentication setup
app.use(passport.initialize());
app.use(passport.session());

// Serialize user into the session
passport.serializeUser((user, done) => {
  done(null, user);
});

// Deserialize user from the session
passport.deserializeUser((user, done) => {
  // @ts-ignore
  done(null, user);
});

app.use(clientContextMiddleware);

// Middleware to log HTTP requests
app.use((req: Request, _res: Response, next: NextFunction) => {
  loggerService.http(`${req.method} ${req.url}`);
  next();
});

// Apply CSRF protection to all routes
app.use(createCsrfMiddleware(DEFAULT_CSRF_CONFIG));

app.get("/", (_req, res) => {
  res.json({ message: "Hello from the server!" });
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/oauth", oauthRoutes);
app.use("/api/v1/videos", videoRoutes);
app.use("/api/v1/notes", noteRoutes);
app.use("/api/v1/users", userRoutes);

// ?: Global Error middleware
app.use(notFoundRoute);
app.use(errorHandler);

export default app;
