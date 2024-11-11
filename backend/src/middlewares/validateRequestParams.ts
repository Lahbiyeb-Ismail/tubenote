import type { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import type { ZodSchema } from 'zod';

type RequestParamsSchema = Record<'params', ZodSchema>;

function validateRequestParams(schema: RequestParamsSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const requestParamsSchema = schema.params;

    const parsedParams = requestParamsSchema.safeParse(req.params);

    if (parsedParams.success) next();
    else {
      const errors = parsedParams.error.errors.map((err) => ({
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

export default validateRequestParams;
