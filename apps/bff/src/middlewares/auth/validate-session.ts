import type { NextFunction, Request, Response } from "express";

declare global {
  // eslint-disable-next-line ts/no-namespace
  namespace Express {
    interface Request {
      sessionId: string;
    }
  }
}

export function validateSessionMiddleware(req: Request, res: Response, next: NextFunction) {
  const sessionId = req.cookies.session_id;

  if (!sessionId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  // Attach user information to the request object
  req.sessionId = sessionId;

  // Proceed to the next middleware or route handler
  next();
}
