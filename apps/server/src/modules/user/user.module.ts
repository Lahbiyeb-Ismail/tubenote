import prismaClient from "@config/database.config";

import { cryptoService } from "@modules/utils/crypto";

import { UserController, UserRepository, UserService } from "@modules/user";

const userRepository = new UserRepository(prismaClient);
const userService = new UserService(userRepository, cryptoService);
const userController = new UserController(userService);

export { userController, userService, userRepository };
