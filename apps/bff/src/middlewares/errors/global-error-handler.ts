import type { BaseError } from "@tubenote/api-errors";
import type { NextFunction, Request, Response } from "express";

import httpStatus from "http-status";

import { envConfig } from "@/config";

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
export function globalErrorHandler(
  err: BaseError,
  _req: Request,
  res: Response,
  next: NextFunction,
) {
  const statusCode = err.httpCode
    ? err.httpCode
    : httpStatus.INTERNAL_SERVER_ERROR;

  console.error(`${err.name} - ${statusCode}: ${err.message}.`);

  if (envConfig.node_env === "development") {
    console.error(`Error Stack: ${err.stack}`);
  }

  res.status(statusCode).json({
    message: err.message,
    statusCode,
    name: err.name,
  });

  next();
}
