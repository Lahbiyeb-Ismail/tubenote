import type { Response } from "express";

import type { IResponseFormatter } from "@/modules/shared/services";
import type { TypedRequest } from "@/modules/shared/types";

import type { ILogoutDto } from "./dtos";
import type { IRefreshTokenService } from "./features";

export interface IAuthService {
  logoutUser(logoutDto: ILogoutDto): Promise<void>;
}

export interface IAuthController {
  logout(req: TypedRequest, res: Response): Promise<void>;
}

export interface IAuthServiceOptions {
  refreshTokenService: IRefreshTokenService;
}

export interface IAuthControllerOptions {
  authService: IAuthService;
  responseFormatter: IResponseFormatter;
}
