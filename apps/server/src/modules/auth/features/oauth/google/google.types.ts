import type { Response } from "express";

import type { TypedRequest } from "@/types";

import type { User } from "@modules/user/user.model";

import type { OAuthCodePayloadDto, OAuthResponseDto } from "@modules/auth/dtos";

export interface IGoogleAuthService {
  googleLogin(user: User): Promise<OAuthResponseDto>;
  generateTemporaryCode(
    temporaryCodePayloadDto: OAuthCodePayloadDto
  ): Promise<string>;
}
export interface IGoogleAuthController {
  googleLogin(req: TypedRequest, res: Response): Promise<void>;
}
