import { Request, Response } from "express";
import { CsrfOptions } from "./csrf.service";

/**
 * Interface for the CSRF service
 */
export interface ICsrfService {
  /**
   * Generate a new CSRF token
   * @param sessionId Session ID to bind the token to
   */
  generateToken(sessionId: string): string;

  /**
   * Validate a CSRF token
   * @param token Token to validate
   * @param sessionId Session ID the token should be bound to
   */
  validateToken(token: string, sessionId: string): boolean;

  /**
   * Set a CSRF token cookie on the response
   * @param res Express response object
   * @param token CSRF token to set
   */
  setTokenCookie(res: Response, token: string): void;

  /**
   * Get the CSRF token from a request (headers, body, or query)
   * @param req Express request object
   */
  getTokenFromRequest(req: Request): string | undefined;

  /**
   * Get the CSRF token from a request cookie
   * @param req Express request object
   */
  getTokenFromCookie(req: Request): string | undefined;

  /**
   * Get the current CSRF options
   */
  getOptions(): CsrfOptions;
}
