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
  transaction<T>(fn: (tx: IUserRepository) => Promise<T>): Promise<T>;
  createUser(dto: CreateUserDto): Promise<User>;
  getUser(dto: GetUserDto): Promise<User | null>;
  updateUser(id: string, updateUserDto: UpdateUserDto): Promise<User>;
  updatePassword(userId: string, hashedPassword: string): Promise<User>;
}

export interface IUserService {
  createUser(dto: CreateUserDto): Promise<User>;
  getOrCreateUser(dto: CreateUserDto): Promise<User>;
  getUser(dto: GetUserDto): Promise<User>;
  updateUser(id: string, dto: UpdateUserDto): Promise<User>;
  updatePassword(userId: string, dto: UpdatePasswordDto): Promise<User>;
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
