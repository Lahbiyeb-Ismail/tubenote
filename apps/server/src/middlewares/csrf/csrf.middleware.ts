import { NextFunction, Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";

import { ForbiddenError } from "@/modules/shared/api-errors";
import { ERROR_MESSAGES } from "@/modules/shared/constants/errors";

import { csrfService } from "@/config/service-provider";
import { ICsrfOptions } from "@/modules/shared/services";

/**
 * Configuration options for the CSRF middleware
 */
export interface CsrfMiddlewareOptions {
  /**
   * Custom error message for CSRF validation failure
   */
  errorMessage?: string;

  /**
   * List of HTTP methods that should be exempt from CSRF protection
   * Defaults to ['GET', 'HEAD', 'OPTIONS']
   */
  ignoreMethods?: string[];

  /**
   * List of routes that should be exempt from CSRF protection (e.g., '/api/health')
   */
  ignorePaths?: string[];

  /**
   * Options for the CSRF token and cookie
   */
  csrfOptions?: Partial<ICsrfOptions>;

  /**
   * Function to extract the session ID from the request
   * This is used to bind the CSRF token to the user session
   */
  sessionExtractor?: (req: Request) => string;
}

/**
 * Default CSRF middleware options
 */
const DEFAULT_MIDDLEWARE_OPTIONS: CsrfMiddlewareOptions = {
  errorMessage: ERROR_MESSAGES.INVALID_CSRF_TOKEN,
  ignoreMethods: ["GET", "HEAD", "OPTIONS"],
  ignorePaths: [],
  sessionExtractor: (req: Request) => req.sessionID || req.ip || uuidv4(),
};

/**
 * Creates a middleware function for CSRF protection
 *
 * @param options Configuration options for the CSRF middleware
 * @returns Express middleware function that enforces CSRF protection
 */
export function createCsrfMiddleware(options: CsrfMiddlewareOptions = {}) {
  const { errorMessage, ignoreMethods, ignorePaths, sessionExtractor } = {
    ...DEFAULT_MIDDLEWARE_OPTIONS,
    ...options,
  };

  /**
   * Express middleware function for CSRF protection
   */
  return function csrfProtection(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    // Skip CSRF check for ignored methods
    if (ignoreMethods!.includes(req.method)) {
      // Generate and set token for GET requests to use in subsequent requests
      if (req.method === "GET") {
        const sessionId = sessionExtractor!(req);
        const token = csrfService.generateToken(sessionId);
        csrfService.setTokenCookie(res, token);

        // Add CSRF token to res.locals for template rendering
        res.locals.csrfToken = token;
      }
      return next();
    }

    // Skip CSRF check for ignored paths
    if (ignorePaths && ignorePaths.some((path) => req.path.startsWith(path))) {
      return next();
    }

    // Extract session ID and tokens
    const sessionId = sessionExtractor!(req);
    const requestToken = csrfService.getTokenFromRequest(req);
    const cookieToken = csrfService.getTokenFromCookie(req);

    // Verify the token
    if (
      !requestToken ||
      !cookieToken ||
      !csrfService.validateToken(requestToken, sessionId)
    ) {
      return next(new ForbiddenError(errorMessage!));
    }

    // If token rotation is enabled, generate a new token for subsequent requests
    if (csrfService.getOptions().rotate) {
      const newToken = csrfService.generateToken(sessionId);
      csrfService.setTokenCookie(res, newToken);
      res.locals.csrfToken = newToken;
    }

    next();
  };
}
