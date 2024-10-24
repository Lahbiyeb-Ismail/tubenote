import type { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';

/**
 * Middleware function to handle errors in the application.
 *
 * @param err - The error object.
 * @param _req - The request object (not used in this middleware).
 * @param res - The response object.
 * @param next - The next middleware function in the stack.
 *
 * Logs the error stack to the console, sets the response status code to 500
 * if it is not already set, and sends a JSON response with the error message.
 * Calls the next middleware function in the stack.
 *
 */
function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  next: NextFunction
) {
  console.log(err.stack);

  const status =
    res.statusCode !== httpStatus.OK
      ? res.statusCode
      : httpStatus.INTERNAL_SERVER_ERROR;

  res
    .status(status)
    .json({ message: 'Internal server error. Please try again.' });

  next();
}

/**
 * Middleware to handle requests to routes that are not found.
 *
 * This middleware function creates an error with a message indicating that
 * the requested route was not found,
 * sets the response status to 404 (Not Found), and passes the error to the next
 * middleware in the stack.
 *
 * @param req - The Express request object.
 * @param res - The Express response object.
 * @param next - The next middleware function in the stack.
 */
function notFoundRoute(req: Request, res: Response, next: NextFunction) {
  const error = new Error(`Route Not Found - ${req.originalUrl}`);

  res.status(404);

  next(error);
}

export { errorHandler, notFoundRoute };
