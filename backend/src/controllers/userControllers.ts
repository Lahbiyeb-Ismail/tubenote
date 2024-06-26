import { Request, Response } from 'express';
import httpStatus from 'http-status';

import prisma from '../lib/prismaDB';

export async function createNewUser(req: Request, res: Response) {
  const { username, email, kindeId } = req.body;

  if (!username || !email || !kindeId)
    return res.status(httpStatus.BAD_REQUEST).json({
      message: 'All fields are required. Please provide all fields',
    });

  try {
    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        kindeId,
      },
    });

    res.status(httpStatus.CREATED).json({
      message: 'New User created successfully',
      data: newUser,
    });
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      message: 'Internal Server Error',
    });
  }
}
