import type { Video } from "@tubenote/db";
import type { ISearchAndPaginationQueryDto } from "@tubenote/dtos";
import type { IApiSuccessResponse } from "@tubenote/types";

import type { ISessionData } from "@/types";

import { axiosInstance } from "@/lib/axios";

export class VideoService {
  async getVideosCount(sessionData: ISessionData): Promise<IApiSuccessResponse<number>> {
    const res = await axiosInstance.get<IApiSuccessResponse<number>>(`/videos/count`, {
      headers: {
        "Authorization": `Bearer ${sessionData.accessToken}`,
        "X-Session-ID": sessionData.sessionId,
      },
    });

    return res.data;
  }

  async findAll(sessionData: ISessionData, queryOptions: ISearchAndPaginationQueryDto): Promise<IApiSuccessResponse<Video[]>> {
    const { page, q, limit, order, sortBy } = queryOptions;

    const res = await axiosInstance.get<IApiSuccessResponse<Video[]>>(`/videos?page=${page}&q=${q}&limit=${limit}&order=${order}&sortBy=${sortBy}`, {
      headers: {
        "Authorization": `Bearer ${sessionData.accessToken}`,
        "X-Session-ID": sessionData.sessionId,
      },
    });

    return res.data;
  }

  async findVideoByYtVideoId(sessionData: ISessionData, ytVideoId: string): Promise<IApiSuccessResponse<Video>> {
    const res = await axiosInstance.get<IApiSuccessResponse<Video>>(`/videos/${ytVideoId}`, {
      headers: {
        "Authorization": `Bearer ${sessionData.accessToken}`,
        "X-Session-ID": sessionData.sessionId,
      },
    });

    return res.data;
  }
}
