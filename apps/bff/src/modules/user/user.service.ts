import type { User } from "@tubenote/db";
import type { IUpdatePasswordDto, IUpdateUserDto } from "@tubenote/dtos";
import type { IApiSuccessResponse } from "@tubenote/types";

import { axiosInstance } from "@/lib/axios";
import { sessionCacheService } from "@/services";

export class UserService {
  async getCurrentUser(sessionId: string): Promise<IApiSuccessResponse<User>> {
    const sessionData = await sessionCacheService.getSession(sessionId);

    if (!sessionData || !sessionData.accessToken) {
      throw new Error("You must be logged in to view your profile");
    }

    const userRes = await axiosInstance.get<IApiSuccessResponse<User>>(`/users/me`, {
      headers: {
        "Authorization": `Bearer ${sessionData.accessToken}`,
        "X-Session-ID": sessionId,
      },
      withCredentials: true,
    });

    return userRes.data;
  }

  async updateUser(sessionId: string, userData: IUpdateUserDto): Promise<IApiSuccessResponse<User>> {
    const sessionData = await sessionCacheService.getSession(sessionId);

    if (!sessionData || !sessionData.accessToken) {
      throw new Error("You must be logged in to update your profile");
    }

    const userRes = await axiosInstance.put<IApiSuccessResponse<User>>(`/users/me`, userData, {
      headers: {
        "Authorization": `Bearer ${sessionData.accessToken}`,
        "X-Session-ID": sessionId,
      },
      withCredentials: true,
    });

    return userRes.data;
  }

  async updatePassword(sessionId: string, passwordData: IUpdatePasswordDto): Promise<IApiSuccessResponse<User>> {
    const sessionData = await sessionCacheService.getSession(sessionId);

    if (!sessionData || !sessionData.accessToken) {
      throw new Error("You must be logged in to update your password");
    }

    const userRes = await axiosInstance.put<IApiSuccessResponse<User>>(`/users/update-password`, passwordData, {
      headers: {
        "Authorization": `Bearer ${sessionData.accessToken}`,
        "X-Session-ID": sessionId,
      },
      withCredentials: true,
    });

    return userRes.data;
  }
}
