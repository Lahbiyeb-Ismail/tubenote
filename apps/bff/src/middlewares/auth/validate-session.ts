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

/**
 * Middleware to validate user session and authenticate requests.
 *
 * This middleware checks for a valid session ID in cookies, retrieves session data
 * from cache, and attaches session information to the request object for downstream
 * middleware and route handlers.
 *
 * @param req - Express request object containing cookies and where session data will be attached
 * @param res - Express response object used to send error responses
 * @param next - Express next function to proceed to the next middleware
 *
 * @throws {Error} When session data is missing or invalid
 *
 * @returns {void} Calls next() to continue middleware chain or sends 401 response
 *
 * @example
 * ```typescript
 * app.use('/protected', validateSessionMiddleware);
 * ```
 */
export async function validateSessionMiddleware(req: Request, res: Response, next: NextFunction) {
  const sessionId = req.cookies.session_id;

  if (!sessionId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const sessionData = await sessionCacheService.getSession(sessionId);

  if (!sessionData || !sessionData.accessToken) {
    throw new Error("You must be logged in to access this resource");
  }

  req.sessionData = { ...sessionData, sessionId };

  next();
}
