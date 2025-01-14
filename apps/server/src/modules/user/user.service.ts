import { ERROR_MESSAGES } from "../../constants/errorMessages";

import { BadRequestError, ConflictError, NotFoundError } from "../../errors";

import { IPasswordService } from "../password/password.service";
import { IUserDatabase } from "./user.db";

import type { CreateUserDto } from "./dtos/create-user.dto";
import type { UpdateUserDto } from "./dtos/update-user.dto";
import type { UserDto } from "./dtos/user.dto";

export interface IUserService {
  createUser(createUserDto: CreateUserDto): Promise<UserDto>;
  findOrCreateUser(createUserDto: CreateUserDto): Promise<UserDto>;
  getUserByEmail(email: string): Promise<UserDto | null>;
  getUserById(userId: string): Promise<UserDto>;
  updateUser(id: string, updateUserDto: UpdateUserDto): Promise<UserDto>;
  verifyUserEmail(id: string): Promise<UserDto>;
}

export class UserService implements IUserService {
  private userDB: IUserDatabase;
  private passwordService: IPasswordService;

  constructor(userDB: IUserDatabase, passwordService: IPasswordService) {
    this.userDB = userDB;
    this.passwordService = passwordService;
  }

  async createUser(createUserDto: CreateUserDto): Promise<UserDto> {
    const { email } = createUserDto;

    const existingUser = await this.getUserByEmail(email);

    if (existingUser) {
      throw new ConflictError(ERROR_MESSAGES.EMAIL_ALREADY_EXISTS);
    }

    const hashedPassword = await this.passwordService.hashPassword(
      createUserDto.password
    );

    return await this.userDB.create({
      ...createUserDto,
      password: hashedPassword,
    });
  }

  async findOrCreateUser(createUserDto: CreateUserDto): Promise<UserDto> {
    const { email } = createUserDto;

    let user = await this.getUserByEmail(email);

    if (!user) {
      user = await this.createUser(createUserDto);
    }

    return user;
  }

  async getUserByEmail(email: string): Promise<UserDto | null> {
    const user = await this.userDB.findByEmail(email);

    return user;
  }

  async getUserById(userId: string): Promise<UserDto> {
    const user = await this.userDB.findById(userId);

    if (!user) {
      throw new NotFoundError(ERROR_MESSAGES.RESOURCE_NOT_FOUND);
    }

    return user;
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<UserDto> {
    const user = await this.getUserById(id);

    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existingUser = await this.getUserByEmail(updateUserDto.email);

      if (existingUser && existingUser.id !== id) {
        throw new BadRequestError(ERROR_MESSAGES.EMAIL_ALREADY_EXISTS);
      }
    }

    return await this.userDB.updateUser(id, updateUserDto);
  }

  async verifyUserEmail(id: string): Promise<UserDto> {
    return await this.userDB.updateUser(id, { isEmailVerified: true });
  }
}
