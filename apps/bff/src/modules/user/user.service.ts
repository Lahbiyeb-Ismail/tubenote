import type { IApiSuccessResponse } from "@tubenote/types";

import { axiosInstance } from "@/lib/axios";
import { sessionCacheService } from "@/services";

export class UserService {
  async getCurrentUser(sessionId: string): Promise<IApiSuccessResponse<any>> {
    const sessionData = await sessionCacheService.getSession(sessionId);

    if (!sessionData || !sessionData.accessToken) {
      throw new Error("You must be logged in to view your profile");
    }

    const userRes = await axiosInstance.get<IApiSuccessResponse<any>>(`/users/me`, {
      headers: {
        "Authorization": `Bearer ${sessionData.accessToken}`,
        "X-Session-ID": sessionId,
      },
      withCredentials: true,
    });

    return userRes.data;
  }
}
