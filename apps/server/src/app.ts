import "express-async-errors";

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

import authRoutes from "@/modules/auth/auth.routes";
import noteRoutes from "@/modules/note/note.routes";
import userRoutes from "@/modules/user/user.routes";
import videoRoutes from "@/modules/video/video.routes";

import { errorHandler, notFoundRoute } from "@/middlewares";

import { envConfig } from "@/modules/shared/config";
import { loggerService } from "@/modules/shared/services";

const app: Express = express();

app.use(helmet());

app.use(express.json());

app.use(cookieParser());

// parse urlencoded request body
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
    cookie: { secure: false },
  })
);

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

// Middleware to log HTTP requests
app.use((req: Request, _res: Response, next: NextFunction) => {
  loggerService.http(`${req.method} ${req.url}`);
  next();
});

app.get("/", (_req, res) => {
  res.json({ message: "Hello from the server!" });
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/videos", videoRoutes);
app.use("/api/v1/notes", noteRoutes);
app.use("/api/v1/users", userRoutes);

// ?: Global Error middleware
app.use(notFoundRoute);
app.use(errorHandler);

export default app;
