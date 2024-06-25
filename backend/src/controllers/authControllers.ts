import { Request, Response } from 'express';
import httpStatus from 'http-status';
import bcrypt from 'bcryptjs';

import prisma from '../lib/prismaDB';
import generateToken from '../utils/generateToken';

export async function handleSignup(req: Request, res: Response) {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(httpStatus.BAD_REQUEST).json({
      message: 'All fields are required. Please provide all fields',
    });
  }

  try {
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

    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });

    res.status(httpStatus.CREATED).json({
      message: 'New User created successfully',
      token: generateToken({ id: newUser.id, email: newUser.email }, '1d'),
    });
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      message: 'Internal Server Error',
    });
  }
}

export async function handlelogin(req: Request, res: Response) {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(httpStatus.BAD_REQUEST).json({
      message: 'All fields are required. Please provide all fields',
    });

  try {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user)
      return res.status(httpStatus.NOT_FOUND).json({
        message: 'User not found. Please signup to continue.',
      });

    const isPasswordsMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordsMatch)
      return res.status(httpStatus.UNAUTHORIZED).json({
        message: 'Invalid credentials. Please provide valid credentials',
      });

    res.status(httpStatus.OK).json({
      message: "User's login successful",
      token: generateToken({ id: user.id, email: user.email }, '1d'),
    });
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      message: 'Internal Server Error',
    });
  }
}
