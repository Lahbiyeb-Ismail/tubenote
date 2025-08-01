import type { NextFunction, Request, Response } from "express";

import { NotFoundError } from "@tubenote/api-errors";

/**
 * Middleware to handle requests to routes that are not found.
 *
 * This middleware function creates an error with a message indicating that
 * the requested route was not found,
 * sets the response status to 404 (Not Found), and passes the error to the next
 * middleware in the stack.
 *
 * @param req - The Express request object.
 * @param _res - The Express response object.
 * @param next - The next middleware function in the stack.
 */
export function notFoundRoute(req: Request, _res: Response, next: NextFunction) {
  const error = new NotFoundError(`404 - Route Not Found - ${req.originalUrl}`);

  next(error);
}
