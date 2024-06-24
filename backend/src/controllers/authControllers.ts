import { Request, Response } from 'express';
import httpStatus from 'http-status';
import bcrypt from 'bcryptjs';

import prisma from '../lib/prismaDB';

export async function handleSignup(req: Request, res: Response) {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(httpStatus.BAD_REQUEST).json({
        message: 'All fields are required. Please provide all fields',
      });
    }

    const isUserExists = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (isUserExists)
      return res.status(httpStatus.CONFLICT).json({
        message:
          'Email address already exists. Please select another email address.',
      });

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });

    res.status(httpStatus.CREATED).json({
      message: 'New User created successfully',
    });
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      message: 'Internal Server Error',
    });
  }
}
