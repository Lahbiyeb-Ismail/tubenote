import { loggerService, prismaService } from "@/modules/shared/services";

import { userService } from "@/modules/user";
import { accountService } from "@/modules/user/features/account/account.module";

import { jwtService } from "../../utils";
import { refreshTokenService } from "../refresh-token";

import { OAuthService } from "./oauth.service";

export const oauthService = OAuthService.getInstance({
  prismaService,
  userService,
  accountService,
  refreshTokenService,
  jwtService,
  loggerService,
});
