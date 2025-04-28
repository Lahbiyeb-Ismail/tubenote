import {
  cryptoService,
  loggerService,
  prismaService,
  rateLimitService,
  responseFormatter,
} from "@/modules/shared/services";

import { refreshTokenService } from "../auth";

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
  refreshTokenService,
});

const userController = UserController.getInstance({
  userService,
  responseFormatter,
  rateLimitService,
  loggerService,
});

export { userController, userService, userRepository };
