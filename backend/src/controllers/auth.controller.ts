import type { Request, Response } from 'express';
import httpStatus from 'http-status';

import { createNewUser, userExists } from '../helpers/auth.helper';

export async function handleSignup(req: Request, res: Response) {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(httpStatus.BAD_REQUEST).json({
      message: 'All fields are required. Please provide all fields',
    });
  }

  try {
    const isUserExists = await userExists(email);

    if (isUserExists)
      return res.status(httpStatus.CONFLICT).json({
        message:
          'Email address already exists. Please select another email address.',
      });

    const newUser = await createNewUser({ username, email, password });

    res.status(httpStatus.CREATED).json({
      message: 'Registration successful! You can now login.',
      user: { username: newUser.username, email: newUser.email },
    });
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      message: 'Internal Server Error',
    });
  }
}
