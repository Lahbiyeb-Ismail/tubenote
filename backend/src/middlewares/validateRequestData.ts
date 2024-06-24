import type { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import { z, type ZodSchema } from 'zod';

type RequestValidationSchema = Record<'body', ZodSchema>;

/**
 * Middleware to validate request data against a given Zod schema.
 *
 * @param {RequestValidationSchema} schema - The schema object containing optional body, query, and params keys, each with a Zod schema object.
 *
 * @returns An Express middleware function that validates the request data and returns a 400 BAD REQUEST if validation fails, or calls next if validation succeeds.
 */
const validateRequestData =
  (schema: RequestValidationSchema) =>
  (req: Request, res: Response, next: NextFunction) => {
    const bodySchema = schema.body ?? z.object({});
    // const querySchema = schema.query ?? z.object({});
    // const paramsSchema = schema.params ?? z.object({});

    const bodyValidation = bodySchema.safeParse(req.body);
    // const queryValidation = querySchema.safeParse(req.query);
    // const paramsValidation = paramsSchema.safeParse(req.params);

    const validationErrors = [];

    if (!bodyValidation.success) {
      validationErrors.push(...bodyValidation.error.errors);
    }
    // if (!queryValidation.success) {
    //   validationErrors.push(...queryValidation.error.errors);
    // }
    // if (!paramsValidation.success) {
    //   validationErrors.push(...paramsValidation.error.errors);
    // }

    if (validationErrors.length === 0) {
      next();
    } else {
      const errors = validationErrors.map((err) => ({
        field: err.path.join(', '),
        message: err.message,
      }));

      res.status(httpStatus.BAD_REQUEST).json({ errors });
    }
  };

export default validateRequestData;
