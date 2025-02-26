import type { Response } from "express";

import type { TypedRequest } from "@modules/shared";

import type { User } from "@modules/user";

import type { OAuthCodePayloadDto, OAuthResponseDto } from "@modules/auth";

export interface IGoogleAuthService {
  googleLogin(user: User): Promise<OAuthResponseDto>;
  generateTemporaryCode(
    temporaryCodePayloadDto: OAuthCodePayloadDto
  ): Promise<string>;
}
export interface IGoogleAuthController {
  googleLogin(req: TypedRequest, res: Response): Promise<void>;
}
