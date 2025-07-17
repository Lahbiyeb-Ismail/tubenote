import type { IApiSuccessResponse } from "@tubenote/types";

import axios from "axios";

import { envConfig } from "@/config";
import { redisSessionService } from "@/services";

export class UserService {
  async getCurrentUser(sessionId: string): Promise<IApiSuccessResponse<any>> {
    const sessionData = await redisSessionService.getSession(sessionId);

    if (!sessionData || !sessionData.accessToken) {
      throw new Error("You must be logged in to view your profile");
    }

    const userRes = await axios.get<IApiSuccessResponse<any>>(`${envConfig.backend_api.url}/users/me`, {
      headers: {
        Authorization: `Bearer ${sessionData.accessToken}`,
      },
      withCredentials: true,
    });

    return userRes.data;
  }
}
