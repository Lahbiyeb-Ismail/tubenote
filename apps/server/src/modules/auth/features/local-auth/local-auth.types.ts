import type { Response } from "express";

import type { ILoginDto, IRegisterDto } from "@tubenote/dtos";
import type { User } from "@tubenote/types";

import type { TypedRequest } from "@/modules/shared/types";

import type { IAuthResponseDto } from "@/modules/auth/dtos";
import type { IClientContext } from "../refresh-token";

/**
 * Interface representing the local authentication service.
 */
export interface ILocalAuthService {
  /**
   * Registers a new user in the system.
   *
   * @param registerUserDto - The data transfer object containing user registration details.
   * @returns A promise that resolves to the created user or undefined if registration fails.
   */
  registerUser: (registerUserDto: IRegisterDto) => Promise<User | undefined>;

  /**
   * Logs in a user using their credentials.
   *
   * @param loginDto - The data transfer object containing user login details.
   * @returns A promise that resolves to an authentication response DTO.
   */
  loginUser: (
    loginDto: ILoginDto,
    deviceId: string,
    ipAddress: string,
    clientContext: IClientContext
  ) => Promise<IAuthResponseDto>;
}

/**
 * Interface representing the Local Authentication Controller.
 */
export interface ILocalAuthController {
  /**
   * Handles user registration.
   *
   * @param req - The request object containing the user registration data.
   * @param res - The response object used to send the result of the registration process.
   *
   * @returns A promise that resolves when the registration process is complete.
   */
  register(req: TypedRequest<IRegisterDto>, res: Response): Promise<void>;

  /**
   * Handles user login.
   *
   * @param req - The request object containing the user login credentials.
   * @param res - The response object used to send the result of the login process.
   *
   * @returns A promise that resolves when the login process is complete.
   */
  login(req: TypedRequest<ILoginDto>, res: Response): Promise<void>;
}
