import type { Response } from "express";

import type { TypedRequest } from "@/modules/shared/types";

import type { ILogoutDto } from "./dtos";

export interface IAuthService {
  logoutUser(logoutDto: ILogoutDto): Promise<void>;
}

export interface IAuthController {
  logout(req: TypedRequest, res: Response): Promise<void>;
}
