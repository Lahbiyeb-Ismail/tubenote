import type { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import type { ZodSchema } from 'zod';

type RequestBodySchema = Record<'body', ZodSchema>;

/**
 * Middleware to validate the request body against a given schema.
 *
 * @param schema - The schema to validate the request body against.
 * @returns A middleware function that validates the request body.
 *
 * @example
 * ```typescript
 * import { validateRequestBody } from './middlewares/validateRequestBody';
 * import { someSchema } from './schemas/someSchema';
 *
 * app.post('/endpoint', validateRequestBody(someSchema), (req, res) => {
 *   res.send('Request body is valid');
 * });
 * ```
 *
 * @remarks
 * This middleware uses the `safeParse` method of the schema to validate the request body.
 * If the validation is successful, it calls the `next` middleware.
 * If the validation fails, it responds with a 400 status code and a JSON object containing the validation errors.
 *
 * @param req - The request object.
 * @param res - The response object.
 * @param next - The next middleware function.
 */
function validateRequestBody(schema: RequestBodySchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const requestBodySchema = schema.body;

    const parsedBody = requestBodySchema.safeParse(req.body);

    if (parsedBody.success) next();
    else {
      const errors = parsedBody.error.errors.map((err) => ({
        field: err.path.join(', '),
        message: err.message,
      }));

      res.status(httpStatus.BAD_REQUEST).json({
        message: 'Validation error',
        errors,
      });
    }
  };
}

export default validateRequestBody;
