import type { Express } from "express";

import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import helmet from "helmet";

import { envConfig } from "./config";
import { appRoutes } from "./routes";

const app: Express = express();

app.use(helmet());

// Configure CORS middleware
app.use(
  cors({
    origin: [envConfig.client.url], // Specify the allowed origin(s) for requests
    credentials: true, // Allow sending cookies along with the requests
  }),
);

app.use(express.json());
app.use(cookieParser());

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api", appRoutes);

export default app;
