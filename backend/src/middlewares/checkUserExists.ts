import type { NextFunction, Request, Response } from 'express';

import prisma from '../lib/prismaDB';
import httpStatus from 'http-status';

async function checkUserExists(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { email } = req.body;

  const userExists = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (userExists) {
    return res.status(httpStatus.CONFLICT).json({
      message: `The user with email ${email} already exists. Please provide another email address.`,
    });
  }

  next();
}

export default checkUserExists;
