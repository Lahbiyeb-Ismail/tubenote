import { prismaClient } from "@/modules/shared/config";
import { cryptoService } from "@/modules/shared/services";

import { accountService } from "./features/account/account.module";
import { UserController } from "./user.controller";
import { UserRepository } from "./user.repository";
import { UserService } from "./user.service";

const userRepository = new UserRepository(prismaClient);
const userService = new UserService(
  userRepository,
  accountService,
  cryptoService
);
const userController = new UserController(userService);

export { userController, userService, userRepository };
