import type { Response } from "express";

import type { TypedRequest } from "@/types";

import type { User } from "@modules/user/user.model";

import type { OauthLoginResponseDto } from "@modules/auth/dtos/oauth-login-response.dto";
import type { OAuthTemporaryCodePayloadDto } from "@modules/auth/dtos/oauth-temp-code-payload.dto";

export interface IGoogleAuthService {
  googleLogin(user: User): Promise<OauthLoginResponseDto>;
  generateTemporaryCode(
    temporaryCodePayloadDto: OAuthTemporaryCodePayloadDto
  ): Promise<string>;
}
export interface IGoogleAuthController {
  googleLogin(req: TypedRequest, res: Response): Promise<void>;
}
