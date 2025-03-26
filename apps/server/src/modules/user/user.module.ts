import {
  cryptoService,
  prismaService,
  responseFormatter,
} from "@/modules/shared/services";

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

const userController = UserController.getInstance({
  userService,
  responseFormatter,
});

export { userController, userService, userRepository };
