import type { NextFunction, Request, Response } from "express";

import { sessionCacheService } from "@/services";

declare global {
  // eslint-disable-next-line ts/no-namespace
  namespace Express {
    interface Request {
      sessionData: {
        sessionId: string;
        accessToken: string;
        refreshToken: string;
      };
    }
  }
}

export async function validateSessionMiddleware(req: Request, res: Response, next: NextFunction) {
  const sessionId = req.cookies.session_id;

  if (!sessionId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const sessionData = await sessionCacheService.getSession(sessionId);

  if (!sessionData || !sessionData.accessToken) {
    throw new Error("You must be logged in to access this resource");
  }

  // Attach user information to the request object
  req.sessionData = { ...sessionData, sessionId };

  // Proceed to the next middleware or route handler
  next();
}
