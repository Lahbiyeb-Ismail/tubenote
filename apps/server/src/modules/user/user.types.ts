import type { Response } from "express";

import type { TypedRequest } from "../../types";

import type { User } from "./user.model";

import type { UpdatePasswordDto } from "../../common/dtos/update-password.dto";
import type { CreateUserDto } from "./dtos/create-user.dto";
import type { UpdateUserDto } from "./dtos/update-user.dto";

export interface IUserRepository {
  create(createUserDto: CreateUserDto): Promise<User>;
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  updateUser(id: string, updateUserDto: UpdateUserDto): Promise<User>;
  updatePassword(userId: string, hashedPassword: string): Promise<User>;
}

export interface IUserService {
  createUser(createUserDto: CreateUserDto): Promise<User>;
  findOrCreateUser(createUserDto: CreateUserDto): Promise<User>;
  getUserByEmail(email: string): Promise<User | null>;
  getUserById(userId: string): Promise<User>;
  updateUser(id: string, updateUserDto: UpdateUserDto): Promise<User>;
  updatePassword(
    userId: string,
    updatePasswordDto: UpdatePasswordDto
  ): Promise<User>;
  verifyUserEmail(id: string): Promise<User>;
}

export interface IUserController {
  getCurrentUser(req: TypedRequest, res: Response): Promise<void>;
  updateCurrentUser(
    req: TypedRequest<UpdateUserDto>,
    res: Response
  ): Promise<void>;
}
