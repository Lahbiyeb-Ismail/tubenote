import type { User } from "@tubenote/db";
import type { IUpdatePasswordDto, IUpdateUserDto } from "@tubenote/dtos";
import type { IApiSuccessResponse } from "@tubenote/types";

import type { ISessionData } from "@/types";

import { axiosInstance } from "@/lib/axios";

export class UserService {
  async getCurrentUser(sessionData: ISessionData): Promise<IApiSuccessResponse<User>> {
    const userRes = await axiosInstance.get<IApiSuccessResponse<User>>(`/users/me`, {
      headers: {
        "Authorization": `Bearer ${sessionData.accessToken}`,
        "X-Session-ID": sessionData.sessionId,
      },
    });

    return userRes.data;
  }

  async updateUser(sessionData: ISessionData, userData: IUpdateUserDto): Promise<IApiSuccessResponse<User>> {
    const userRes = await axiosInstance.put<IApiSuccessResponse<User>>(`/users/me`, userData, {
      headers: {
        "Authorization": `Bearer ${sessionData.accessToken}`,
        "X-Session-ID": sessionData.sessionId,
      },
    });

    return userRes.data;
  }

  async updatePassword(sessionData: ISessionData, passwordData: IUpdatePasswordDto): Promise<IApiSuccessResponse<User>> {
    const userRes = await axiosInstance.put<IApiSuccessResponse<User>>(`/users/update-password`, passwordData, {
      headers: {
        "Authorization": `Bearer ${sessionData.accessToken}`,
        "X-Session-ID": sessionData.sessionId,
      },
    });

    return userRes.data;
  }
}
