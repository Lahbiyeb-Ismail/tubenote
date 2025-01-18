import type { Response } from "express";
import type { TypedRequest } from "../../../../types";
import type { User } from "../../../user/user.model";
import type { LoginResponseDto } from "../../dtos/login-response.dto";

export interface IGoogleAuthService {
  googleLogin(user: User): Promise<LoginResponseDto>;
}
export interface IGoogleAuthController {
  googleLogin(req: TypedRequest, res: Response): Promise<void>;
}
