import type { Response } from "express";

import type { TypedRequest } from "@/types";

import type { LogoutUserDto } from "./dtos/logout-user.dto";

export interface IAuthService {
  logoutUser(logoutUserDto: LogoutUserDto): Promise<void>;
}

export interface IAuthController {
  logout(req: TypedRequest, res: Response): Promise<void>;
}
