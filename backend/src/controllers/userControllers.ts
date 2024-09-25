// import { Request, Response } from 'express';
// import httpStatus from 'http-status';

// import prisma from '../lib/prismaDB';

// export async function createNewUser(req: Request, res: Response) {
//   const { username, email, kindeId } = req.body;

//   if (!username || !email || !kindeId)
//     return res.status(httpStatus.BAD_REQUEST).json({
//       message: 'All fields are required. Please provide all fields',
//     });

//   try {
//     const newUser = await prisma.user.create({
//       data: {
//         name: username,
//         email,
//         kindeId,
//       },
//     });

//     res.status(httpStatus.CREATED).json({
//       message: 'New User created successfully',
//       data: newUser,
//     });
//   } catch (error) {
//     res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
//       message: 'Internal Server Error',
//     });
//   }
// }

// export async function getUserById(req: Request, res: Response) {
//   const kindeId = req.params['user_id'];

//   if (!kindeId)
//     return res.status(httpStatus.BAD_REQUEST).json({
//       message: 'User ID is required. Please provide a user ID',
//     });

//   try {
//     const user = await prisma.user.findUnique({
//       where: {
//         kindeId,
//       },
//     });

//     if (!user)
//       return res.status(httpStatus.NOT_FOUND).json({
//         message: 'User not found. Please provide a valid user ID',
//       });

//     res.status(httpStatus.OK).json({
//       message: 'User succefully found!',
//       data: user,
//     });
//   } catch (error) {
//     res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
//       message: 'Internal Server Error',
//     });
//   }
// }
