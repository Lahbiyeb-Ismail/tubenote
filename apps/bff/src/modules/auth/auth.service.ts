import type { ILoginDto, IRegisterDto } from "@tubenote/dtos";
import type { IApiSuccessResponse } from "@tubenote/types";

import axios from "axios";
import { v4 as uuidv4 } from "uuid";

import type { ISessionData } from "@/services";

import { envConfig } from "@/config";
import { axiosInstance } from "@/lib/axios";
import { redisSessionService } from "@/services";

export class AuthService {
  async getSession(sessionId: string): Promise<ISessionData | null> {
    return redisSessionService.getSession(sessionId);
  }

  async register(credentials: IRegisterDto): Promise<IApiSuccessResponse<string>> {
    const registerRes = await axiosInstance.post<IApiSuccessResponse<string>>(`/auth/register`, credentials);

    return registerRes.data;
  }

  async login(credentials: ILoginDto): Promise<{ sessionId: string; data: IApiSuccessResponse<null> }> {
    const loginRes = await axiosInstance.post<IApiSuccessResponse<{ accessToken: string; refreshToken: string }>>(`/auth/login`, credentials);

    const authTokens = loginRes.data.payload.data;

    const sessionId = uuidv4();

    await redisSessionService.createSession(sessionId, authTokens, 60 * 60 * 24 * 1000); // 24 hours

    return { sessionId, data: {
      ...loginRes.data,
      payload: {
        ...loginRes.data.payload,
        data: null,
      },
    } };
  }

  async logout(sessionId: string): Promise<IApiSuccessResponse<null>> {
    const sessionData = await redisSessionService.getSession(sessionId);

    if (!sessionData || !sessionData.accessToken) {
      throw new Error("You must be logged in to log out");
    }

    // Call backend API to revoke refresh token
    const logoutRes = await axiosInstance.post<IApiSuccessResponse<null>>(`${envConfig.backend_api.url}/auth/logout`, { refreshToken: sessionData.refreshToken }, {
      headers: {
        "Authorization": `Bearer ${sessionData.accessToken}`,
        "X-Session-ID": sessionId,
      },
      withCredentials: true,
    });

    await redisSessionService.deleteSession(sessionId);

    return logoutRes.data;
  }

  async refresh(sessionId: string): Promise<{ sessionId: string; data: IApiSuccessResponse<null> }> {
    const sessionData = await redisSessionService.getSession(sessionId);

    if (!sessionData || !sessionData.refreshToken) {
      throw new Error("You must be logged in to refresh");
    }

    // Call backend API to refresh tokens
    const refreshRes = await axios.post<IApiSuccessResponse<{ accessToken: string; refreshToken: string }>>(`${envConfig.backend_api.url}/auth/refresh`, {}, {
      headers: {
        Authorization: `Bearer ${sessionData.refreshToken}`,
      },
      withCredentials: true,
    });

    const newAuthTokens = refreshRes.data.payload.data;

    await redisSessionService.createSession(sessionId, newAuthTokens, 60 * 60 * 24 * 1000); // 24 hours

    return { sessionId, data: {
      ...refreshRes.data,
      payload: {
        ...refreshRes.data.payload,
        data: null,
      },
    } };
  }
}
