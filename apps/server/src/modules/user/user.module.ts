import prismaClient from "@config/database.config";

import { passwordHasherService } from "@modules/auth/core/services/password-hasher/password-hasher.module";

import { UserController } from "./user.controller";
import { UserRepository } from "./user.repository";
import { UserService } from "./user.service";

const userRepository = new UserRepository(prismaClient);
const userService = new UserService(userRepository, passwordHasherService);
const userController = new UserController(userService);

export { userController, userService, userRepository };
