import httpStatus from "http-status";
import { type ZodSchema, ZodError } from "zod";
import type { NextFunction, Response } from "express";

import type { TypedRequest } from "../types";

/**
 * Defines the schema for validating different parts of an HTTP request.
 *
 * @template B - The schema for the request body.
 * @template P - The schema for the request parameters.
 * @template Q - The schema for the request query.
 *
 * @property {B} [body] - Optional schema for the request body.
 * @property {P} [params] - Optional schema for the request parameters.
 * @property {Q} [query] - Optional schema for the request query.
 */
type RequestSchema<
	B extends ZodSchema,
	P extends ZodSchema,
	Q extends ZodSchema,
> = {
	body?: B;
	params?: P;
	query?: Q;
};

/**
 * Middleware to validate the request body, params, and query using Zod schemas.
 *
 * @template B - Zod schema for the request body.
 * @template P - Zod schema for the request params.
 * @template Q - Zod schema for the request query.
 *
 * @param {RequestSchema<B, P, Q>} schema - An object containing the Zod schemas for body, params, and query.
 * @returns {Function} Middleware function to validate the request.
 *
 * @throws {ZodError} If validation fails, responds with a 400 status and a list of validation errors.
 * @throws {Error} If an unexpected error occurs, responds with a 500 status and an error message.
 */
function validateRequest<
	B extends ZodSchema,
	P extends ZodSchema,
	Q extends ZodSchema,
>(
	schema: RequestSchema<B, P, Q>,
): (req: TypedRequest<B, P, Q>, res: Response, next: NextFunction) => void {
	return (req: TypedRequest<B, P, Q>, res: Response, next: NextFunction) => {
		try {
			if (schema.body) {
				req.body = schema.body.parse(req.body);
			}
			if (schema.params) {
				req.params = schema.params.parse(req.params);
			}
			if (schema.query) {
				req.query = schema.query.parse(req.query);
			}
			next();
		} catch (error) {
			if (error instanceof ZodError) {
				const errors = error.errors.map((err) => ({
					field: err.path.join(", "),
					message: err.message,
				}));

				res.status(httpStatus.BAD_REQUEST).json({
					message: "Validation error",
					errors,
				});
			} else {
				console.error("Unexpected error during request validation:", error);
				res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
					message: "An unexpected error occurred",
				});
			}
		}
	};
}

export default validateRequest;
