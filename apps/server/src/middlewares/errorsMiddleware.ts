import type { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";

import envConfig from "../config/envConfig";
import { type BaseError, NotFoundError } from "../errors";
import logger from "../utils/logger";

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
  err: BaseError,
  _req: Request,
  res: Response,
  next: NextFunction
) {
  const statusCode = err.httpCode
    ? err.httpCode
    : httpStatus.INTERNAL_SERVER_ERROR;

  if (envConfig.node_env === "development") {
    logger.error(`${err.name} - ${statusCode}: ${err.message}.`);
    logger.error(`Error Stack: ${err.stack}`);
  } else {
    logger.error(`${err.name} - ${statusCode}: ${err.message}.`);
  }

  res.status(statusCode).json({ message: err.message });

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
function notFoundRoute(req: Request, _res: Response, next: NextFunction) {
  const error = new NotFoundError(`404 - Route Not Found - ${req.originalUrl}`);

  next(error);
}

export { errorHandler, notFoundRoute };
