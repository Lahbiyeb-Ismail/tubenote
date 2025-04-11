import type { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";

import { type BaseError, NotFoundError } from "@/modules/shared/api-errors";

import { envConfig } from "@/modules/shared/config";
import { loggerService, responseFormatter } from "@/modules/shared/services";

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

  loggerService.error(`${err.name} - ${statusCode}: ${err.message}.`);

  if (envConfig.node_env === "development") {
    loggerService.debug(`Error Stack: ${err.stack}`);
  }

  const formattedErrorResponse = responseFormatter.formatErrorResponse({
    message: err.message,
    statusCode,
    name: err.name,
  });

  res.status(statusCode).json(formattedErrorResponse);

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
