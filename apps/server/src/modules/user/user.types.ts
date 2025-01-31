import type { Response } from "express";

import type { TypedRequest } from "@/types";

import type {
  CreateUserDto,
  GetUserDto,
  UpdatePasswordDto,
  UpdateUserDto,
} from "./dtos";
import type { User } from "./user.model";

export interface IUserRepository {
  createUser(params: CreateUserDto): Promise<User>;
  getUser(params: GetUserDto): Promise<User | null>;
  updateUser(id: string, updateUserDto: UpdateUserDto): Promise<User>;
  updatePassword(userId: string, hashedPassword: string): Promise<User>;
}

export interface IUserService {
  createUser(params: CreateUserDto): Promise<User>;
  findOrCreateUser(params: CreateUserDto): Promise<User>;
  getUserByEmail(email: string): Promise<User | null>;
  getUserById(userId: string): Promise<User>;
  updateUser(id: string, params: UpdateUserDto): Promise<User>;
  updatePassword(userId: string, params: UpdatePasswordDto): Promise<User>;
  resetPassword(userId: string, newPassword: string): Promise<User>;
}

export interface IUserController {
  getCurrentUser(req: TypedRequest, res: Response): Promise<void>;
  updateCurrentUser(
    req: TypedRequest<UpdateUserDto>,
    res: Response
  ): Promise<void>;
  updatePassword(
    req: TypedRequest<UpdatePasswordDto>,
    res: Response
  ): Promise<void>;
}
