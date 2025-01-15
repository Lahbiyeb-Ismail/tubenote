import prismaClient from "../../lib/prisma";
import { passwordService } from "../password/password.module";
import { UserController } from "./user.controller";
import { UserRepository } from "./user.repository";
import { UserService } from "./user.service";

const userRepository = new UserRepository(prismaClient);
const userService = new UserService(userRepository, passwordService);
const userController = new UserController(userService);

export { userController, userService, userRepository };
