import { cryptoService, prismaService } from "@/modules/shared/services";

import { accountService } from "./features/account/account.module";
import { UserController } from "./user.controller";
import { UserRepository } from "./user.repository";
import { UserService } from "./user.service";

const userRepository = UserRepository.getInstance({ db: prismaService });

const userService = UserService.getInstance({
  userRepository,
  accountService,
  prismaService,
  cryptoService,
});

const userController = UserController.getInstance({ userService });

export { userController, userService, userRepository };
