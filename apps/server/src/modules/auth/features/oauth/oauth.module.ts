import {
  cacheService,
  cryptoService,
  loggerService,
  prismaService,
} from "@/modules/shared/services";

import { userService } from "@/modules/user";
import { accountService } from "@/modules/user/features/account/account.module";

import { jwtService } from "../../utils";
import { refreshTokenService } from "../refresh-token";

import { OAuthController } from "./oauth.controller";
import { OAuthService } from "./oauth.service";

const oauthService = OAuthService.getInstance({
  prismaService,
  userService,
  accountService,
  refreshTokenService,
  jwtService,
  cryptoService,
  cacheService,
  loggerService,
});

const oauthController = OAuthController.getInstance({ oauthService });

export { oauthService, oauthController };
