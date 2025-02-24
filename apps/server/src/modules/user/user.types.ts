import type { Response } from "express";

import type { TypedRequest } from "@/types";

import type {
  ICreateUserDto,
  IGetUserDto,
  IResetPasswordDto,
  IUpdatePasswordDto,
  IUpdateUserDto,
  User,
} from "@modules/user";

export interface IUserRepository {
  transaction<T>(fn: (tx: IUserRepository) => Promise<T>): Promise<T>;
  createUser(createUserDto: ICreateUserDto): Promise<User>;
  getUserByEmail(email: string): Promise<User | null>;
  getUserById(id: string): Promise<User | null>;
  getUser(getUserDto: IGetUserDto): Promise<User | null>;
  updateUser(updateUserDto: IUpdateUserDto): Promise<User>;
  updatePassword(userId: string, hashedPassword: string): Promise<User>;
  verifyUserEmail(userId: string): Promise<User>;
}

export interface IUserService {
  createUser(createUserDto: ICreateUserDto): Promise<User>;
  getOrCreateUser(createUserDto: ICreateUserDto): Promise<User>;
  getUser(getUserDto: IGetUserDto): Promise<User>;
  updateUser(updateUserDto: IUpdateUserDto): Promise<User>;
  updatePassword(updatedPasswordDto: IUpdatePasswordDto): Promise<User>;
  resetPassword(resetPasswordDto: IResetPasswordDto): Promise<User>;
  verifyUserEmail(userId: string): Promise<User>;
}

export interface IUserController {
  getCurrentUser(req: TypedRequest, res: Response): Promise<void>;
  updateCurrentUser(
    req: TypedRequest<IUpdateUserDto>,
    res: Response
  ): Promise<void>;
  updatePassword(
    req: TypedRequest<IUpdatePasswordDto>,
    res: Response
  ): Promise<void>;
}
