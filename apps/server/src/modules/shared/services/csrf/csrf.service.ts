import crypto from "crypto";
import { Request, Response } from "express";
import { injectable } from "inversify";

import type { ICsrfService } from "./csrf.types";

/**
 * Configuration options for CSRF tokens
 */
export interface ICsrfOptions {
  /** Cookie name for the CSRF token */
  cookie: string;
  /** HTTP header name for the CSRF token */
  header: string;
  /** Form field name for the CSRF token */
  field: string;
  /** Duration in milliseconds until the token expires */
  ttl: number;
  /** Whether to create a new token on every request */
  rotate: boolean;
  /** Path for the CSRF cookie */
  path: string;
  /** Whether the CSRF cookie should be httpOnly */
  httpOnly: boolean;
  /** Whether the CSRF cookie should be secure (HTTPS only) */
  secure: boolean;
  /** SameSite attribute for the CSRF cookie */
  sameSite: boolean | "lax" | "strict" | "none";
}

/**
 * Default configuration for CSRF tokens
 */
export const DEFAULT_CSRF_OPTIONS: ICsrfOptions = {
  cookie: "csrf_token",
  header: "X-CSRF-Token",
  field: "_csrf",
  ttl: 24 * 60 * 60 * 1000, // 24 hours
  rotate: false,
  path: "/",
  httpOnly: false, // Client needs to read this token to send it back
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
};

/**
 * Provides CSRF (Cross-Site Request Forgery) protection functionality
 * including token generation, validation, and storage management.
 */
@injectable()
export class CsrfService implements ICsrfService {
  private readonly secretKey: Buffer;
  private readonly options: ICsrfOptions;

  /**
   * Creates a new instance of the CsrfService
   * @param options Configuration options for CSRF tokens
   */
  constructor() {
    this.options = DEFAULT_CSRF_OPTIONS;
    // Generate a random secret key for HMAC
    this.secretKey = crypto.randomBytes(32);
  }

  /**
   * Generates a new CSRF token
   * @param sessionId Unique session or user identifier to bind the token to
   * @returns A new CSRF token
   */
  public generateToken(sessionId: string): string {
    // Create a timestamp for token expiration
    const timestamp = Date.now() + this.options.ttl;

    // Concatenate session ID and timestamp
    const payload = `${sessionId}|${timestamp}`;

    // Create an HMAC signature
    const hmac = crypto.createHmac("sha256", this.secretKey);
    hmac.update(payload);
    const signature = hmac.digest("base64url");

    // Combine timestamp, session ID and signature to form the complete token
    return `${timestamp.toString(36)}.${signature}`;
  }

  /**
   * Validates a CSRF token
   * @param token The token to validate
   * @param sessionId The session ID the token should be bound to
   * @returns True if the token is valid, false otherwise
   */
  public validateToken(token: string, sessionId: string): boolean {
    if (!token || !sessionId) {
      return false;
    }

    try {
      // Split token into timestamp and signature
      const [timestampStr, signature] = token.split(".");

      if (!timestampStr || !signature) {
        return false;
      }

      // Parse timestamp
      const timestamp = parseInt(timestampStr, 36);

      // Check if token has expired
      if (Date.now() > timestamp) {
        return false;
      }

      // Reconstruct payload
      const payload = `${sessionId}|${timestamp}`;

      // Recreate HMAC signature for comparison
      const hmac = crypto.createHmac("sha256", this.secretKey);
      hmac.update(payload);
      const expectedSignature = hmac.digest("base64url");

      // Compare signatures using timing-safe comparison to prevent timing attacks
      return crypto.timingSafeEqual(
        Buffer.from(signature),
        Buffer.from(expectedSignature)
      );
    } catch (_error) {
      return false;
    }
  }

  /**
   * Sets a CSRF token cookie in the response
   * @param res Express response object
   * @param token CSRF token to set
   */
  public setTokenCookie(res: Response, token: string): void {
    res.cookie(this.options.cookie, token, {
      path: this.options.path,
      httpOnly: this.options.httpOnly,
      secure: this.options.secure,
      sameSite: this.options.sameSite,
      maxAge: this.options.ttl,
    });
  }

  /**
   * Gets the CSRF token from the request
   * Checks in order: headers, form body, query parameters
   *
   * @param req Express request object
   * @returns The CSRF token or undefined if not found
   */
  public getTokenFromRequest(req: Request): string | undefined {
    // Check header
    const headerToken = req.headers[this.options.header.toLowerCase()];
    if (headerToken && typeof headerToken === "string") {
      return headerToken;
    }

    // Check body
    if (req.body && this.options.field in req.body) {
      return req.body[this.options.field] as string;
    }

    // Check query parameters
    if (req.query && this.options.field in req.query) {
      return req.query[this.options.field] as string;
    }

    return undefined;
  }

  /**
   * Gets the CSRF token from the cookie
   * @param req Express request object
   * @returns The CSRF token from the cookie or undefined if not found
   */
  public getTokenFromCookie(req: Request): string | undefined {
    return req.cookies?.[this.options.cookie];
  }

  /**
   * Gets the current configuration options
   * @returns The current CSRF options
   */
  public getOptions(): ICsrfOptions {
    return { ...this.options };
  }
}
